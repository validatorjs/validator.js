export default function merge(obj = { }, defaults) {
  return { ...defaults, ...obj };
}
