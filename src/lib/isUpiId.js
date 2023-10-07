function isUPIId(upiId) {
  // Regular expression pattern for UPI ID validation
  const upiPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9-]+$/;

  return upiPattern.test(upiId);
}
export default isUPIId;
