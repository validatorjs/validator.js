export default function hasOption(options, optionName) {
  return options[optionName] !== null && typeof options[optionName] !== 'undefined';
}
