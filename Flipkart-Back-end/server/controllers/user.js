const userModel = require("../models/user");
const responseMessages = require("../resources/response.json");
const responseHandler = require("../utils/responseHandler");

module.exports = {
  signin: async (req, res, next) => {
    try {
      return res.status(200).json({ message: "login success" });
    } catch (err) {}
  },

  signup: async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const model = await userModel.findOne({ email });

      const _user = new userModel({
        firstName,
        lastName,
        email,
        password,
        userName: Math.random().toString(),
      });

      await _user.save();

      return responseHandler.handleSuccess(res, {
        message: responseMessages.SIGNUP_SUCCESSFULLY,
        statusCode: 201,
      });
    } catch (err) {
      console.log("Err:", err);
      return responseHandler.handleError(res, err);
    }
  },
};
