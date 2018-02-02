const debug = require('util').debuglog('ECRunner');
const cp = require('child_process');
/**
 * For testing clarity, don't rely on the Node magic of util.promisify.
 * Manually promisify exec.
 */
const exec = (cmd, opts) =>
    new Promise((res, rej) => {
        cp.exec(cmd, opts, (err, stdout, stderr) => {
            if (err) {
                err.message = [err.message, stderr, stdout].join('\n');
                rej(err);
            } else {
                res(stdout);
            }
        });
    });
const execSync = cp.execSync;
class ExternalCommandRunner {
    static get DEFAULT_OPTS() {
        return {
            encoding: 'utf8'
        };
    }
    constructor(cmd) {
        this.cmd = cmd;
    }
    _shellOutWith(execute, args, pref, opts) {
        const spacedPref = pref && pref + ' ';
        const fullOpts = Object.assign(
            ExternalCommandRunner.DEFAULT_OPTS,
            opts
        );
        const fullCmd = `${spacedPref}${this.cmd} ${args}`;
        debug(`running ${fullCmd}`);
        return execute(fullCmd, fullOpts);
    }
    _sync(args, pref, opts) {
        const val = this._shellOutWith(execSync, args, pref, opts);
        debug({ [this.cmd + ' ' + args]: val });
        return val;
    }
    _async(args, pref, opts) {
        return this._shellOutWith(exec, args, pref, opts).then(val => {
            debug({ [this.cmd + ' ' + args]: val });
            return val;
        });
    }
    _sudoOutWith(method, args, opts) {
        if (opts && opts.prompt) {
            const optsCopy = Object.assign({}, opts);
            delete optsCopy.prompt;
            return method.call(
                this,
                args,
                `sudo -p "${opts.prompt}"`,
                optsCopy
            );
        }
        return method.call(this, args, 'sudo', opts);
    }
    run(args, opts) {
        return this._async(args, '', opts);
    }
    runSync(args, opts) {
        return this._sync(args, '', opts);
    }
    sudo(args, opts) {
        return this._sudoOutWith(this._async, args, opts);
    }
    sudoSync(args, opts) {
        return this._sudoOutWith(this._sync, args, opts);
    }
    trySudo(args, opts) {
        return this._async(args, 'sudo -n', opts).catch(e => e);
    }
    trySudoSync(args, opts) {
        let result;
        try {
            result = this._sync(args, 'sudo -n', opts);
        } catch (e) {
            return e;
        }
        return result;
    }
}
module.exports = ExternalCommandRunner;
