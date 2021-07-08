import { format } from 'util';
import validator from '../src/index';

function test(options) {
  let data = options.data || [];

  let l = data.length;

  if (l === 0) {
    return;
  }

  let i = 0;

  for (i; i < l; i++) {
    const validatorFinal = validator[options.validator];

    if (!validatorFinal) {
      throw new Error(`${options.validator} is an unknown validator.`)
    }

    const validatorResult = validatorFinal(data[i].input);

    if (JSON.stringify(validatorResult) !== options.data[i].output) {
      let warning = format(
        'validator.%s(%s) failed but should have passed',
        options.validator, data[i].input
      );

      throw new Error(warning);
    }
  }
}

describe('Inspectors', () => {
  it('should inspect hash strings', () => {
    test({
      validator: 'inspectHash',
      data: [
        {
          input: 'd94f3f01', // length 8
          output: '{"isValid":true,"properties":{"algorithms":["crc32","crc32b"],"lenght":8},"propertiesTotal":2}',
        },
        {
          input: 'd94f3f016ae679c3008de268209132f2', // length 32
          output: '{"isValid":true,"properties":{"algorithms":["md5","md4","ripemd128","tiger128"],"lenght":32},"propertiesTotal":2}',
        },
        {
          input: '3ca25ae354e192b26879f651a51d92aa8a34d8d3', // length 40
          output: '{"isValid":true,"properties":{"algorithms":["sha1","ripemd160","tiger160"],"lenght":40},"propertiesTotal":2}',
        },
        {
          input: '6281a1f098c5e7290927ed09150d43ff3990a0fe1a48267c', // length 48
          output: '{"isValid":true,"properties":{"algorithms":["tiger192"],"lenght":48},"propertiesTotal":2}',
        },
        {
          input: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', // length 64
          output: '{"isValid":true,"properties":{"algorithms":["sha256"],"lenght":64},"propertiesTotal":2}',
        },
        {
          input: '3fed1f814d28dc5d63e313f8a601ecc4836d1662a19365cbdcf6870f6b56388850b58043f7ebf2418abb8f39c3a42e31', // length 96
          output: '{"isValid":true,"properties":{"algorithms":["sha384"],"lenght":96},"propertiesTotal":2}',
        },
        {
          input: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043', // length 128
          output: '{"isValid":true,"properties":{"algorithms":["sha512"],"lenght":128},"propertiesTotal":2}',
        },
        {
          input: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec0439', // length 129
          output: '{"isValid":false,"properties":{"algorithms":[],"lenght":129},"propertiesTotal":2}'
        },
        {
          input: 'Xb71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043X', // length 129 and "X" at the start and end of string
          output: '{"isValid":false,"properties":{"algorithms":[],"lenght":129},"propertiesTotal":2}'
        },
        {
          input: '424242', // length 6
          output: '{"isValid":false,"properties":{"algorithms":[],"lenght":6},"propertiesTotal":2}'
        }
      ]
    });
  });
});
