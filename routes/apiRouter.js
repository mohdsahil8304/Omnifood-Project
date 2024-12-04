const express = require("express");
const apiRouter = express.Router();
const con = require("../src/app");
const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");
// const session = require("express-session");
const cookie = require("cookie-parser");
const authController = require("../controller/auth");

// // const crypto = require("crypto");
// // const async = require("hbs/lib/async");
const encoder = bodyParser.urlencoded();

// apiRouter.post("/forgetpassword", encoder, async (req, res, next) => {
//   try {
//     // let {
//     //   resetId,
//     //   Email,
//     //   tokenValue,
//     //   createdAt,
//     //   expiredAt,
//     //   used,
//     //   currentTime,
//     // } = req.body;
//     const { email } = req.body;

//     // async (req, res, next) => {
//     //   con.query(
//     //     "SELECT * FROM user WHERE email = ?",
//     //     [email],
//     //     async (error, result) => {
//     //       console.log(result);
//     //       let results = JSON.parse(JSON.stringify(result));
//     //       results = results.find((item) => item.email);
//     //       console.log(">>>>>>>>>", result, results, email, [email]);
//     //       if (error) {
//     //         return console.log(error);
//     //       } else {
//     //         if (!results) {
//     //           // here we always return ok response to prevent email enumeration

//     //           return res.render("forgetpassword", {
//     //             message: "Your email is Invaild",
//     //           });
//     //         }
//     //         // return res.send(results.email);
//     //         // console.log(results.email);
//     //       }
//     //     }
//     //   );
//     // };
//     // const { id, email,, createdAt, expiredAt, used } = req.body;

//     console.log(email);
//     // const origin = req.header("Origin"); // we are  getting the request origin from  the HOST header
//     //   const tokenValue = crypto.randomBytes(40).toString("hex");
//     //   console.log(tokenValue);
//     //   const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
//     //   console.log(resetTokenExpires);
//     //   const createdAt = new Date(Date.now());
//     //   console.log(createdAt);

//     //  const expiredAt = resetTokenExpires;

//     // const user = await forgetpassword.getUserByEmail(email);

//     // console.log(user);

//     // Get all the tokens that were previously set for this user and set used to 1. This will prevent old and expired tokens  from being used.
//     // await forgetpassword.expireOldTokens(Email, 1);
//     // async (req, res) => {
//     //   con.query(
//     //     "UPDATE resetpasswordtoken SET used = ?  WHERE email = ?",
//     //     [used, Email],
//     //     (error, result) => {
//     //       if (error) {
//     //         return console.log(error);
//     //       } else {
//     //         return res.send(result.used);
//     //         // console.log(result.used);
//     //       }
//     //     }
//     //   );
//     // };

//     // create reset token that expires after 1 hours

//     //insert the new token into resetPasswordToken table
//     // await forgetpassword.insertResetToken(
//     //   resetId,
//     //   Email,
//     //   tokenValue,
//     //   createdAt,
//     //   expiredAt,
//     //   used,
//     //   currentTime
//     // );
//     // async (req, res) => {
//     //   con.query(
//     //     "INSERT INTO resetpasswordtoken SET ?",
//     //     {
//     //       resetId: resetId,
//     //       Email: Email,
//     //       tokenValue: tokenValue,
//     //       createdAt: createdAt,
//     //       expiredAt: expiredAt,
//     //       used: 0,
//     //       insertedAt: currentTime,
//     //     },
//     //     (error, result) => {
//     //       if (error) {
//     //         return console.log(error);
//     //       } else {
//     //         console.log(">>>>>>" + result.insertedAt);
//     //         return res.render("forgetpassword", {
//     //           message: "Reset link is send on your email",
//     //         });
//     //       }
//     //     }
//     //   );
//     // };

//     // send email
//     // await sendPasswordResetEmail(Email, tokenValue, origin);
//     // res.render("forgetpassword", {
//     //   message: "Please check your email for a new password",
//     // });
//   } catch (e) {
//     console.log(e);
//   }
// });

// async function sendPasswordResetEmail(Email, tokenValue, origin) {
//   let message;

//   if (origin) {
//     const resetUrl = `${origin}/apiRouter/resetPassword?token=${tokenValue} Email=${Email}`;
//     message = `<p>Please click the below link to reset your password, the link will be valid for 1 hour:</p>
//                          <p><a href="${resetUrl}">${resetUrl}</a></p>`;
//   } else {
//     message = `<p>Please use the below token to reset your password with the <code>/apiRouter/resetpassword</code> api route:</p>
//                          <p><code>${tokenValue}</code></p>`;
//   }

//   await sendEmail({
//     from: process.env.EMAIL_FROM,
//     to: Email,
//     subject: " Reset your Password",
//     html: `<h4>Reset Password </h4>
//                      ${message}`,
//   });
// }

// async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM }) {
//   // const transporter = nodemailer.createTransport({
//   //   host: "smtp.ethereal.Email",
//   //   port: 587,
//   //   secure: false,
//   //   auth: {
//   //     user: process.env.USER, // generated ethereal user
//   //     pass: process.env.PASS, // generated ethereal password
//   //   },
//   // });
//   const transporter = nodemailer.createTransport({
//     host: "email-smtp.ap-south-1.amazonaws.com",
//     port: "2587",
//     auth: {
//       user: "AKIAWUOUY7R3U4LJUMZR",
//       pass: "BARWYXMm3hHOQWlKH8gmRBx8cvI7xaUBpR76Y7yacdsy",
//     },
//   });

//   await transporter.sendMail({ from, to, subject, html });

//   console.log("email sent sucessfully");
// }

//  Reset token validate
// function validateResetToken(req, res, next) {
//   const Email = req.body.Email;
//   const resetToken = req.body.tokenValue;
//   const currentTime = new Date(Date.now());
//   res.send(currentTime);
//   console.log(Email);
//   console.log(resetToken);

//   if (!resetToken || !Email) {
//     // return res.sendStatus(400);
//     console.log("bad request");
//   }

//   // then we need to verify if the token exist in the resetPasswordToken and not expired.

//   // const token = findValidToken(resetToken, Email, currentTime);

//   // if (!token) {
//   //   console.log("Invalid token, please try again.");
//   // }

//   next();
// }

// apiRouter.post(
//   "/resetpassword",
//   encoder,
//   validateResetToken,
//   async (req, res, next) => {
//     try {
//       const newPassword = req.body.password;
//       const email = req.body.email;

//       if (!newPassword) {
//         return res.sendStatus(400);
//       }

//       const user = getUserByEmail(email);

//       const salt = genSaltSync(10);
//       const password = hashSync(newPassword, salt);

//       await updateUserPassword(password, user.id);

//       res.render("resetpassword", {
//         message:
//           "Password reset successful, you can now login with the new password",
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   }
// );
// module.exports = apiRouter;
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const auth = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  console.log(process.env.SECRET_KEY);
  try {
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY);
      res.clearCookie("jwt");
      // res.status(201).send("user authenticate succesfully");
      console.log("user authenticate succesfully");
      next();
    } else {
      res.status(200).send({
        success: false,
        message: "A token is required for authentication",
      });
      console.log("A token is required for authentication");
    }
  } catch {
    res.status(401).render("404", {
      Errormsg: "You Are Not Valid User Go Back",
    });
    console.log("You Are Not Valid User Go Back");
  }
};

module.exports = auth;
