const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const responseHandler = require("../utils/responseHandler");
const responseMessages = require("../resources/response.json");
const { haveValue } = require("../utils/common");

const checkAuth = async (req, res, next) => {
  console.log("header:", req.headers);
  let jwtToken = req.headers["authorization"];

  if (!haveValue(jwtToken))
    return responseHandler.handleError(res, {
      message: responseMessages.TOKEN_NOT_PROVIDED,
      statusCode: 403,
    });

  let token = jwtToken.split(" ")[1];
  if (!token)
    return responseHandler.handleError(res, {
      message: responseMessages.INVALID_TOKEN,
      statusCode: 403,
    });

  try {
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({
      _id: decodedToken._id,
      deletedAt: null,
    });
    console.log("user: ", user);

    if (!user)
      return responseHandler.handleError(res, {
        message: responseMessages.USER_NOT_FOUND,
      });

    let userInfo = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    req.user = userInfo;

    next();
  } catch (err) {
    console.log("Err:", err);
    return responseHandler.handleError(res, {
      message: responseMessages.REQUEST_FAILED,
      statusCode: 503,
    });
  }
};

module.exports = {
  checkAuth,
};
