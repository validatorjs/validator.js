<!--
Add a descriptive title textbox above, e.g.
feat(validatorName): brief title of what has been done
-->

<!--- briefly describe what you have done in this PR --->

## Checklist
Validator added:
isAadharCardNumber=basically Aadhar card number is unique identitiy number of Indian citizen and it require in various form filing along with documents .It is 12 or 16 digit number so i check for both using regex

isCountryByCode= Each country has it own Country Code Like US ,IN ,AF so we check give Country Code and find it valid or not along with is return country name if is is invalid it return invalid country code

isValidCountryName=if we are only using country name the we need to valid country name also so I list down all the country an validating country from all country list currently available 


No Readme Updated 

All the test case are return in Client-side.js and passed 


- [ ] PR contains only changes related; no stray files, etc.
- [ ] README updated (where applicable)
- [ ] Tests written (where applicable)
