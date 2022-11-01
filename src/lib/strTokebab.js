export default function strTokebab(str) {
  str = str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  let newstr = '';
  let split = str.split(' ');
  for (let i = 0; i < split.length; i++) {
    newstr += split[i];
    if (split.length - 1 !== i) {
      newstr += '-';
    }
  }
  return newstr;
}
