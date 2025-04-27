import assertString from "./util/assertString.js";
import isJWT from "./isJWT.js";

export default function isJWTExpired(str) {
  assertString(str);
  if (!isJWT(str)) {
    console.log("Not a valid JWT Token.");
    return true; //return true even if invalid JWT token. invalid token considered as expired.
  }
  try {
    const jwtPayload = JSON.parse(atob(str.split(".")[1])); //get payload in JSON form.
    const expTime = jwtPayload.exp;
    if (typeof expTime === "undefined") {
      console.log("No expiration set for token.");
      return false; //no expiration => never expires.
    } else {
      const currTime = new Date().getTime() / 1000;
      expTime <= currTime
        ? console.log("Token expired.")
        : console.log(`Remaining time before expiration: ${(expTime - currTime).toFixed(2)}s`);
      return expTime <= currTime;
    }
  } catch {
    console.log("String is not encoded correctly.");
    return true; //return true even if invalid JWT token. invalid token considered as expired.
  }
}
