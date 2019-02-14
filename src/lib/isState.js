import assertString from './util/assertString';
// source: https://www.ups.com/worldshiphelp/WS14/ENU/AppHelp/Codes/State_Province_Codes.htm
const validStateCodes = {
  US: [
    'AL',
    'AK',
    'AS',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FL',
    'GA',
    'GU',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MH',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'MP',
    'OH',
    'OK',
    'OR',
    'PW',
    'PA',
    'PR',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VI',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ],
  CA: [
    'AB',
    'BC',
    'MB',
    'NB',
    'NL',
    'NT',
    'NS',
    'NU',
    'ON',
    'PE',
    'QC',
    'SK',
    'YT',
  ],
};

const validStateNames = {
  US: [
    'District of Columbia',
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ],
  CA: [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Northwest Territories',
    'Nova Scotia',
    'Nunavut',
    'Ontario',
    'Saskatchewan',
    'Yukon',
  ],
};

const getArraysFromObjByKeys = (keys, obj) =>
  [].concat(...keys.map(key => obj[key])).filter(x => x);
const combineSimilarArrays = (keys, objs) =>
  [].concat(...objs.map(obj => getArraysFromObjByKeys(keys, obj)));

export default function isState(str, options = { locale: 'any', codesOnly: false, namesOnly: false }) {
  assertString(str);
  const { codesOnly, namesOnly, locale } = options;
  let useLocale = [];
  let objectToUse = {};

  if (Array.isArray(locale)) {
    useLocale = locale;
  } else if (!locale || locale === 'any') {
    useLocale = [...new Set([].concat(Object.keys(validStateCodes), Object.keys(validStateNames)))];
  } else {
    useLocale = [locale];
  }
  if (codesOnly) {
    objectToUse = [validStateCodes];
  }
  if (namesOnly) {
    objectToUse = [validStateNames];
  }
  if ((!codesOnly && !namesOnly) || (codesOnly && namesOnly)) {
    objectToUse = [validStateCodes, validStateNames];
  }

  return combineSimilarArrays(useLocale, objectToUse).map(v =>
    v.toLowerCase()).includes(str.toLowerCase());
}

export const isStateNameLocales = Object.keys(validStateNames);
export const isStateCodeLocales = Object.keys(validStateCodes);
