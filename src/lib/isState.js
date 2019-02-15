import assertString from './util/assertString';

const stateLookupMap = {
  us: {
    alabama: 'al',
    alaska: 'ak',
    arizona: 'az',
    arkansas: 'ar',
    california: 'ca',
    colorado: 'co',
    connecticut: 'ct',
    delaware: 'de',
    'district of columbia': 'dc',
    florida: 'fl',
    georgia: 'ga',
    hawaii: 'hi',
    idaho: 'id',
    illinois: 'il',
    indiana: 'in',
    iowa: 'ia',
    kansas: 'ks',
    kentucky: 'ky',
    louisiana: 'la',
    maine: 'me',
    maryland: 'md',
    massachusetts: 'ma',
    michigan: 'mi',
    minnesota: 'mn',
    mississippi: 'ms',
    missouri: 'mo',
    montana: 'mt',
    nebraska: 'ne',
    nevada: 'nv',
    'new hampshire': 'nh',
    'new jersey': 'nj',
    'new mexico': 'nm',
    'new york': 'ny',
    'north carolina': 'nc',
    'north dakota': 'nd',
    ohio: 'oh',
    oklahoma: 'ok',
    oregon: 'or',
    pennsylvania: 'pa',
    'rhode island': 'ri',
    'south carolina': 'sc',
    'south dakota': 'sd',
    tennessee: 'tn',
    texas: 'tx',
    utah: 'ut',
    vermont: 'vt',
    virginia: 'va',
    washington: 'wa',
    'washington state': 'wa',
    'west virginia': 'wv',
    wisconsin: 'wi',
    wyoming: 'wy',
    'puerto rico': 'pr',
  },
  ca: {
    alberta: 'ab',
    'british columbia': 'bc',
    manitoba: 'mb',
    'new brunswick': 'nb',
    'newfoundland and labrador': 'nl',
    'northwest territories': 'nt',
    'nova scotia': 'ns',
    nunavut: 'nu',
    ontario: 'on',
    'prince edward island': 'pe',
    saskatchewan: 'sk',
    yukon: 'yt',
    quebec: 'qc',
  },
};

const locales = Object.keys(stateLookupMap);
const buildSearch = aggFn => (str, locale = 'any') => {
  assertString(str);
  return locales
    .filter(validLoc =>
      new Array(locale === 'any' ? locales : locale)
        .flatMap(x => x)
        .map(x => x.toLowerCase())
        .includes(validLoc))
    .map(loc => stateLookupMap[loc])
    .flatMap(aggFn)
    .includes(str.toLowerCase());
};

const isStateCode = buildSearch(Object.values);
const isStateName = buildSearch(Object.keys);

const isStateCodeOrName = (...args) =>
  [isStateCode, isStateName]
    .map(fn => fn(...args))
    .some(x => x);

export {
  locales,
  isStateName,
  isStateCode,
  isStateCodeOrName,
};
