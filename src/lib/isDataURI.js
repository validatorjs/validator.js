import assertString from './util/assertString';

const dataURI = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+\=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;;

export default function isDataURI(str) {
  assertString(str);
  return dataURI.test(str);
}
