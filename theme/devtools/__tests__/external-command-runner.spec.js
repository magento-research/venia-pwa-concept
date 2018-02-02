const { nodeCb } = require('./__helpers__/mock-fn-utils');
const execSync = jest.fn(() => 'cmd stdout');
const exec = jest.fn(nodeCb(null, 'cmd stdout'));
jest.doMock('child_process', () => ({ execSync, exec }));
const ECRunner = require('../external-command-runner');
const opts = { encoding: 'utf8' };
let runner;
beforeEach(() => {
    runner = new ECRunner('foo');
    jest.clearAllMocks();
});
test('constructs an ECRunner instance with a cmd property from ctr arg', () => {
    expect(runner).toMatchObject({
        cmd: 'foo'
    });
});
test('.run() returns a Promise for the stdout of an asynchronous shell command', async () => {
    const result = await runner.run('arg1 arg2');
    expect(exec).toHaveBeenCalledWith(
        'foo arg1 arg2',
        opts,
        expect.any(Function)
    );
    expect(result).toBe('cmd stdout');
});
test('.run() with a second argument merges options', async () => {
    const result = await runner.run('arg1 arg2', { cwd: 'somewhere' });
    expect(exec).toHaveBeenCalledWith(
        'foo arg1 arg2',
        expect.objectContaining({ encoding: 'utf8', cwd: 'somewhere' }),
        expect.any(Function)
    );
    expect(result).toBe('cmd stdout');
});
test('runs a synchronous shell command with .runSync()', () => {
    const result = runner.runSync('arg1 arg2');
    expect(result).toBe('cmd stdout');
    expect(execSync).toHaveBeenCalledWith('foo arg1 arg2', opts);
});
test('runs the same command under sudo with .sudo()', async () => {
    const result = await runner.sudo('arg1 arg2');
    expect(exec).toHaveBeenCalledWith(
        'sudo foo arg1 arg2',
        opts,
        expect.any(Function)
    );
    return expect(result).toBe('cmd stdout');
});
test('.sudo() works with one argument just like .run()', async () => {
    await runner.sudo('arg1 arg2');
    expect(exec).toHaveBeenCalledWith(
        'sudo foo arg1 arg2',
        opts,
        expect.any(Function)
    );
});
test('.sudo() calls sudo with a custom prompt when opts contains a prompt prop', async () => {
    await runner.sudo('arg1 arg2', { prompt: 'custom prompt' });
    expect(exec).toHaveBeenCalledWith(
        'sudo -p "custom prompt" foo arg1 arg2',
        opts,
        expect.any(Function)
    );
});
test('runs the same command synchronously under sudo with .sudoSync()', () => {
    const result = runner.sudoSync('arg1 arg2');
    expect(result).toBe('cmd stdout');
    expect(execSync).toHaveBeenCalledWith('sudo foo arg1 arg2', opts);
    runner.sudoSync(null, 'arg1 arg2');
    expect(execSync).toHaveBeenCalledWith('sudo foo arg1 arg2', opts);
    runner.sudoSync('arg1 arg2', { prompt: 'custom prompt' });
    expect(execSync).toHaveBeenCalledWith(
        'sudo -p "custom prompt" foo arg1 arg2',
        opts
    );
});
test('.trySudo runs the same command asynchronously with "sudo -n" to avoid prompt and fails silently', async () => {
    const result = await runner.trySudo('arg1 arg2');
    expect(result).toBe('cmd stdout');
    expect(exec).toHaveBeenCalledWith(
        'sudo -n foo arg1 arg2',
        opts,
        expect.any(Function)
    );
    exec.mockImplementationOnce(nodeCb(Error('Sudo failed')));
    await expect(runner.trySudo('arg1 arg2')).resolves.toThrowError(
        'Sudo failed'
    );
});
test('.trySudoSync runs the same command synchronously with "sudo -n" to avoid prompt and fail silently', () => {
    const result = runner.trySudoSync('arg1 arg2');
    expect(result).toBe('cmd stdout');
    expect(execSync).toHaveBeenCalledWith('sudo -n foo arg1 arg2', opts);
    execSync.mockImplementationOnce(() => {
        throw Error('Sudo failed');
    });
    expect(() => runner.trySudoSync('arg1 arg2')).not.toThrow();
});
