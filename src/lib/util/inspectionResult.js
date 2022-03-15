export default class InspectionResult {
  constructor(properties) {
    this.isValid = false;
    this.properties = properties || {};

    if (properties) {
      this.propertiesTotal = Object.keys(properties).length;
    } else {
      this.propertiesTotal = 0;
    }
  }

  addProperty(propertyName, propertyValue) {
    if (this.properties.hasOwnProperty(propertyValue)) {
      throw new Error(`Property with name ${propertyName} already exists.`);
    }

    this.properties[propertyName] = propertyValue;
    this.propertiesTotal += 1;
  }
}
