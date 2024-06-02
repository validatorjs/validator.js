import assertString from './util/assertString';

const openAIKey = /^sk-[A-Za-z0-9]{48}$/;


export default function isOpenAIKey(str) {
  assertString(str);
  return openAIKey.test(str);
}
