// For backward compatibility in underlying dependencies
if (!Object.entries) {
  Object.entries = function (obj) {
    const ownProps = Object.keys(obj);
    const resArray = [];
    for (let i = 0; i <= ownProps.length; i++) {
      resArray.push([ownProps[i], obj[ownProps[i]]]);
    }

    return resArray;
  };
}
