import assertString from './util/assertString';

const firestoreId = {
  generated: /^[a-zA-Z0-9]{20}$/,
  custom: /^(?!\.\.?$)(?!__.*__$)([^\/]{1,1500})$/,
};

export default function isFirestoreId(str, type = 'generated') {
  assertString(str);
  const pattern = firestoreId[type];
  return pattern && pattern.test(str);
}
