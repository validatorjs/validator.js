export default function isAadharCardNumber(str) {
  const aadhar = str;
  const adharcardTwelveDigit = /^\d{12}$/;
  const adharSixteenDigit = /^\d{16}$/;
  if (aadhar !== '') {
    if (aadhar.match(adharcardTwelveDigit)) {
      return true;
    } else if (aadhar.match(adharSixteenDigit)) {
      return true;
    } return false;
  }
  return false;
}
