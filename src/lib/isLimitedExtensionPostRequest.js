import isEmail from './isEmail';
import isRingCentralIvrPin from './isRingCentralIvrPin';
import isRingCentralPassword from './isRingCentralPassword';


export default function isLimitedExtensionPostRequest(requestObj) {
  if (typeof requestObj !== 'object') {
    throw new Error(`should be an object not ${typeof requestObj}`);
  }

  if (!requestObj.ivrPin) {
    throw new Error('ivrPin required');
  } else if (isRingCentralIvrPin(requestObj.ivrPin) === false) {
    throw new Error(`ivrPin is invalid. Should be 6 digits, non sequestial, and repeated numbers. You sent ${requestObj.ivrPin}`);
  }

  if (!requestObj.password) {
    throw new Error('passowrd required');
  } else if (isRingCentralPassword(requestObj.password) === false) {
    throw new Error(`password is invalid. Should have an upper case, lower case, special character, and a number. You sent ${requestObj.password}`);
  }

  if (!requestObj.type) {
    throw new Error('type required');
  } else if (requestObj.type !== 'Limited') {
    throw new Error(`type should be 'Limited'. You sent ${requestObj.type}`);
  }

  if (!requestObj.contact) {
    throw new Error('contact body required');
  }

  if (!requestObj.contact.firstName) {
    throw new Error('contact.firstName required');
  }

  if (requestObj.contact.lastName) {
    throw new Error('contact.lastName forbidden');
  }

  if (!requestObj.contact.email) {
    throw new Error('contact.email required');
  } else if (isEmail(requestObj.contact.email) === false) {
    throw new Error(`contact.email is invalid. You sent ${contact.email}`);
  }

  return true;
}
