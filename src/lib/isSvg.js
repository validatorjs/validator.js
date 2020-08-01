import assertString from './util/assertString';

export default function isSvg(str) {
  assertString(str);
  const htmlCommentRegex = /<!--([\s\S]*?)-->/g;
  const cleanEntities = (val) => {
    const entityRegex = /\s*<!Entity\s+\S*\s*(?:"|')[^"]+(?:"|')\s*>/gim;
    return val.replace(entityRegex, '');
  };
  const regex = /^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype svg[^>]*\s*(?:\[?(?:\s*<![^>]*>\s*)*\]?)*[^>]*>\s*)?(?:<svg[^>]*>[^]*<\/svg>|<svg[^/>]*\/\s*>)\s*$/i;
  return regex.test(cleanEntities(str.toString()).replace(htmlCommentRegex, ''));
}
