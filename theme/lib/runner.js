const debug = require('util').debuglog('runner');
const cp = require('child_process');
class Runner {
    constructor(cmd) {
        this.cmd = cmd;
    }
    run(args, pref = '') {
        const fullCmd = `${pref}${this.cmd} ${args}`;
        debug(`running ${fullCmd}`);
        return cp.execSync(fullCmd, { encoding: 'utf8' });
    }
    sudo(prompt, cmd) {
        if (prompt && cmd) {
            return this.run(cmd, `sudo -p "${prompt}" `);
        }
        return this.run(cmd || prompt, 'sudo ');
    }
}
module.exports = Runner;
