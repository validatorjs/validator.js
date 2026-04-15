import assert from 'assert';
import fs from 'fs';
import vm from 'vm';
import test from './testFunctions';

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

  it('should validate mailto URI', () => {
    test({
      validator: 'isMailtoURI',
      valid: [
        'mailto:?subject=something&cc=valid@mail.com',
        'mailto:?subject=something&cc=valid@mail.com,another@mail.com,',
        'mailto:?subject=something&bcc=valid@mail.com',
        'mailto:?subject=something&bcc=valid@mail.com,another@mail.com',
        'mailto:?bcc=valid@mail.com,another@mail.com',
        'mailto:?cc=valid@mail.com,another@mail.com',
        'mailto:?cc=valid@mail.com',
        'mailto:?bcc=valid@mail.com',
        'mailto:?subject=something&body=something else',
        'mailto:?subject=something&body=something else&cc=hello@mail.com,another@mail.com',
        'mailto:?subject=something&body=something else&bcc=hello@mail.com,another@mail.com',
        'mailto:?subject=something&body=something else&cc=something@mail.com&bcc=hello@mail.com,another@mail.com',
        'mailto:hello@mail.com',
        'mailto:info@mail.com?',
        'mailto:hey@mail.com?subject=something',
        'mailto:info@mail.com?subject=something&cc=valid@mail.com',
        'mailto:info@mail.com?subject=something&cc=valid@mail.com,another@mail.com,',
        'mailto:info@mail.com?subject=something&bcc=valid@mail.com',
        'mailto:info@mail.com?subject=something&bcc=valid@mail.com,another@mail.com',
        'mailto:info@mail.com?bcc=valid@mail.com,another@mail.com',
        'mailto:info@mail.com?cc=valid@mail.com,another@mail.com',
        'mailto:info@mail.com?cc=valid@mail.com',
        'mailto:info@mail.com?bcc=valid@mail.com&',
        'mailto:info@mail.com?subject=something&body=something else',
        'mailto:info@mail.com?subject=something&body=something else&cc=hello@mail.com,another@mail.com',
        'mailto:info@mail.com?subject=something&body=something else&bcc=hello@mail.com,another@mail.com',
        'mailto:info@mail.com?subject=something&body=something else&cc=something@mail.com&bcc=hello@mail.com,another@mail.com',
        'mailto:',
      ],
      invalid: [
        '',
        'something',
        'valid@gmail.com',
        'mailto:?subject=okay&subject=444',
        'mailto:?subject=something&wrong=888',
        'mailto:somename@ｇｍａｉｌ.com',
        'mailto:hello@world.com?cc=somename@ｇｍａｉｌ.com',
        'mailto:hello@world.com?bcc=somename@ｇｍａｉｌ.com',
        'mailto:hello@world.com?bcc=somename@ｇｍａｉｌ.com&bcc',
        'mailto:valid@gmail.com?subject=anything&body=nothing&cc=&bcc=&key=',
        'mailto:hello@world.com?cc=somename',
        'mailto:somename',
        'mailto:info@mail.com?subject=something&body=something else&cc=something@mail.com&bcc=hello@mail.com,another@mail.com&',
        'mailto:?subject=something&body=something else&cc=something@mail.com&bcc=hello@mail.com,another@mail.com&',
      ],
    });
  });
});
