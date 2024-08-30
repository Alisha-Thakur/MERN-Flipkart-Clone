const isEmpty = (data) => {
  if (
    data !== undefined &&
    data !== "undefined" &&
    data !== "" &&
    data !== null &&
    data !== "null"
  ) {
    return false;
  }
  return true;
};

const haveValue = (data) => {
  if (isEmpty(data)) {
    return false;
  }
  return true;
};

module.exports = {
  haveValue,
};
