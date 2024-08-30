const Joi = require("joi");
const userModel = require("../../models/user");
const responseMessages = require("../../resources/response.json");
const responseHandler = require("../../utils/responseHandler");
const requestHandler = require("../../utils/requestHandler");

module.exports = {
  signin: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });

      await requestHandler.validateRequest(req.body, schema);

      const model = await userModel.findOne({
        email: email,
        role: "admin",
        deletedAt: null,
      });
      console.log("model:", model);
      if (!model) {
        throw Error(responseMessages.USER_NOT_FOUND);
      }

      const isMatch = await model.authenticate(password);
      console.log("match:", isMatch);

      if (!isMatch) throw Error(responseMessages.INCORRECT_CREDENTIALS);

      const token = await model.createLoginToken();

      console.log("Token = ", token);

      return responseHandler.handleSuccess(res, {
        message: responseMessages.LOGIN_SUCCESSFULLY,
        data: {
          _id: model._id,
          token: token,
        },
      });
    } catch (err) {
      console.log("Err:", err);
      return responseHandler.handleError(res, err);
    }
  },

  signup: async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });

      await requestHandler.validateRequest(req.body, schema);

      const model = await userModel.findOne({
        email,
        deletedAt: { $ne: null },
      });

      const _user = new userModel({
        firstName,
        lastName,
        email,
        password,
        userName: Math.random().toString(),
        role: "admin",
      });

      await _user.save();

      return responseHandler.handleSuccess(res, {
        message: responseMessages.ADMIN_SIGNUP_SUCCESSFULLY,
        statusCode: 201,
      });
    } catch (err) {
      console.log("Err:", err);
      return responseHandler.handleError(res, err);
    }
  },

  profile: async (req, res, next) => {
    try {
      console.log("Next middleware: ", req.user);

      return responseHandler.handleSuccess(res, {
        message: "success",
      });
    } catch (err) {
      console.log("Err:", err);
      return responseHandler.handleError(res, err);
    }
  },
};
