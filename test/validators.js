import assert from 'assert';
import fs from 'fs';
import vm from 'vm';

let validator_js = fs.readFileSync(require.resolve('../validator.js')).toString();

describe('Validators', () => {
  it('should define the module using an AMD-compatible loader', () => {
    let window = {
      validator: null,
      define(module) {
        window.validator = module();
      },
    };
    window.define.amd = true;

    let sandbox = vm.createContext(window);
    vm.runInContext(validator_js, sandbox);
    assert.strictEqual(window.validator.trim('  foobar '), 'foobar');
  });

  it('should bind validator to the window if no module loaders are available', () => {
    let window = {};
    let sandbox = vm.createContext(window);
    vm.runInContext(validator_js, sandbox);
    assert.strictEqual(window.validator.trim('  foobar '), 'foobar');
  });
});


// ============================================================ //
// Do not add any individual validator test cases to this file! //
// Create separate subfiles to ./validators folder instead      //
// ============================================================ //
