function isUPIId(upiId) {
  // Check for specific invalid cases
  if (
    upiId.includes(' ') || // UPI ID contains spaces
      upiId.includes('@@') || // UPI ID contains double "@" symbols
      /[!&]/.test(upiId) || // UPI ID contains special characters
      upiId.length > 100 || // UPI ID is too long (adjust as needed)
      /[!@]$/.test(upiId) || // UPI ID ends with "@" or "!"
      upiId.split('@').length !== 2 || // UPI ID doesn't have exactly one "@" symbol
      upiId.split('@')[1].includes('-') // UPI ID contains '-' after "@"
  ) {
    return false; // UPI ID is invalid due to specific cases
  }

  // Regular expression pattern for UPI ID validation
  const upiPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9-]+$/;

  // Check if the UPI ID is valid based on the pattern
  return upiPattern.test(upiId);
}

export default isUPIId;
