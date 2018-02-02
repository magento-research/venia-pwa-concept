const Runner = require('../external-command-runner');

module.exports = class VagrantCLI {
    constructor() {
        this.runner = new Runner('vagrant');
    }

    /**
     * Naive, stringy way to parse vagrant global-status.
     * No need to make this more formal while Vagrant still makes no
     * guarantees about its format.
     * Machine-readable shell output is not on the roadmap:
     * https://github.com/hashicorp/vagrant/issues/8017
     * @return Promise<Object[]>;
     */
    async globalStatus() {
        const output = await this.runner.run('global-status');
        const lines = output.trim().split('\n');

        // this seems safe enough
        const headerLine = lines[0];

        const delimRE = /\s+/;
        // without space chars, there's no way to parse this safely i think!
        if (!delimRE.test(headerLine)) {
            throw Error(`Unrecognized input: ${output}`);
        }

        const fields = headerLine.trim().split(delimRE);

        // limit to lines that are part of the table, assuming a header and
        // horizontal line above it and a blank line after
        const machineRows = lines.slice(
            2,
            // locate first blank (falsy) line
            lines.findIndex(l => !l.trim())
        );

        // make the return array by folding over non-header rows looking
        // for parseable machine rows
        return machineRows.reduce((machines, line) => {
            // assume that it is a machine row when the line has the same number of columns.
            const values = line.trim().split(delimRE);
            // so if it doesn't have the same number, die
            if (values.length !== fields.length) {
                throw Error(`Expected "${values}" to match "${fields}"`);
            }
            // fold over the field names, zipping them into an object
            // with values
            const machine = fields.reduce((out, field, index) => {
                out[field] = values[index];
                return out;
            }, {});
            return machines.concat(machine);
        }, []);
    }
    /**
     * Vagrant does not enforce unique names, so a name may refer to more than
     * one machine.
     * @param {string} name
     */
    async nameToMachines(name) {
        const machines = await this.globalStatus();
        return machines.filter(machine => machine.name === name);
    }
    shellSession(machine) {
        return cmd => {
            const escaped = cmd.split("'").join("'\"'\"'");
            return this.runner.run(`ssh -c '${escaped}' -- -T`, {
                cwd: machine.directory
            });
        };
    }
};
