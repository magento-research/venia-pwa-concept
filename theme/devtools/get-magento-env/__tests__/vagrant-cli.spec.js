jest.mock('child_process');
const { exec } = require('child_process');
const {
    globalStatusOutput,
    parsedMachines
} = require('../__fixtures__/vagrant-cli-responses.json');
const { nodeCb } = require('../../__tests__/__helpers__/mock-fn-utils');
const VagrantCLI = require('../vagrant-cli');
exec.mockImplementation(nodeCb(null, globalStatusOutput));
let vagrantCLI;
beforeEach(() => {
    vagrantCLI = new VagrantCLI();
    jest.clearAllMocks();
});
test('#globalStatus() parses output', async () => {
    const machines = await vagrantCLI.globalStatus();
    expect(machines).toHaveLength(3);
    expect(machines).toEqual(parsedMachines);
});
test('#globalStatus() throws when no header line', () => {
    exec.mockImplementationOnce(nodeCb(null, `brokenlol`));
    return expect(vagrantCLI.globalStatus()).rejects.toThrow(
        'Unrecognized input'
    );
});
test('#globalStatus() throws when machine row has too many columns', () => {
    exec.mockImplementationOnce(
        nodeCb(null, `col1 col2\n-\nf1 f2 f3\njbh jhb kjbh kjahbsd`)
    );
    return expect(vagrantCLI.globalStatus()).rejects.toThrowError(
        'Expected "f1,f2,f3" to match "col1,col2"'
    );
});
test('#nameToMachines() returns a list of machines from a name', async () => {
    const ids = await vagrantCLI.nameToMachines('magento2.vagrant89');
    expect(ids).toHaveLength(1);
    expect(ids[0]).toHaveProperty('id', 'c9b8add');
    const ids2 = await vagrantCLI.nameToMachines('magento2.vagrant96');
    expect(ids2).toHaveLength(2);
    expect(ids2[0]).toHaveProperty('id', '0ce65ca');
    expect(ids2[1]).toHaveProperty('id', '78ddaea');
});
test('#shellSession returns a function that calls vagrant ssh with commands', async () => {
    const [machine] = await vagrantCLI.nameToMachines('magento2.vagrant89');
    const mssh = vagrantCLI.shellSession(machine);
    expect(mssh).toBeInstanceOf(Function);
    exec.mockImplementationOnce(nodeCb(null, 'vm stdout, lol'));
    const response = await mssh('vm remote command');

    expect(exec).toHaveBeenCalledWith(
        `vagrant ssh -c 'vm remote command' -- -T`,
        expect.objectContaining({
            cwd: '/Users/jzetlen/gits/pwa/vagrant-magento'
        }),
        expect.any(Function)
    );
    expect(response).toBe('vm stdout, lol');
});
test('#shellSession correctly escapes single quotes in remote commands', async () => {
    const [machine] = await vagrantCLI.nameToMachines('magento2.vagrant89');
    const mssh = vagrantCLI.shellSession(machine);
    await mssh("has'single'quotes");
    expect(exec.mock.calls[1][0]).toBe(
        `vagrant ssh -c 'has'"'"'single'"'"'quotes' -- -T`
    );
});
