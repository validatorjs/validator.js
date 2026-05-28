import assertString from './util/assertString';

export default function rtrim(str, chars) {
  assertString(str);
  if (chars) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    const pattern = new RegExp(`[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`, 'g');
    return str.replace(pattern, '');
  }
  // Use a faster and more safe than regex trim method https://blog.stevenlevithan.com/archives/faster-trim-javascript
  let strIndex = str.length - 1;
  while (/\s/.test(str.charAt(strIndex))) {
    strIndex -= 1;
  }

  return str.slice(0, strIndex + 1);
}
