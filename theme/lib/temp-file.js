const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const os = require('os');
const debug = require('util').debuglog('tempfile');
let _created = [];
class TempFile {
    constructor(contents, ext = '') {
      _created.push(this);
        const filename = 'temp' + crypto.randomBytes(16).toString('hex');
        this.path = path.join(os.tmpdir(), `${filename}${ext}`);
        if (contents) {
            this.write(contents);
        }
    }
    write(contents) {
        fs.writeFileSync(this.path, contents, 'utf8');
        this.contents = contents;
    }
    read() {
        this.contents = fs.readFileSync(this.path, 'utf8');
        return this.contents;
    }
    destroy() {
        try {
            fs.unlinkSync(this.path);
            debug(`TempFile deleted at ${this.path}`);
        } catch (e) {
            debug(`Unable to delete TempFile at ${this.path}`);
        }
    }
}
TempFile.destroyAll = () => {
  let file;
  while (file = _created.pop()) {
    file.destroy();
  }
}
module.exports = TempFile;