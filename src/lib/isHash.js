import assertString from './util/assertString';
import merge from './util/merge';

const defaultHashOptions = {
  validateAlgorithm: true,
};

const lengths = {
  md5: 32,
  md4: 32,
  sha1: 40,
  sha256: 64,
  sha384: 96,
  sha512: 128,
  ripemd128: 32,
  ripemd160: 40,
  tiger128: 32,
  tiger160: 40,
  tiger192: 48,
  crc32: 8,
  crc32b: 8,
};

export default function isHash(str, algorithm, options) {
  assertString(str);
  const { validateAlgorithm } = merge(options, defaultHashOptions);
  if (validateAlgorithm && !Object.prototype.hasOwnProperty.call(lengths, algorithm)) {
    throw new Error(`Invalid algorithm '${algorithm}'`);
  }
  const hash = new RegExp(`^[a-fA-F0-9]{${lengths[algorithm]}}$`);
  return hash.test(str);
}
