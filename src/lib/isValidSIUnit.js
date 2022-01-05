import assertString from './util/assertString';
// "http://physics.nist.gov/cuu/Units/units.html"
const units = [
  'kat/m³', 'W/(m²·sr)', 'W/sr', 'Gy/s', 'C/kg', 'J/(mol·K)', 'J/mol',
  'H/m', 'F/m', 'C/m²', 'C/m³', 'V/m', 'J/m³', 'W/(m·K)', 'J/kg', 'J/(kg·K)',
  'J/K', 'W/m²', 'rad/s²', 'rad/s', 'N/m', 'N·m', 'Pa·s', 'kat', 'Sv', 'Gy', 'Bq',
  'lx', 'lm', 'H', 'T', 'Wb', 'S', 'Ω', 'V', 'C', 'W', 'J', 'Pa', 'N', 'Hz', 'sr', 'rad',
  'cd/m²', 'mol/m³', 'A/m', 'A/m²', 'm³/kg', 'kg/m³', 'm⁻¹', 'm/s²', 'm/s', 'm³', 'm²',
  'cd', 'mol', 'K', 'A', 's', 'kg', 'm', 'ohm',
];

const unitSet = new Set(units);
function isValidSIUnit(str) {
  assertString(str);
  return unitSet.has(str);
}
export default isValidSIUnit;
