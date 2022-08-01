export default function queryStrToObject(url) {
  let output = {};
  if (url !== '' && url !== undefined) {
    let split_url = url.split('?');
    let amp_split = split_url[split_url.length - 1].split('&');
    for (let i = 0; i < amp_split.length; i++) {
      let split_equal = amp_split[i].split('=');
      output[split_equal[0]] = split_equal[1];
    }
  } else {
    throw new Error('Url can\'t be empty or undefined string');
  }
  return output;
}
