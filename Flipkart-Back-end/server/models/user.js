const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hashPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    contactNumber: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("password").set(function (password) {
  this.hashPassword = bcrypt.hashSync(password, 10);
});

userSchema.methods.authenticate = function (password) {
  console.log("Checking for the password: ", password, this.hashPassword);
  return bcrypt.compareSync(password, this.hashPassword);
};

userSchema.methods.createLoginToken = async function (time, secret) {
  return new Promise(async (resolve, reject) => {
    const jwtSecret = secret || process.env.JWT_SECRET;
    const options = {
      expiresIn: time || process.env.JWT_EXPIRES_IN,
    };

    console.log("this: ", this);
    console.log("this _id: ", this._id);

    jwt.sign({ _id: this._id }, jwtSecret, options, function (err, token) {
      console.log(token);
      if (token) {
        resolve(token);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = mongoose.model("user", userSchema);
