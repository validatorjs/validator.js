import assertString from './util/assertString'

function decodeBase64Url (str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = str.length % 4
  if (pad) str += '='.repeat(4 - pad)

  if (typeof Buffer !== 'undefined') {
    // Node.js
    return Buffer.from(str, 'base64').toString('utf8')
  } else if (typeof atob !== 'undefined') {
    // Browser
    return atob(str)
  } else {
    throw new Error('No base64 decoder available')
  }
}

export default function isJWT (str) {
  assertString(str)

  const parts = str.split('.')
  if (parts.length !== 3) return false
  try {
    const header = JSON.parse(decodeBase64Url(parts[0]))
    const payload = JSON.parse(decodeBase64Url(parts[1]))

    if (typeof header !== 'object' || header === null) return false
    if (typeof payload !== 'object' || payload === null) return false
    if (typeof header.alg !== 'string') return false

    return true
  } catch (e) {
    return false
  }

}
