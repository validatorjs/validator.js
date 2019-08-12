const twitterHandle = /^(?=.*[A-z]|[\d]*_+[\d]*)[\w_]{5,15}$/;

export default function isTwitterHandle(username) {
  return twitterHandle.test(username);
}
