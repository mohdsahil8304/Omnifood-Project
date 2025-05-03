"use strict";

const express = require("express");
const router = express.Router();
const con = require("../src/app");
const auth = require("../routes/apiRouter");

const authController = require("../controller/auth");
// const { resetpassword } = require("../controller/auth");

// const authControllerdb = require("../controller/db");
// const { hashSync, genSaltSync } = require("bcrypt");

const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

// router.post("/restpassword", encoder, authControllerdb.resetpassword);

// router.get("/signUp", (req, res) => {
//   res.render("signUp");
// });

router.post("/signUp", encoder, auth, authController.signUp);
router.post("/logIn", encoder, auth,authController.logIn);
router.post("/forgetpassword", auth, encoder, authController.forgetpassword);
// router.patch("/forgetpassword", encoder, authController.forgetpassword);

router.post("/resetpassword", encoder, auth, authController.resetpassword);
// router.patch("/resetpassword", encoder, authController.resetpassword);
// router.delete("/resetpassword", encoder, authController.resetpassword);

module.exports = router;
