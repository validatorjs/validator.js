const twitterHandle = /^(?=.*[a-zA-Z]|[0-9]*_+[0-9]*)[a-zA-Z0-9_]{5,15}$/;

export default function isTwitterHandle(username) {
  return twitterHandle.test(username);
}
