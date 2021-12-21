## 13.7.0

### New Features

- [#1706](https://github.com/validatorjs/validator.js/pull/1706) `isISO4217`, currency code validator @jpaya17

### New Features

- [#1706](https://github.com/validatorjs/validator.js/pull/1706) `isISO4217`, currency code validator @jpaya17

### Fixes and Enhancements

- [#1647](https://github.com/validatorjs/validator.js/pull/1647) `isFQDN`: add `allow_wildcard` option @fasenderos
- [#1654](https://github.com/validatorjs/validator.js/pull/1654) `isRFC3339`: Disallow prepended and appended strings to RFC 3339 date-time @jmacmahon
- [#1658](https://github.com/validatorjs/validator.js/pull/1658) maintenance: increase code coverage @tux-tn
- [#1669](https://github.com/validatorjs/validator.js/pull/1669) `IBAN` export list of country codes that implement IBAN @dror-heller @fedeci
- [#1676](https://github.com/validatorjs/validator.js/pull/1676) `isBoolean`: add `loose` option @brybrophy
- [#1697](https://github.com/validatorjs/validator.js/pull/1697) maintenance: fix npm installation error @rubiin
- [#1708](https://github.com/validatorjs/validator.js/pull/1708) `isISO31661Alpha3`: perf @jpaya17
- [#1711](https://github.com/validatorjs/validator.js/pull/1711) `isDate`: allow users to strictly validate dates with `.` as delimiter @flymans
- [#1715](https://github.com/validatorjs/validator.js/pull/1715) `isCreditCard`: fix for Union Pay cards @shreyassai123
- [#1718](https://github.com/validatorjs/validator.js/pull/1718) `isEmail`: replace all dots in GMail length validation @DasDingGehtNicht
- [#1721](https://github.com/validatorjs/validator.js/pull/1721) `isURL`: add `allow_fragments` and `allow_query_components` @cowboy-bebug
- [#1724](https://github.com/validatorjs/validator.js/pull/1724) `isISO31661Alpha2`: perf @jpaya17
- [#1730](https://github.com/validatorjs/validator.js/pull/1730) `isMagnetURI` @tux-tn
- [#1738](https://github.com/validatorjs/validator.js/pull/1738) `rtrim`: remove regex to prevent ReDOS attack @tux-tn
- [#1747](https://github.com/validatorjs/validator.js/pull/1747) maintenance: run scripts in parallel for build and clean @sachinraja
- [#1748](https://github.com/validatorjs/validator.js/pull/1748) `isURL`: higher priority to `whitelist` @deepanshu2506
- [#1751](https://github.com/validatorjs/validator.js/pull/1751) `isURL`: allow url with colon and no port @MatteoPierro
- [#1777](https://github.com/validatorjs/validator.js/pull/1777) `isUUID`: fix for `null` version argument @theteladras
- [#1799](https://github.com/validatorjs/validator.js/pull/1799) `isFQDN`: check more special chars @MatteoPierro
- [#1833](https://github.com/validatorjs/validator.js/pull/1833) `isURL`: allow URL with an empty user @MiguelSavignano
- [#1835](https://github.com/validatorjs/validator.js/pull/1835) `unescape`: fixed bug where intermediate string contains escaped @Marcholio
- [#1836](https://github.com/validatorjs/validator.js/pull/1836) `contains`: can check that string contains seed multiple times @Marcholio
- [#1844](https://github.com/validatorjs/validator.js/pull/1844) docs: add CDN instructions @luiscobits
- [#1848](https://github.com/validatorjs/validator.js/pull/1848) `isUUID`: add support for validation of `v1` and `v2` @theteladras
- [#1941](https://github.com/validatorjs/validator.js/pull/1641) `isEmail`: add `host_blacklist` option @fedeci

### New and Improved Locales

- `isAlpha`, `isAlphanumeric`:
  - [#1716](https://github.com/validatorjs/validator.js/pull/1716) `hi-IN` @MiKr13
  - [#1837](https://github.com/validatorjs/validator.js/pull/1837) `fi-FI` @Marcholio

- `isPassportNumber`:
  - [#1656](https://github.com/validatorjs/validator.js/pull/1656) `ID` @rubiin
  - [#1714](https://github.com/validatorjs/validator.js/pull/1714) `CN` @anirudhgiri
  - [#1809](https://github.com/validatorjs/validator.js/pull/1809) `PL` @Ronqn
  - [#1810](https://github.com/validatorjs/validator.js/pull/1810) `RU` @Theta-Dev

- `isPostalCode`:
  - [#1788](https://github.com/validatorjs/validator.js/pull/1788) `LK` @nimanthadilz

- `isIdentityCard`:
  - [#1657](https://github.com/validatorjs/validator.js/pull/1657) `TH` @tithanayut
  - [#1745](https://github.com/validatorjs/validator.js/pull/1745) `PL` @wiktorwojcik112 @fedeci @tux-tn
  - [#1786](https://github.com/validatorjs/validator.js/pull/1786) `LK` @nimanthadilz @tux-tn
  - [#1838](https://github.com/validatorjs/validator.js/pull/1838) `FI` @Marcholio

- `isMobilePhone`:
  - [#1679](https://github.com/validatorjs/validator.js/pull/1679) `de-DE` @AnnaMariaJansen 
  - [#1689](https://github.com/validatorjs/validator.js/pull/1689) `vi-VN` @luisrivas
  - [#1695](https://github.com/validatorjs/validator.js/pull/1695) [#1682](https://github.com/validatorjs/validator.js/pull/1682) `zh-CN` @laulujan @yisibl
  - [#1734](https://github.com/validatorjs/validator.js/pull/1734) `es-VE` @islasjuanp
  - [#1746](https://github.com/validatorjs/validator.js/pull/1746) `nl-BE` @divikshrivastava
  - [#1765](https://github.com/validatorjs/validator.js/pull/1765) `es-CU` @pasagedev
  - [#1766](https://github.com/validatorjs/validator.js/pull/1766) `es-SV`, @hereje
  - [#1767](https://github.com/validatorjs/validator.js/pull/1767) `ar-PS`, @brendan-c
  - [#1769](https://github.com/validatorjs/validator.js/pull/1769) `en-BM` @HackProAIT
  - [#1770](https://github.com/validatorjs/validator.js/pull/1770) `dz-BT` @lakshayr003
  - [#1771](https://github.com/validatorjs/validator.js/pull/1771) `en-BW`, @mgndolan
  - [#1772](https://github.com/validatorjs/validator.js/pull/1772) `fr-CM` @beckettnormington
  - [#1778](https://github.com/validatorjs/validator.js/pull/1778) `en-PK` @ammad20120 @tux-tn
  - [#1780](https://github.com/validatorjs/validator.js/pull/1780) `tk-TM`, @Husan-Eshonqulov
  - [#1784](https://github.com/validatorjs/validator.js/pull/1784) `en-GY`, @mfkrause
  - [#1785](https://github.com/validatorjs/validator.js/pull/1785) `si-LK` @Madhavi96
  - [#1797](https://github.com/validatorjs/validator.js/pull/1797) `fr-PF`, @hereje
  - [#1820](https://github.com/validatorjs/validator.js/pull/1820) `en-KI`, @c-tanner
  - [#1826](https://github.com/validatorjs/validator.js/pull/1826) `hu-HU` @danielTiringer
  - [#1834](https://github.com/validatorjs/validator.js/pull/1834) `fr-BF`, `en-NA` @lakshayr003
  - [#1846](https://github.com/validatorjs/validator.js/pull/1846) `tg-TJ` @mgnss

- `isLicensePlate`:
  - [#1565](https://github.com/validatorjs/validator.js/pull/1565) `cs-CZ` @filiptronicek
  - [#1790](https://github.com/validatorjs/validator.js/pull/1790) `fi-FI` @Marcholio

- `isVAT`:
  - [#1825](https://github.com/validatorjs/validator.js/pull/1825) `NL` @zeno4ever

#### 13.6.1

- **New features**:
  - [#1495](https://github.com/validatorjs/validator.js/pull/1495) `isLicensePlate` @firlus

- **Fixes and Enhancements**:
  - [#1651](https://github.com/validatorjs/validator.js/pull/1651) fix ReDOS vulnerabilities in `isHSL` and `isEmail` @tux-tn
  - [#1644](https://github.com/validatorjs/validator.js/pull/1644) `isURL`: Allow URLs to have only a username in the userinfo subcomponent @jbuchmann-coosto
  - [#1633](https://github.com/validatorjs/validator.js/pull/1633) `isISIN`: optimization @bmacnaughton
  - [#1632](https://github.com/validatorjs/validator.js/pull/1632) `isIP`: improved pattern for IPv4 and IPv6 @ognjenjevremovic
  - [#1625](https://github.com/validatorjs/validator.js/pull/1625) fix `[A-z]` regex range on some validators @bmacnaughton
  - [#1620](https://github.com/validatorjs/validator.js/pull/1620) fix docs @prahaladbelavadi
  - [#1616](https://github.com/validatorjs/validator.js/pull/1616) `isMacAddress`: improve regexes and options @fedeci
  - [#1603](https://github.com/validatorjs/validator.js/pull/1603) fix ReDOS vulnerabilities in `isSlug` and `rtrim` @fedeci
  - [#1594](https://github.com/validatorjs/validator.js/pull/1594) `isIPRange`: add support for IPv6 @neilime
  - [#1577](https://github.com/validatorjs/validator.js/pull/1577) `isEAN`: add support for EAN-14 @varsubham @tux-tn
  - [#1566](https://github.com/validatorjs/validator.js/pull/1566) `isStrongPassword`: add `@` as a valid symbol @stingalleman
  - [#1548](https://github.com/validatorjs/validator.js/pull/1548) `isBtcAddress`: add base58 @ezkemboi
  - [#1546](https://github.com/validatorjs/validator.js/pull/1546) `isFQDN`: numeric domain names @tux-tn

- **New and Improved locales**:
  - `isIdentityCard`, `isPassportNumber`:
    - [#1595](https://github.com/validatorjs/validator.js/pull/1595) `IR` @mhf-ir @fedeci
    - [#1583](https://github.com/validatorjs/validator.js/pull/1583) `ar-LY` @asghaier76 @tux-tn
    - [#1574](https://github.com/validatorjs/validator.js/pull/1574) `MY` @stranger26 @tux-tn
  - `isMobilePhone`:
    - [#1642](https://github.com/validatorjs/validator.js/pull/1642) `zh-CN` @Akira0705
    - [#1638](https://github.com/validatorjs/validator.js/pull/1638) `lv-LV` @AntonLukichev
    - [#1635](https://github.com/validatorjs/validator.js/pull/1635) `en-GH` @ankorGH
    - [#1604](https://github.com/validatorjs/validator.js/pull/1604) `mz-MZ` @salmento @tux-tn
    - [#1575](https://github.com/validatorjs/validator.js/pull/1575) `vi-VN` @kyled7
    - [#1573](https://github.com/validatorjs/validator.js/pull/1573) `en-SG` @liliwei25
    - [#1554](https://github.com/validatorjs/validator.js/pull/1554) `de-CH`, `fr-CH`, `it-CH` @dinfekted
    - [#1541](https://github.com/validatorjs/validator.js/pull/1541) [#1623](https://github.com/validatorjs/validator.js/pull/1623) `es-CO` @ezkemboi @tux-tn
    - [#1506](https://github.com/validatorjs/validator.js/pull/1506) `ar-OM` @dev-sna
    - [#1505](https://github.com/validatorjs/validator.js/pull/1505) `pt-AO` @AdilsonFuxe
  - `isPostalCode`:
    - [#1628](https://github.com/validatorjs/validator.js/pull/1628) `KR` @greatSumini
  - `isTaxID`:
    - [#1613](https://github.com/validatorjs/validator.js/pull/1613) `pt-BR` @mschunke
    - [#1529](https://github.com/validatorjs/validator.js/pull/1529) `el-GR` @dspinellis
  - `isVAT`:
    - [#1536](https://github.com/validatorjs/validator.js/pull/1536) `IT` @fedeci

#### ~~13.5.0~~ 13.5.1

- **New features**:
  - `isVAT` [#1463](https://github.com/validatorjs/validator.js/pull/1463) @ CodingNagger
  - `isTaxID` [#1446](https://github.com/validatorjs/validator.js/pull/1446) @tplessas
  - `isBase58` [#1445](https://github.com/validatorjs/validator.js/pull/1445) @ezkemboi
  - `isStrongPassword` [#1348](https://github.com/validatorjs/validator.js/pull/1348) @door-bell

- **Fixes and Enhancements**:
  - [#1486](https://github.com/validatorjs/validator.js/pull/1486) `isISO8601`: add `strictSeparator` @brostone51
  - [#1474](https://github.com/validatorjs/validator.js/pull/1474) `isFQDN`: make more strict @CristhianMotoche
  - [#1469](https://github.com/validatorjs/validator.js/pull/1469) `isFQDN`: `allow_underscore` option @gibson042
  - [#1449](https://github.com/validatorjs/validator.js/pull/1449) `isEmail`: character blacklisting @rubiin
  - [#1436](https://github.com/validatorjs/validator.js/pull/1436) `isURL`: added `require_port` option @yshanli
  - [#1435](https://github.com/validatorjs/validator.js/pull/1435) `isEmail`: respect `ignore_max_length` option @evantahler
  - [#1402](https://github.com/validatorjs/validator.js/pull/1402) `isDate`: add strictMode and prevent mixed delimiters @tux-tn
  - [#1286](https://github.com/validatorjs/validator.js/pull/1286) `isAlpha`: support `ignore` option @mum-never-proud

- **New and Improved locales**:
  - `isAlpha`, `isAlphanumeric`:
    - [#1528](https://github.com/validatorjs/validator.js/pull/1528) multiple fixes @tux-tn @purell
    - [#1513](https://github.com/validatorjs/validator.js/pull/1513) `id-ID` and docs update @bekicot
    - [#1484](https://github.com/validatorjs/validator.js/pull/1484) [#1481](https://github.com/validatorjs/validator.js/pull/1481) `th-TH` @ipiranhaa
    - [#1455](https://github.com/validatorjs/validator.js/pull/1455) `fa-IR` @fakhrip
    - [#1447](https://github.com/validatorjs/validator.js/pull/1447) `az-AZ` @saidfagan
  - `isMobilePhone`:
    - [#1521](https://github.com/validatorjs/validator.js/pull/1521) `ar-MA` @artpumpkin
    - [#1492](https://github.com/validatorjs/validator.js/pull/1492) `de-LU`,`it-SM`, `sq-AL` and `ga-IE` @firlus
    - [#1487](https://github.com/validatorjs/validator.js/pull/1487) `en-HN` @jehielmartinez
    - [#1473](https://github.com/validatorjs/validator.js/pull/1473) `ar-LB`, `es-PE`, `ka-GE` @rubiin
    - [#1470](https://github.com/validatorjs/validator.js/pull/1444) `es-DO` @devrasec
    - [#1460](https://github.com/validatorjs/validator.js/pull/1444) `es-BO` @rubiin
    - [#1444](https://github.com/validatorjs/validator.js/pull/1444) `es-AR` @csrgt
    - [#1407](https://github.com/validatorjs/validator.js/pull/1407) `pt-BR` @viniciushvsilva
  - `isPostalCode`:
    - [#1534](https://github.com/validatorjs/validator.js/pull/1534) `CN` @httpsbao
    - [#1515](https://github.com/validatorjs/validator.js/pull/1515) `IR` @masoudDaliriyan
    - [#1502](https://github.com/validatorjs/validator.js/pull/1502) `SG`, `MY` @stranger26
    - [#1480](https://github.com/validatorjs/validator.js/pull/1480) `TH` @ipiranhaa
    - [#1459](https://github.com/validatorjs/validator.js/pull/1456) `BY` @rubiin
    - [#1456](https://github.com/validatorjs/validator.js/pull/1456) `DO` and `HT` @yomed
  - `isPassportNumber`:
    - [#1468](https://github.com/validatorjs/validator.js/pull/1468) `BY` @zenby
    - [#1467](https://github.com/validatorjs/validator.js/pull/1467) `RU` @dkochetkov

<sub>&mdash; this release is dedicated to @dbnandaa 🧒</sub>

#### 13.1.17

- **New features**:
  - None
- **Fixes and chores**:
  - [#1425](https://github.com/validatorjs/validator.js/pull/1425) fix validation for _userinfo_ part for `isURL` @heanzyzabala
  - [#1419](https://github.com/validatorjs/validator.js/pull/1419) fix `isBase32` and `isBase64` to validate empty strings properly @AberDerBart 
  - [#1408](https://github.com/validatorjs/validator.js/pull/1408) tests for `isTaxId` @dspinellis 
  - [#1397](https://github.com/validatorjs/validator.js/pull/1397) added `validate_length` option for `isURL` @tomgrossman 
  - [#1383](https://github.com/validatorjs/validator.js/pull/1383) [#1428](https://github.com/validatorjs/validator.js/pull/1428) doc typos @0xflotus @timgates42
  - [#1376](https://github.com/validatorjs/validator.js/pull/1376) add missing tests and switch to Coverall @tux-tn
  - [#1373](https://github.com/validatorjs/validator.js/pull/1373) improve code coverage @ezkemboi
  - [#1357](https://github.com/validatorjs/validator.js/pull/1357) add Node v6 on build pipeline @profnandaa

- **New and Improved locales**:
  - `isMobilePhone`:
    - [#1439](https://github.com/validatorjs/validator.js/pull/1439) `az-AZ` @saidfagan
    - [#1420](https://github.com/validatorjs/validator.js/pull/1420) `uz-Uz` @icyice0217
    - [#1391](https://github.com/validatorjs/validator.js/pull/1391) `de-DE` @heanzyzabala
    - [#1388](https://github.com/validatorjs/validator.js/pull/1388) `en-PH` @stinkymonkeyph
    - [#1370](https://github.com/validatorjs/validator.js/pull/1370) `es-ES` @rubiin
    - [#1356](https://github.com/validatorjs/validator.js/pull/1356) `bs-BA` @MladenZeljic
    - [#1303](https://github.com/validatorjs/validator.js/pull/1301) `zh-CN` @heathcliff-hu
  - `isPostalCode`:
    - [#1439](https://github.com/validatorjs/validator.js/pull/1439) `AZ` @saidfagan
    - [#1370](https://github.com/validatorjs/validator.js/pull/1370) `ES` @rubiin
    - [#1367](https://github.com/validatorjs/validator.js/pull/1367) `IL` @rubiin
  - `isAlpha`, `isAlphanumeric`:
    - [#1411](https://github.com/validatorjs/validator.js/pull/1411) `fa-AF`, `fa-IR` @stinkymonkeyph
    - [#1371](https://github.com/validatorjs/validator.js/pull/1371) `vi-VN` @rubiin
  - `isBAN`:
    - [#1394](https://github.com/validatorjs/validator.js/pull/1394) `EG`, `SV` @heanzyzabala
  - `isIdentityCard`:
    - [#1384](https://github.com/validatorjs/validator.js/pull/1384) `IT` @lorenzodb1


#### 13.1.1

- Hotfix for a regex incompatibility in some browsers
  ([#1355](https://github.com/validatorjs/validator.js/pull/1355)

#### 13.1.0

- Added an `isIMEI()` validator
  ([#1346](https://github.com/validatorjs/validator.js/pull/1346))
- Added an `isDate()` validator
  ([#1270](https://github.com/validatorjs/validator.js/pull/1270))
- Added an `isTaxID()` validator
  ([#1336](https://github.com/validatorjs/validator.js/pull/1336))
- Added DMS support to `isLatLong()`
  ([#1340](https://github.com/validatorjs/validator.js/pull/1340))
- Added support for URL-safe base64 validation
  ([#1277](https://github.com/validatorjs/validator.js/pull/1277))
- Added support for primitives in `isJSON()`
  ([#1328](https://github.com/validatorjs/validator.js/pull/1328))
- Added support for case-insensitive matching to `contains()`
  ([#1334](https://github.com/validatorjs/validator.js/pull/1334))
- Support additional cards in `isCreditCard()`
  ([#1177](https://github.com/validatorjs/validator.js/pull/1177))
- Support additional currencies in `isCurrency()`
  ([#1306](https://github.com/validatorjs/validator.js/pull/1306))
- Fixed `isFQDN()` handling of certain special chars
  ([#1091](https://github.com/validatorjs/validator.js/pull/1091))
- Fixed a bug in `isSlug()`
  ([#1338](https://github.com/validatorjs/validator.js/pull/1338))
- New and improved locales
  ([#1112](https://github.com/validatorjs/validator.js/pull/1112),
   [#1167](https://github.com/validatorjs/validator.js/pull/1167),
   [#1198](https://github.com/validatorjs/validator.js/pull/1198),
   [#1199](https://github.com/validatorjs/validator.js/pull/1199),
   [#1273](https://github.com/validatorjs/validator.js/pull/1273),
   [#1279](https://github.com/validatorjs/validator.js/pull/1279),
   [#1281](https://github.com/validatorjs/validator.js/pull/1281),
   [#1293](https://github.com/validatorjs/validator.js/pull/1293),
   [#1294](https://github.com/validatorjs/validator.js/pull/1294),
   [#1311](https://github.com/validatorjs/validator.js/pull/1311),
   [#1312](https://github.com/validatorjs/validator.js/pull/1312),
   [#1313](https://github.com/validatorjs/validator.js/pull/1313),
   [#1314](https://github.com/validatorjs/validator.js/pull/1314),
   [#1315](https://github.com/validatorjs/validator.js/pull/1315),
   [#1317](https://github.com/validatorjs/validator.js/pull/1317),
   [#1322](https://github.com/validatorjs/validator.js/pull/1322),
   [#1324](https://github.com/validatorjs/validator.js/pull/1324),
   [#1330](https://github.com/validatorjs/validator.js/pull/1330),
   [#1337](https://github.com/validatorjs/validator.js/pull/1337))

#### 13.0.0

- Added `isEthereumAddress()` validator
  to validate [Ethereum addresses](https://en.wikipedia.org/wiki/Ethereum#Addresses)
  ([#1117](https://github.com/validatorjs/validator.js/pull/1117))
- Added `isBtcAddress()` validator
  to validate [Bitcoin addresses](https://en.bitcoin.it/wiki/Address)
  ([#1163](https://github.com/validatorjs/validator.js/pull/1163))
- Added `isIBAN()` validator
  to validate [International Bank Account Numbers](https://en.wikipedia.org/wiki/International_Bank_Account_Number)
  ([#1243](https://github.com/validatorjs/validator.js/pull/1243))
- Added `isEAN()` validator
  to validate [International Article Numbers](https://en.wikipedia.org/wiki/International_Article_Number)
  ([#1244](https://github.com/validatorjs/validator.js/pull/1244))
- Added `isSemVer()` validator
  to validate [Semantic Version Numbers](https://semver.org)
  ([#1246](https://github.com/validatorjs/validator.js/pull/1246))
- Added `isPassportNumber()` validator
  ([#1250](https://github.com/validatorjs/validator.js/pull/1250))
- Added `isRgbColor()` validator
  ([#1141](https://github.com/validatorjs/validator.js/pull/1141))
- Added `isHSL()` validator
  ([#1159](https://github.com/validatorjs/validator.js/pull/1159))
- Added `isLocale()` validator
  ([#1072](https://github.com/validatorjs/validator.js/pull/1072))
- Improved the `isIP()` validator
  ([#1211](https://github.com/validatorjs/validator.js/pull/1211))
- Improved the `isMACAddress()` validator
  ([#1267](https://github.com/validatorjs/validator.js/pull/1267))
- New and improved locales
  ([#1238](https://github.com/validatorjs/validator.js/pull/1238),
   [#1265](https://github.com/validatorjs/validator.js/pull/1265))

#### 12.2.0

- Support CSS Colors Level 4 spec
  ([#1233](https://github.com/validatorjs/validator.js/pull/1233))
- Improve the `toFloat()` sanitizer
  ([#1227](https://github.com/validatorjs/validator.js/pull/1227))
- New and improved locales
  ([#1200](https://github.com/validatorjs/validator.js/pull/1200),
   [#1207](https://github.com/validatorjs/validator.js/pull/1207),
   [#1213](https://github.com/validatorjs/validator.js/pull/1213),
   [#1217](https://github.com/validatorjs/validator.js/pull/1217),
   [#1234](https://github.com/validatorjs/validator.js/pull/1234))

#### 12.1.0

- ES module for webpack tree shaking
  ([#1015](https://github.com/validatorjs/validator.js/pull/1015))
- Updated `isIP()` to accept scoped IPv6 addresses
  ([#1160](https://github.com/validatorjs/validator.js/pull/1160))
- New and improved locales
  ([#1162](https://github.com/validatorjs/validator.js/pull/1162),
   [#1183](https://github.com/validatorjs/validator.js/pull/1183),
   [#1187](https://github.com/validatorjs/validator.js/pull/1187),
   [#1191](https://github.com/validatorjs/validator.js/pull/1191))

#### 12.0.0

- Added `isOctal()` validator
  ([#1153](https://github.com/validatorjs/validator.js/pull/1153))
- Added `isSlug()` validator
  ([#1096](https://github.com/validatorjs/validator.js/pull/1096))
- Added `isBIC()` validator for bank identification codes
  ([#1071](https://github.com/validatorjs/validator.js/pull/1071))
- Allow uppercase chars in `isHash()`
  ([#1062](https://github.com/validatorjs/validator.js/pull/1062))
- Allow additional prefixes in `isHexadecimal()`
  ([#1147](https://github.com/validatorjs/validator.js/pull/1147))
- Allow additional separators in `isMACAddress()`
  ([#1065](https://github.com/validatorjs/validator.js/pull/1065))
- Better defaults for `isLength()`
  ([#1070](https://github.com/validatorjs/validator.js/pull/1070))
- Bug fixes
  ([#1074](https://github.com/validatorjs/validator.js/pull/1074))
- New and improved locales
  ([#1059](https://github.com/validatorjs/validator.js/pull/1059),
   [#1060](https://github.com/validatorjs/validator.js/pull/1060),
   [#1069](https://github.com/validatorjs/validator.js/pull/1069),
   [#1073](https://github.com/validatorjs/validator.js/pull/1073),
   [#1082](https://github.com/validatorjs/validator.js/pull/1082),
   [#1092](https://github.com/validatorjs/validator.js/pull/1092),
   [#1121](https://github.com/validatorjs/validator.js/pull/1121),
   [#1125](https://github.com/validatorjs/validator.js/pull/1125),
   [#1132](https://github.com/validatorjs/validator.js/pull/1132),
   [#1152](https://github.com/validatorjs/validator.js/pull/1152),
   [#1165](https://github.com/validatorjs/validator.js/pull/1165),
   [#1166](https://github.com/validatorjs/validator.js/pull/1166),
   [#1174](https://github.com/validatorjs/validator.js/pull/1174))

#### 11.1.0

- Code coverage improvements
  ([#1024](https://github.com/validatorjs/validator.js/pull/1024))
- New and improved locales
  ([#1035](https://github.com/validatorjs/validator.js/pull/1035),
   [#1040](https://github.com/validatorjs/validator.js/pull/1040),
   [#1041](https://github.com/validatorjs/validator.js/pull/1041),
   [#1048](https://github.com/validatorjs/validator.js/pull/1048),
   [#1049](https://github.com/validatorjs/validator.js/pull/1049),
   [#1052](https://github.com/validatorjs/validator.js/pull/1052),
   [#1054](https://github.com/validatorjs/validator.js/pull/1054),
   [#1055](https://github.com/validatorjs/validator.js/pull/1055),
   [#1056](https://github.com/validatorjs/validator.js/pull/1056),
   [#1057](https://github.com/validatorjs/validator.js/pull/1057))

#### 11.0.0

- Added a `isBase32()` validator
  ([#1023](https://github.com/validatorjs/validator.js/pull/1023))
- Updated `isEmail()` to validate display names according to RFC2822
  ([#1004](https://github.com/validatorjs/validator.js/pull/1004))
- Updated `isEmail()` to check total email length
  ([#1007](https://github.com/validatorjs/validator.js/pull/1007))
- The internal `toString()` util is no longer exported
  ([0277eb](https://github.com/validatorjs/validator.js/commit/0277eb00d245a3479af52adf7d927d4036895650))
- New and improved locales
  ([#999](https://github.com/validatorjs/validator.js/pull/999),
   [#1010](https://github.com/validatorjs/validator.js/pull/1010),
   [#1017](https://github.com/validatorjs/validator.js/pull/1017),
   [#1022](https://github.com/validatorjs/validator.js/pull/1022),
   [#1031](https://github.com/validatorjs/validator.js/pull/1031),
   [#1032](https://github.com/validatorjs/validator.js/pull/1032))

#### 10.11.0

- Fix imports like `import .. from "validator/lib/.."`
  ([#961](https://github.com/validatorjs/validator.js/pull/961))
- New locale
  ([#958](https://github.com/validatorjs/validator.js/pull/958))

#### 10.10.0

- `isISO8601()` strict mode now works in the browser
  ([#932](https://github.com/validatorjs/validator.js/pull/932))
- New and improved locales
  ([#931](https://github.com/validatorjs/validator.js/pull/931),
   [#933](https://github.com/validatorjs/validator.js/pull/933),
   [#947](https://github.com/validatorjs/validator.js/pull/947),
   [#950](https://github.com/validatorjs/validator.js/pull/950))

#### 10.9.0

- Added an option to `isURL()` to reject email-like URLs
  ([#901](https://github.com/validatorjs/validator.js/pull/901))
- Added a `strict` option to `isISO8601()`
  ([#910](https://github.com/validatorjs/validator.js/pull/910))
- Relaxed `isJWT()` signature requirements
  ([#906](https://github.com/validatorjs/validator.js/pull/906))
- New and improved locales
  ([#899](https://github.com/validatorjs/validator.js/pull/899),
   [#904](https://github.com/validatorjs/validator.js/pull/904),
   [#913](https://github.com/validatorjs/validator.js/pull/913),
   [#916](https://github.com/validatorjs/validator.js/pull/916),
   [#925](https://github.com/validatorjs/validator.js/pull/925),
   [#928](https://github.com/validatorjs/validator.js/pull/928))

#### 10.8.0

- Added `isIdentityCard()`
  ([#846](https://github.com/validatorjs/validator.js/pull/846))
- Better error when validators are passed an invalid type
  ([#895](https://github.com/validatorjs/validator.js/pull/895))
- Locales are now exported
  ([#890](https://github.com/validatorjs/validator.js/pull/890),
   [#892](https://github.com/validatorjs/validator.js/pull/892))
- New locale
  ([#896](https://github.com/validatorjs/validator.js/pull/896))

#### 10.7.1

- Ignore case when checking URL protocol
  ([#887](https://github.com/validatorjs/validator.js/issues/887))
- Locale fix
  ([#889](https://github.com/validatorjs/validator.js/pull/889))

#### 10.7.0

- Added `isMagnetURI()` to validate [magnet URIs](https://en.wikipedia.org/wiki/Magnet_URI_scheme)
  ([#884](https://github.com/validatorjs/validator.js/pull/884))
- Added `isJWT()` to validate [JSON web tokens](https://en.wikipedia.org/wiki/JSON_Web_Token)
  ([#885](https://github.com/validatorjs/validator.js/pull/885))

#### 10.6.0

- Updated `isMobilePhone()` to match any locale's pattern by default
  ([#874](https://github.com/validatorjs/validator.js/pull/874))
- Added an option to ignore whitespace in `isEmpty()`
  ([#880](https://github.com/validatorjs/validator.js/pull/880))
- New and improved locales
  ([#878](https://github.com/validatorjs/validator.js/pull/878),
   [#879](https://github.com/validatorjs/validator.js/pull/879))

#### 10.5.0

- Disabled domain-specific email validation
  ([#873](https://github.com/validatorjs/validator.js/pull/873))
- Added support for IP hostnames in `isEmail()`
  ([#845](https://github.com/validatorjs/validator.js/pull/845))
- Added a `no_symbols` option to `isNumeric()`
  ([#848](https://github.com/validatorjs/validator.js/pull/848))
- Added a `no_colons` option to `isMACAddress()`
  ([#849](https://github.com/validatorjs/validator.js/pull/849))
- Updated `isURL()` to reject protocol relative URLs unless a flag is set
  ([#860](https://github.com/validatorjs/validator.js/issues/860))
- New and improved locales
  ([#801](https://github.com/validatorjs/validator.js/pull/801),
   [#856](https://github.com/validatorjs/validator.js/pull/856),
   [#859](https://github.com/validatorjs/validator.js/issues/859),
   [#861](https://github.com/validatorjs/validator.js/pull/861),
   [#862](https://github.com/validatorjs/validator.js/pull/862),
   [#863](https://github.com/validatorjs/validator.js/pull/863),
   [#864](https://github.com/validatorjs/validator.js/pull/864),
   [#870](https://github.com/validatorjs/validator.js/pull/870),
   [#872](https://github.com/validatorjs/validator.js/pull/872))

#### 10.4.0

- Added an `isIPRange()` validator
  ([#842](https://github.com/validatorjs/validator.js/pull/842))
- Accept an array of locales in `isMobilePhone()`
  ([#742](https://github.com/validatorjs/validator.js/pull/742))
- New locale
  ([#843](https://github.com/validatorjs/validator.js/pull/843))

#### 10.3.0

- Strict Gmail validation in `isEmail()`
  ([#832](https://github.com/validatorjs/validator.js/pull/832))
- New locales
  ([#831](https://github.com/validatorjs/validator.js/pull/831),
   [#835](https://github.com/validatorjs/validator.js/pull/835),
   [#836](https://github.com/validatorjs/validator.js/pull/836))

#### 10.2.0

- Export the list of supported locales in `isPostalCode()`
  ([#830](https://github.com/validatorjs/validator.js/pull/830))

#### 10.1.0

- Added an `isISO31661Alpha3()` validator
  ([#809](https://github.com/validatorjs/validator.js/pull/809))

#### 10.0.0

- Allow floating points in `isNumeric()`
  ([#810](https://github.com/validatorjs/validator.js/pull/810))
- Disallow GMail addresses with multiple consecutive dots, or leading/trailing dots
  ([#820](https://github.com/validatorjs/validator.js/pull/820))
- Added an `isRFC3339()` validator
  ([#816](https://github.com/validatorjs/validator.js/pull/816))
- Reject domain parts longer than 63 octets in `isFQDN()`, `isURL()` and `isEmail()`
  ([bb3e542](https://github.com/validatorjs/validator.js/commit/bb3e542))
- Added a new Amex prefix to `isCreditCard()`
  ([#805](https://github.com/validatorjs/validator.js/pull/805))
- Fixed `isFloat()` min/max/gt/lt filters when a locale with a comma decimal is used
  ([2b70821](https://github.com/validatorjs/validator.js/commit/2b70821))
- Normalize Yandex emails
  ([#807](https://github.com/validatorjs/validator.js/pull/807))
- New locales
  ([#803](https://github.com/validatorjs/validator.js/pull/803))

#### 9.4.1

- Patched a [REDOS](https://en.wikipedia.org/wiki/ReDoS) vulnerability in `isDataURI`
- New and improved locales
  ([#788](https://github.com/validatorjs/validator.js/pull/788))

#### 9.4.0

- Added an option to `isMobilePhone` to require a country code
  ([#769](https://github.com/validatorjs/validator.js/pull/769))
- New and improved locales
  ([#785](https://github.com/validatorjs/validator.js/pull/785))

#### 9.3.0

- New and improved locales
  ([#763](https://github.com/validatorjs/validator.js/pull/763),
   [#768](https://github.com/validatorjs/validator.js/pull/768),
   [#774](https://github.com/validatorjs/validator.js/pull/774),
   [#777](https://github.com/validatorjs/validator.js/pull/777),
   [#779](https://github.com/validatorjs/validator.js/pull/779))

#### 9.2.0

- Added an `isMimeType()` validator
  ([#760](https://github.com/validatorjs/validator.js/pull/760))
- New and improved locales
  ([#753](https://github.com/validatorjs/validator.js/pull/753),
   [#755](https://github.com/validatorjs/validator.js/pull/755),
   [#764](https://github.com/validatorjs/validator.js/pull/764))

#### 9.1.2

- Fixed a bug with the `isFloat` validator
  ([#752](https://github.com/validatorjs/validator.js/pull/752))

#### 9.1.1

- Locale fixes
  ([#738](https://github.com/validatorjs/validator.js/pull/738),
   [#739](https://github.com/validatorjs/validator.js/pull/739))

#### 9.1.0

- Added an `isISO31661Alpha2()` validator
  ([#734](https://github.com/validatorjs/validator.js/pull/734))
- New locales
  ([#735](https://github.com/validatorjs/validator.js/pull/735),
   [#737](https://github.com/validatorjs/validator.js/pull/737))

#### 9.0.0

- `normalizeEmail()` no longer validates the email address
  ([#725](https://github.com/validatorjs/validator.js/pull/725))
- Added locale-aware validation to `isFloat()` and `isDecimal()`
  ([#721](https://github.com/validatorjs/validator.js/pull/721))
- Added an `isPort()` validator
  ([#733](https://github.com/validatorjs/validator.js/pull/733))
- New locales
  ([#731](https://github.com/validatorjs/validator.js/pull/731))

#### 8.2.0

- Added an `isHash()` validator
  ([#711](https://github.com/validatorjs/validator.js/pull/711))
- Control decimal places in `isCurrency()`
  ([#713](https://github.com/validatorjs/validator.js/pull/713))
- New and improved locales
  ([#700](https://github.com/validatorjs/validator.js/pull/700),
   [#701](https://github.com/validatorjs/validator.js/pull/701),
   [#714](https://github.com/validatorjs/validator.js/pull/714),
   [#715](https://github.com/validatorjs/validator.js/pull/715),
   [#718](https://github.com/validatorjs/validator.js/pull/718))

#### 8.1.0

- Fix `require('validator/lib/isIS8601')` calls
  ([#688](https://github.com/validatorjs/validator.js/issues/688))
- Added an `isLatLong()` and `isPostalCode()` validator
  ([#684](https://github.com/validatorjs/validator.js/pull/684))
- Allow comma in email display names
  ([#692](https://github.com/validatorjs/validator.js/pull/692))
- Add missing string to `unescape()`
  ([#690](https://github.com/validatorjs/validator.js/pull/690))
- Fix `isMobilePhone()` with Node <= 6.x
  ([#681](https://github.com/validatorjs/validator.js/issues/681))
- New locales
  ([#695](https://github.com/validatorjs/validator.js/pull/695))

#### 8.0.0

- `isURL()` now requires the `require_tld: false` option to validate `localhost`
  ([#675](https://github.com/validatorjs/validator.js/issues/675))
- `isURL()` now rejects URLs that are protocol only
  ([#642](https://github.com/validatorjs/validator.js/issues/642))
- Fixed a bug where `isMobilePhone()` would silently return false if the locale was invalid or unsupported
  ([#657](https://github.com/validatorjs/validator.js/issues/657))

#### 7.2.0

- Added an option to validate any phone locale
  ([#663](https://github.com/validatorjs/validator.js/pull/663))
- Fixed a bug in credit card validation
  ([#672](https://github.com/validatorjs/validator.js/pull/672))
- Disallow whitespace, including unicode whitespace, in TLDs
  ([#677](https://github.com/validatorjs/validator.js/pull/677))
- New locales
  ([#673](https://github.com/validatorjs/validator.js/pull/673),
   [#676](https://github.com/validatorjs/validator.js/pull/676))

#### 7.1.0

- Added an `isISRC()` validator for [ISRC](https://en.wikipedia.org/wiki/International_Standard_Recording_Code)
  ([#660](https://github.com/validatorjs/validator.js/pull/660))
- Fixed a bug in credit card validation
  ([#670](https://github.com/validatorjs/validator.js/pull/670))
- Reduced the maximum allowed address in `isEmail()` based on
  [RFC3696 errata](http://www.rfc-editor.org/errata_search.php?rfc=3696&eid=1690)
  ([#655](https://github.com/validatorjs/validator.js/issues/655))
- New locales
  ([#647](https://github.com/validatorjs/validator.js/pull/647),
   [#667](https://github.com/validatorjs/validator.js/pull/667),
   [#667](https://github.com/validatorjs/validator.js/pull/667),
   [#671](https://github.com/validatorjs/validator.js/pull/671))

#### 7.0.0

- Remove `isDate()`

#### 6.3.0

- Allow values like `-.01` in `isFloat()`
  ([#618](https://github.com/validatorjs/validator.js/issues/618))
- New locales
  ([#616](https://github.com/validatorjs/validator.js/pull/616),
   [#622](https://github.com/validatorjs/validator.js/pull/622),
   [#627](https://github.com/validatorjs/validator.js/pull/627),
   [#630](https://github.com/validatorjs/validator.js/pull/630))

#### 6.2.1

- Disallow `<` and `>` in URLs
  ([#613](https://github.com/validatorjs/validator.js/issues/613))
- New locales
  ([#610](https://github.com/validatorjs/validator.js/pull/610))

#### 6.2.0

- Added an option to require an email display name
  ([#607](https://github.com/validatorjs/validator.js/pull/607))
- Added support for `lt` and `gt` to `isInt()`
  ([#588](https://github.com/validatorjs/validator.js/pull/588))
- New locales
  ([#601](https://github.com/validatorjs/validator.js/pull/601))

#### 6.1.0

- Added support for greater or less than in `isFloat()`
  ([#544](https://github.com/validatorjs/validator.js/issues/544))
- Added support for ISSN validation via `isISSN()`
  ([#593](https://github.com/validatorjs/validator.js/pull/593))
- Fixed a bug in `normalizeEmail()`
  ([#594](https://github.com/validatorjs/validator.js/issues/594))
- New locales
  ([#585](https://github.com/validatorjs/validator.js/pull/585))

#### 6.0.0

- Renamed `isNull()` to `isEmpty()`
  ([#574](https://github.com/validatorjs/validator.js/issues/574))
- Backslash is now escaped in `escape()`
  ([#516](https://github.com/validatorjs/validator.js/issues/516))
- Improved `normalizeEmail()`
  ([#583](https://github.com/validatorjs/validator.js/pull/583))
- Allow leading zeroes by default in `isInt()`
  ([#532](https://github.com/validatorjs/validator.js/pull/532))

#### 5.7.0

- Added support for IPv6 in `isURL()`
  ([#564](https://github.com/validatorjs/validator.js/issues/564))
- Added support for urls without a host (e.g. `file:///foo.txt`) in `isURL()`
  ([#563](https://github.com/validatorjs/validator.js/issues/563))
- Added support for regular expressions in the `isURL()` host whitelist and blacklist
  ([#562](https://github.com/validatorjs/validator.js/issues/562))
- Added support for MasterCard 2-Series BIN
  ([#576](https://github.com/validatorjs/validator.js/pull/576))
- New locales
  ([#575](https://github.com/validatorjs/validator.js/pull/575),
   [#552](https://github.com/validatorjs/validator.js/issues/552))

#### 5.6.0

- Added an `isMD5()` validator
  ([#557](https://github.com/validatorjs/validator.js/pull/557))
- Fixed an exceptional case in `isDate()`
  ([#566](https://github.com/validatorjs/validator.js/pull/566))
- New locales
  ([#559](https://github.com/validatorjs/validator.js/pull/559),
  [#568](https://github.com/validatorjs/validator.js/pull/568),
  [#571](https://github.com/validatorjs/validator.js/pull/571),
  [#573](https://github.com/validatorjs/validator.js/pull/573))

#### 5.5.0

- Fixed a regex denial of service in `trim()` and `rtrim()`
  ([#556](https://github.com/validatorjs/validator.js/pull/556))
- Added an Algerian locale to `isMobilePhone()`
  ([#540](https://github.com/validatorjs/validator.js/pull/540))
- Fixed the Hungarian locale in `isAlpha()` and `isAlphanumeric()`
  ([#541](https://github.com/validatorjs/validator.js/pull/541))
- Added a Polish locale to `isMobilePhone()`
  ([#545](https://github.com/validatorjs/validator.js/pull/545))

#### 5.4.0

- Accept Union Pay credit cards in `isCreditCard()`
  ([#539](https://github.com/validatorjs/validator.js/pull/539))
- Added Danish locale to `isMobilePhone()`
  ([#538](https://github.com/validatorjs/validator.js/pull/538))
- Added Hungarian locales to `isAlpha()`, `isAlphanumeric()` and `isMobilePhone()`
  ([#537](https://github.com/validatorjs/validator.js/pull/537))

#### 5.3.0

- Added an `allow_leading_zeroes` option to `isInt()`
  ([#532](https://github.com/validatorjs/validator.js/pull/532))
- Adjust Chinese mobile phone validation
  ([#523](https://github.com/validatorjs/validator.js/pull/523))
- Added a Canadian locale to `isMobilePhone()`
  ([#524](https://github.com/validatorjs/validator.js/issues/524))

#### 5.2.0

- Added a `isDataURI()` validator
  ([#521](https://github.com/validatorjs/validator.js/pull/521))
- Added Czech locales
  ([#522](https://github.com/validatorjs/validator.js/pull/522))
- Fixed a bug with `isURL()` when protocol was missing and "://" appeared in the query
  ([#518](https://github.com/validatorjs/validator.js/issues/518))

#### 5.1.0

- Added a `unescape()` HTML function
  ([#509](https://github.com/validatorjs/validator.js/pull/509))
- Added a Malaysian locale to `isMobilePhone()`
  ([#507](https://github.com/validatorjs/validator.js/pull/507))
- Added Polish locales to `isAlpha()` and `isAlphanumeric()`
  ([#506](https://github.com/validatorjs/validator.js/pull/506))
- Added Turkish locales to `isAlpha()`, `isAlphanumeric()` and `isMobilePhone()`
  ([#512](https://github.com/validatorjs/validator.js/pull/512))
- Allow >1 underscore in hostnames when using `allow_underscores`
  ([#510](https://github.com/validatorjs/validator.js/issues/510))

#### 5.0.0

- Migrate to ES6
  ([#496](https://github.com/validatorjs/validator.js/pull/496))
- Break the library up so that individual functions can be imported
  ([#496](https://github.com/validatorjs/validator.js/pull/496))
- Remove auto-coercion of input to a string
  ([#496](https://github.com/validatorjs/validator.js/pull/496))
- Remove the `extend()` function
  ([#496](https://github.com/validatorjs/validator.js/pull/496))
- Added Arabic locales to `isAlpha()` and `isAlphanumeric()`
  ([#496](https://github.com/validatorjs/validator.js/pull/496#issuecomment-184781730))
- Fix validation of very large base64 strings
  ([#503](https://github.com/validatorjs/validator.js/pull/503))

#### 4.9.0

- Added a Russian locale to `isAlpha()` and `isAlphanumeric()`
  ([#499](https://github.com/validatorjs/validator.js/pull/499))
- Remove the restriction on adjacent hyphens in hostnames
  ([#500](https://github.com/validatorjs/validator.js/issues/500))

#### 4.8.0

- Added Spanish, French, Portuguese and Dutch support for `isAlpha()` and `isAlphanumeric()`
  ([#492](https://github.com/validatorjs/validator.js/pull/492))
- Added a Brazilian locale to `isMobilePhone()`
  ([#489](https://github.com/validatorjs/validator.js/pull/489))
- Reject IPv4 addresses with invalid zero padding
  ([#490](https://github.com/validatorjs/validator.js/pull/490))
- Fix the client-side version when used with RequireJS
  ([#494](https://github.com/validatorjs/validator.js/issues/494))

#### 4.7.1

- Use [node-depd](https://github.com/dougwilson/nodejs-depd) to print deprecation notices
  ([#487](https://github.com/validatorjs/validator.js/issues/487))

#### 4.7.0

- Print a deprecation warning if validator input is not a string
  ([1f67e1e](https://github.com/validatorjs/validator.js/commit/1f67e1e15198c0ae735151290dc8dc2bf14da254)).
  Note that this will be an error in v5.
- Added a German locale to `isMobilePhone()`, `isAlpha()` and `isAlphanumeric()`
  ([#477](https://github.com/validatorjs/validator.js/pull/477))
- Added a Finnish locale to `isMobilePhone()`
  ([#455](https://github.com/validatorjs/validator.js/pull/455))

#### 4.6.1

- Fix coercion of objects: `Object.toString()` is `[object Object]` not `""`
  ([a57f3c8](https://github.com/validatorjs/validator.js/commit/a57f3c843c715fba2664ee22ec80e9e28e88e0a6))

#### 4.6.0

- Added a Spanish locale to `isMobilePhone()`
  ([#481](https://github.com/validatorjs/validator.js/pull/481))
- Fix string coercion of objects created with `Object.create(null)`
  ([#484](https://github.com/validatorjs/validator.js/issues/484))

#### 4.5.2

- Fix a timezone issue with short-form ISO 8601 dates, e.g.
  `validator.isDate('2011-12-21')`
  ([#480](https://github.com/validatorjs/validator.js/issues/480))

#### 4.5.1

- Make `isLength()` / `isByteLength()` accept `{min, max}` as options object.
  ([#474](https://github.com/validatorjs/validator.js/issues/474))

#### 4.5.0

- Add validation for Indian mobile phone numbers
  ([#471](https://github.com/validatorjs/validator.js/pull/471))
- Tweak Greek and Chinese mobile phone validation
  ([#467](https://github.com/validatorjs/validator.js/pull/467),
   [#468](https://github.com/validatorjs/validator.js/pull/468))
- Fixed a bug in `isDate()` when validating ISO 8601 dates without a timezone
  ([#472](https://github.com/validatorjs/validator.js/issues/472))

#### 4.4.1

- Allow triple hyphens in IDNA hostnames
  ([#466](https://github.com/validatorjs/validator.js/issues/466))

#### 4.4.0

- Added `isMACAddress()` validator
  ([#458](https://github.com/validatorjs/validator.js/pull/458))
- Added `isWhitelisted()` validator
  ([#462](https://github.com/validatorjs/validator.js/pull/462))
- Added a New Zealand locale to `isMobilePhone()`
  ([#452](https://github.com/validatorjs/validator.js/pull/452))
- Added options to control GMail address normalization
  ([#460](https://github.com/validatorjs/validator.js/pull/460))

#### 4.3.0

- Support Ember CLI module definitions
  ([#448](https://github.com/validatorjs/validator.js/pull/448))
- Added a Vietnam locale to `isMobilePhone()`
  ([#451](https://github.com/validatorjs/validator.js/pull/451))

#### 4.2.1

- Fix `isDate()` handling of RFC2822 timezones
  ([#447](https://github.com/validatorjs/validator.js/pull/447))

#### 4.2.0

- Fix `isDate()` handling of ISO8601 timezones
  ([#444](https://github.com/validatorjs/validator.js/pull/444))
- Fix the incorrect `isFloat('.') === true`
  ([#443](https://github.com/validatorjs/validator.js/pull/443))
- Added a Norwegian locale to `isMobilePhone()`
  ([#439](https://github.com/validatorjs/validator.js/pull/439))

#### 4.1.0

- General `isDate()` improvements
  ([#431](https://github.com/validatorjs/validator.js/pull/431))
- Tests now require node 4.0+
  ([#438](https://github.com/validatorjs/validator.js/pull/438))

#### 4.0.6

- Added a Taiwan locale to `isMobilePhone()`
  ([#432](https://github.com/validatorjs/validator.js/pull/432))
- Fixed a bug in `isBefore()` where it would return `null`
  ([#436](https://github.com/validatorjs/validator.js/pull/436))

#### 4.0.5

- Fixed a denial of service vulnerability in the `isEmail()` regex
  ([#152](https://github.com/validatorjs/validator.js/issues/152#issuecomment-131874928))

#### 4.0.4

- Reverted the leap year validation in `isDate()` as it introduced some regressions
  ([#422](https://github.com/validatorjs/validator.js/issues/422), [#423](https://github.com/validatorjs/validator.js/issues/423))

#### 4.0.3

- Added leap year validation to `isDate()`
  ([#418](https://github.com/validatorjs/validator.js/pull/418))

#### 4.0.2

- Fixed `isDecimal()` with an empty string
  ([#419](https://github.com/validatorjs/validator.js/issues/419))

#### 4.0.1

- Fixed `isByteLength()` with certain strings
  ([09f0c6d](https://github.com/validatorjs/validator.js/commit/09f0c6d2321f0c78af6a7de42e91b63955e4c01e))
- Put length restrictions on email parts
  ([#258](https://github.com/validatorjs/validator.js/issues/258#issuecomment-127173612))

#### 4.0.0

- Simplified the `isEmail()` regex and fixed some edge cases
  ([#258](https://github.com/validatorjs/validator.js/issues/258#issuecomment-127173612))
- Added ISO 8601 date validation via `isISO8601()`
  ([#373](https://github.com/validatorjs/validator.js/issues/373))
