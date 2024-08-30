const getErrorMessage = (error) => {
  let message = error.details[0].message;
  message = message.replace(/"/g, "");
  message = message.replace("[", "");
  message = message.replace("]", "");
  return message;
};

const validateRequest = async (data, schema) => {
  return new Promise((resolve, reject) => {
    const { error } = schema.validate(data);

    if (error) {
      console.log("joi error:", error);
      const message = getErrorMessage(error);
      reject(new Error(message));
    } else {
      resolve(true);
    }
  });
};

module.exports = {
  validateRequest,
};
