import assertString from './util/assertString';

// from https://en.wikipedia.org/wiki/ISO_15924
const validISO15924Codes = new Set([
  'Adlm', 'Afak', 'Aghb', 'Ahom', 'Arab', 'Aran', 'Armi', 'Armn', 'Avst',
  'Bali', 'Bamu', 'Bass', 'Batk', 'Beng', 'Bhks', 'Blis', 'Bopo', 'Brah', 'Brai', 'Bugi', 'Buhd',
  'Cakm', 'Cans', 'Cari', 'Cham', 'Cher', 'Chrs', 'Cirt', 'Copt', 'Cpmn', 'Cprt', 'Cyrl', 'Cyrs',
  'Deva', 'Diak', 'Dogr', 'Dsrt', 'Dupl',
  'Egyd', 'Egyh', 'Egyp', 'Elba', 'Elym', 'Ethi',
  'Geok', 'Geor', 'Glag', 'Gong', 'Gonm', 'Goth', 'Gran', 'Grek', 'Gujr', 'Guru',
  'Hanb', 'Hang', 'Hani', 'Hano', 'Hans', 'Hant', 'Hatr', 'Hebr', 'Hira', 'Hluw', 'Hmng', 'Hmnp', 'Hrkt', 'Hung',
  'Inds', 'Ital',
  'Jamo', 'Java', 'Jpan', 'Jurc',
  'Kali', 'Kana', 'Kawi', 'Khar', 'Khmr', 'Khoj', 'Kitl', 'Kits', 'Knda', 'Kore', 'Kpel', 'Kthi',
  'Lana', 'Laoo', 'Latf', 'Latg', 'Latn', 'Leke', 'Lepc', 'Limb', 'Lina', 'Linb', 'Lisu', 'Loma', 'Lyci', 'Lydi',
  'Mahj', 'Maka', 'Mand', 'Mani', 'Marc', 'Maya', 'Medf', 'Mend', 'Merc', 'Mero', 'Mlym', 'Modi', 'Mong', 'Moon', 'Mroo', 'Mtei', 'Mult', 'Mymr',
  'Nagm', 'Nand', 'Narb', 'Nbat', 'Newa', 'Nkdb', 'Nkgb', 'Nkoo', 'Nshu',
  'Ogam', 'Olck', 'Orkh', 'Orya', 'Osge', 'Osma', 'Ougr',
  'Palm', 'Pauc', 'Pcun', 'Pelm', 'Perm', 'Phag', 'Phli', 'Phlp', 'Phlv', 'Phnx', 'Piqd', 'Plrd', 'Prti', 'Psin',
  'Qaaa', 'Qaab', 'Qaac', 'Qaad', 'Qaae', 'Qaaf', 'Qaag', 'Qaah', 'Qaai', 'Qaaj', 'Qaak', 'Qaal', 'Qaam', 'Qaan', 'Qaao', 'Qaap', 'Qaaq', 'Qaar', 'Qaas', 'Qaat', 'Qaau', 'Qaav', 'Qaaw', 'Qaax', 'Qaay', 'Qaaz', 'Qaba', 'Qabb', 'Qabc', 'Qabd', 'Qabe', 'Qabf', 'Qabg', 'Qabh', 'Qabi', 'Qabj', 'Qabk', 'Qabl', 'Qabm', 'Qabn', 'Qabo', 'Qabp', 'Qabq', 'Qabr', 'Qabs', 'Qabt', 'Qabu', 'Qabv', 'Qabw', 'Qabx',
  'Ranj', 'Rjng', 'Rohg', 'Roro', 'Runr',
  'Samr', 'Sara', 'Sarb', 'Saur', 'Sgnw', 'Shaw', 'Shrd', 'Shui', 'Sidd', 'Sind', 'Sinh', 'Sogd', 'Sogo', 'Sora', 'Soyo', 'Sund', 'Sunu', 'Sylo', 'Syrc', 'Syre', 'Syrj', 'Syrn',
  'Tagb', 'Takr', 'Tale', 'Talu', 'Taml', 'Tang', 'Tavt', 'Telu', 'Teng', 'Tfng', 'Tglg', 'Thaa', 'Thai', 'Tibt', 'Tirh', 'Tnsa', 'Toto',
  'Ugar',
  'Vaii', 'Visp', 'Vith',
  'Wara', 'Wcho', 'Wole',
  'Xpeo', 'Xsux',
  'Yezi', 'Yiii',
  'Zanb', 'Zinh', 'Zmth', 'Zsym', 'Zsye', 'Zxxx', 'Zyyy', 'Zzzz',
]);

export default function isISO15924(str) {
  assertString(str);
  return validISO15924Codes.has(str);
}

export const ScriptCodes = validISO15924Codes;
