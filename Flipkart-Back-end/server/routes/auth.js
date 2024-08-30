const express = require("express");
const router = express.Router();
const { signin, signup, profile } = require("../controllers/auth");
const { checkAuth } = require("../middlewares/auth");

router.post("/signin", signin);

router.post("/signup", signup);

router.post("/profile", checkAuth, profile);

module.exports = router;
