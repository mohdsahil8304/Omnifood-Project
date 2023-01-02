const express = require("express");
const router = express.Router();
const con = require("../src/app");

// const { resetpassword, forgetpassword } = require("../controller/auth");
router.get("/", (req, res) => {
  res.render("index", { session: req.session });
});
router.get("/signUp", (req, res) => {
  res.render("signUp");
});
router.get("/logIn", (req, res) => {
  res.render("logIn");
});
router.get("/logOut", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
router.get("/forgetpassword", (req, res) => {
  res.render("forgetpassword");
});
router.get("/auth/resetpassword", (req, res) => {
  let Email = req.query.Email;
  let tokenValue = req.query.token;
  console.log(tokenValue);
  console.log(Email);
  let currentTime = new Date(Date.now());
  let strTime = currentTime.toString()
  console.log(currentTime,strTime);

 if (!tokenValue || !Email) {
   // return res.sendStatus(400);
   console.log("bad request");
 }
 // then we need to verify if the token exist in the resetPasswordToken and not expired.

//  const token = findValidToken(resetToken, Email, currentTime);

 con.query(
   "SELECT * FROM resetpasswordtoken WHERE Email = ?",
   [Email, tokenValue, strTime],
   (error, result) => {
    console.log(result);
     let results = JSON.parse(JSON.stringify(result));
     results = results.find((item) => item);
     console.log(result, results, results.Email, results.tokenValue,results.expiredAt, strTime);
     if (error) {
       return console.log(error);
     } else {
       if (results.tokenValue === tokenValue && results.expiredAt >= strTime) {
        console.log("valid token.");
        con.query(
          "UPDATE resetpasswordtoken SET used = 1  WHERE Email = ?",
          [Email],
          (error, result) => {
            // let results = JSON.parse(JSON.stringify(result));
            // results = results.find((item) => item.email);
            // console.log(">>>>>>>>>", result, results, email, [email]);
            console.log(result);
            if (error) {
              return console.log(error);
            } else {
              console.log(result.used = 1);
              // console.log(result.Email);
              // return result.used = 1
              // console.log(result.used);
            }
          }
        );
         res.render("resetpassword");
       }else {
         console.log("Invalid token, please try again.");
        res.render("forgetpassword", {
          message: "Invalid token, please try again.",
        });
       }
     }
   }
 );
  
});
 

// router.get("*", (req, res) => {
//   res.render("404", {
//     Errormsg: "Opps Page Could Not Found! Go back🔄",
//   });
// });

module.exports = router;
