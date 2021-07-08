const hashProperties = {
  algorithms: [
    { name: 'md5', hashLength: 32 },
    { name: 'md4', hashLength: 32 },
    { name: 'sha1', hashLength: 40 },
    { name: 'sha256', hashLength: 64 },
    { name: 'sha384', hashLength: 96 },
    { name: 'sha512', hashLength: 128 },
    { name: 'ripemd128', hashLength: 32 },
    { name: 'ripemd160', hashLength: 40 },
    { name: 'tiger128', hashLength: 32 },
    { name: 'tiger160', hashLength: 40 },
    { name: 'tiger192', hashLength: 48 },
    { name: 'crc32', hashLength: 8 },
    { name: 'crc32b', hashLength: 8 },
  ],
};

export default hashProperties;
