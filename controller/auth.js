"use strict";

const mysql = require("mysql2");
// const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { hashSync, genSaltSync } = require("bcrypt");
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
// const async = require("hbs/lib/async");
const con = require("../src/app");

// USER = "AKIAWUOUY7R3U4LJUMZR"
// PASS = "userPassword""BARWYXMm3hHOQWlKH8gmRBx8cvI7xaUBpR76Y7yacdsy"

// const { json } = require("express/lib/response");

// con.query('CREATE TABLE ResetPasswordToken (' +
// 'id INT NOT NULL AUTO_INCREMENT,' +
// 'email VARCHAR(255) NOT NULL,' +
// 'Token_value VARCHAR(350) NOT NULL,' +
// 'created_at datetime  NOT NULL ,' +
// 'expired_at datetime  NOT NULL,' +
// 'used INT(11) NOT NULL default "0",' +
// 'inserted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
// 'PRIMARY KEY (id),' +
// 'UNIQUE INDEX id_UNIQUE (id ASC))' , function (err, result) {
//     if (err) throw err;
//     console.log("resetPasswordToken created");
// }
// );

exports.signUp = async (req, res) => {
  // console.log(req.body);
  //   const name = req.body.name;
  //   const email = req.body.email;
  //   const password = req.body.password;
  //   const confirmpassword = req.body.confirmpassword;
  // const con = mysql.createConnection({
  //   host: process.env.DATABASE_HOST,
  //   user: process.env.DATABASE_USER,
  //   password: process.env.DATABASE_PASSWORD,
  //   database: process.env.DATABASE,
  //   multipleStatements: process.env.DATABASE_MULTIPLESTATEMENTS,
  // });

  const { id, name, email, password, confirmpassword } = req.body;
  // res.send("Form Submitted");
  const hashedPassword = await bcrypt.hash(password, 8);
  // console.log(hashedPassword);
  // console.log(results.email, email);
  con.query(
    "INSERT INTO user SET ?",
    {
      id: id,
      name: name,
      email: email,
      password: hashedPassword,
      confirmpassword: hashedPassword,
    },
    (error, result) => {
      // console.log(">>>>>>" + result);
      if (error) {
        console.log(error);
      } else if (password !== confirmpassword) {
        res.render("signUp", {
          message: "Password do not match",
        });
        con.query("DELETE FROM user WHERE email = ?", [email], (error) => {
          if (error) {
            return console.log(error);
          } else {
            console.log("User deleted");
          }
        });
      } else {
        console.log(">>>>>>" + result);
        return res.render("signUp", {
          message: "User SignUp",
        });
      }
    }
  );
  con.query("SELECT * FROM user Where email = ?", [email], (error, result) => {
    if (error) {
      console.log(error);
    }
    // var result = JSON.stringify(result);
    let results = JSON.parse(JSON.stringify(result));
    results = results.find((item) => item);
    console.log(">>>>>>>>>", result, email, [email]);
    console.log(results.name);
    if (results.email === email && results.name === name) {
      console.log("user allready exist");
      return res.render("signUp", {
        message: "That email is already use",
      });
    } else if (password !== confirmpassword) {
      return res.render("signUp", {
        message: "Password do not match",
      });
    } else {
      return res.render("signUp", {
        message: "Please enter details properly",
      });
      // response.end();
    }
    // res.send("testing");
  });
};

exports.logIn = (req, res) => {
  const { email, password } = req.body;

  // console.log(hashedPassword);
  // console.log(password);

  con.query(
    "SELECT * FROM user Where email = ?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
      }
      // var result = JSON.stringify(result);
      // var result = JSON.stringify(result);
      let results = JSON.parse(JSON.stringify(result));
      results = results.find((item) => item);
      console.log(">>>>>>>>>", result, results, email, [email, password]);
      console.log(results.password);
      let passCompare = await bcrypt.compare(password, results.password);
      console.log(passCompare);
      if (results.email === email && passCompare) {
        console.log("user LogIn");
        return res.render("indexLog");
      } else {
        return res.render("logIn", {
          message: "Wrong Email Id or Password",
        });
      }
    }
  );
};

async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM }) {
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.Email", 
  //   port: 587, 
  //   secure: false,
  //   auth: {
  //     user: process.env.USER, // generated ethereal user
  //     pass: process.env.PASS, // generated ethereal password
  //   },
  // });
  const transporter = nodemailer.createTransport({
    host: "email-smtp.ap-south-1.amazonaws.com",
    port: "2587",
    auth: {
      user: "AKIAWUOUY7R3ZXAXFZTA",
      pass: "BA2ib5n6Hrx8gJBAGXc00hrtJ3Wp1JeNoAfd/hbi2t+q",
    },
  });

  await transporter.sendMail({ from, to, subject, html });
  console.log("email sent sucessfully");
}

async function sendPasswordResetEmail(Email, tokenValue, origin) {
  let message;

  if (origin) {
    const resetUrl = `${origin}/auth/resetpassword?token=${tokenValue}&Email=${Email}`;
    message = `<p>Please click the below link to reset your password, the link will be valid for 1 hour:</p>
                         <p><a href="${resetUrl}">${resetUrl}</a></p>`; 
// return resetUrl
                                
  } else {
    message = `<p>Please use the below token to reset your password with the <code>/auth/resetpassword</code> api route:</p><p><code>${tokenValue}</code></p>`;
  }

  await sendEmail({
    from: process.env.EMAIL_FROM,
    to: Email,
    subject: " Reset your Password",
    html: `<h4>Reset Password </h4>
                     ${message}`,
  });
} 



//  function fatchRestUrl(Email, tokenValue, origin){
//   // origin = req.header("Origin");
 
// }


// async function validateResetToken(Email,tokenValue,origin,currentTime,req) {
//   // Email = req.body.email;
//   // const token = req.header("token");
//   // const token = req.query.token

//   // console.log(token);

//  let url = `${origin}/auth/resetpassword?token=${tokenValue}&Email=${Email}`;

//  let params = (new URL(url)).searchParams;
//  var tokenValue = params.get("token"); 
//  console.log(tokenValue); 
//  var Email = params.get("Email");
//  console.log(Email);
// //  tokenValue = req.body.tokenValue; 
//   currentTime = new Date(Date.now());
//   console.log(currentTime);
//  if (!tokenValue || !Email) {
//    // return res.sendStatus(400);
//    console.log("bad request");
//  }
//  // then we need to verify if the token exist in the resetPasswordToken and not expired.

// //  const token = findValidToken(resetToken, Email, currentTime);

//  con.query(
//    "SELECT * FROM resetpasswordtoken WHERE Email = ?",
//    [Email, tokenValue, currentTime],
//    (error, result) => {
//     console.log(result);
//      let results = JSON.parse(JSON.stringify(result));
//      results = results.find((item) => item);
//      console.log(result, results, results.Email, results.tokenValue,results.expiredAt, currentTime);
//      if (error) {
//        return console.log(error);
//      } else {
//        if (results.tokenValue === tokenValue) {
//         console.log("valid token.");
//         con.query(
//           "UPDATE resetpasswordtoken SET used = 1  WHERE Email = ?",
//           [Email],
//           (error, result) => {
//             // let results = JSON.parse(JSON.stringify(result));
//             // results = results.find((item) => item.email);
//             // console.log(">>>>>>>>>", result, results, email, [email]);
//             console.log(result);
//             if (error) {
//               return console.log(error);
//             } else {
//               console.log(result.used = 1);
//               // console.log(result.Email);
//               // return result.used = 1
//               // console.log(result.used);
//             }
//           }
//         );
//         //     res.render("forgetpassword", {
//         //    message: "Invalid token, please try again.",
//         //  });
//        }else {
//         console.log("Invalid token, please try again.");
//        }
//      }
//    }
//  );
// // return `${Email} ${tokenValue} ${origin}`;
// // return Email;
//  // if (!token) {
//  //   console.log("Invalid token, please try again.");
//  // }
// //  await validateResetToken(Email, tokenValue, currentTime);

// //  next();
// }

// addEventListener("click", function fatchRestUrl(Email, tokenValue, origin){
//   // origin = req.header("Origin");
//   let url = `${origin}/auth/resetpassword?token=${tokenValue}&Email=${Email}`;

//  let params = (new URL(url)).searchParams;
//  var tokenValue = params.get("token"); 
//  console.log(tokenValue); 
//  var Email = params.get("Email");
//  console.log(Email);
 
// })

exports.resetpassword = async (req, res,next) => {
  
  // let url = await validateResetToken();
  // console.log(url);
  // await validateResetToken(Email, tokenValue, origin, currentTime);
  let email = req.query.Email;
  let tokenValue = req.query.token;
  console.log(email,tokenValue);
  // let { email, id } = req.params;
  // let { Email,used} = req.params;
  // console.log(email,Email); 
  // await validateResetToken(Email, tokenValue, origin, currentTime);
  
  // let email = req.body.email;
  // console.log(Email);
  // let tokenValue = req.query.token
  // console.log(tokenValue);
 

  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmpassword
  console.log(newPassword);
  console.log(confirmPassword);

  
  
  if (!newPassword && !confirmPassword) {
    return  res.render("resetpassword", {
      message:
        "Please Enter Password and Confirm Password",
    });
  }

    const salt = genSaltSync(10);
  const password = hashSync(newPassword, salt); 
  const confirmpassword = hashSync(confirmPassword,salt)
  console.log(password);
  console.log(confirmpassword);

  // con.query(
  //   "SELECT * FROM user WHERE email = ?",
  //   [email],
  //   async (error, result) => {
  //     let results = JSON.parse(JSON.stringify(result));
  //     results = results.find((item) => item.email);
  //     console.log(">>>>>>>>>", result, results, email, [email]);
  //     if (error) {
  //       return console.log(error);
  //     } else {
  //       if (results.email !== email) {
  //         // here we always return ok response to prevent email enumeration

  //         return res.render("resetpassword", {
  //           message: "Your email is Invaild",
  //         });
  //       }else{
  //         console.log("valid email");
  //       }
  //       // console.log(results.email);
  //     }
  //   }
  // );
  // const user = getUserByEmail(email);


  
  // await updateUserPassword(password, user.id);

  if(password === confirmpassword){
    con.query(
      "UPDATE user SET password= ?, confirmpassword = ? WHERE email = ?",
      [password,confirmpassword,email],
      (error, result) => {  
        console.log(result,email,password,confirmpassword);
        // let results = JSON.parse(JSON.stringify(result));
        // results = results.find((item) => item.email);
        // console.log(results,result);
        if (error) {
          return console.log(error);
        } else {
          console.log(result);
              res.render("logIn", {
            message:
              "Password reset successful, you can now login with the new password",
          });
          con.query("DELETE FROM resetpasswordtoken WHERE email = ?",[email],(error,result)=>{
            console.log(result,email);
            if(error){
              return console.log(error);
            }else{
              console.log("Delete Successfully");
            }
          })
        }
      }
    );
  }else{
    return res.render("resetpassword", {
      message:
        "Password do not match",
    });
  }

};

exports.forgetpassword = async (req, res) => {
  // const db = {};
  const origin = req.header("Origin"); // we are  getting the request origin from  the HOST header
  console.log(origin);
  let { resetId, tokenValue, createdAt, expiredAt, used, currentTime } = req.body;
  let Email = req.body.email;
  tokenValue = crypto.randomBytes(40).toString("hex");
  console.log(tokenValue);
  const resetTokenExpires = new Date(Date.now() + 60*60*1000);
  console.log(resetTokenExpires);
  let strExpTime = resetTokenExpires.toString();
  createdAt = new Date(Date.now());
  let strCreatTime = createdAt.toString();
  console.log(createdAt,strCreatTime);

  expiredAt = strExpTime;
  console.log(expiredAt); 

  // ***Requests to the User table ***
  const { name, email, password, confirmpassword, id } = req.body;


  /* UPDATE IF LINK IS USED CHANGE 0 TO 1  */

  


  /* CHECK USER WHO ENTER HIS EMAIL FOR FORGETPASSWORD ARE BLONG FORM USER TABLE OR NOT */
  /* IF IT IS RELATED FROM USER TABLE SO INSERT IT IN RESETPASSWORD TABLE AND SEND RESET LINK ON HIS EMAIL */

  con.query(
    "SELECT * FROM user Where email = ?",
    [email],
    async (error, result) => {
      let results = JSON.parse(JSON.stringify(result));
      results = results.find((item) => item.email);
      console.log(">>>>>>>>>", result, results, email, [email]);
      if (error) {
        return console.log(error);
      } else {
        console.log(email !== undefined)
        if (results.email === email) {
          console.log("your email is valid");
          con.query(
            "INSERT INTO resetpasswordtoken SET ?",
            {
              resetId: resetId,
              Email: Email,
              tokenValue: tokenValue,
              createdAt: strCreatTime,
              expiredAt: expiredAt,
              used: 0,
            },
            (error, result) => {
              if (error) {
                return console.log(error);
              } else {
                console.log(">>>>>>" + result);
                return res.render("forgetpassword", {
                  message: "Reset link is send on your email",
                });
              }
            }
          );
          con.query(
            "SELECT * FROM resetpasswordtoken Where Email = ?",
            [Email],
            async (error, result) => {
              let results = JSON.parse(JSON.stringify(result));
              results = results.find((item) => item.Email);
              console.log(">>>>>>>>>", result, results, Email, [Email]);
              if (error) {
                return console.log(error);
              } else {
                if (results.Email === Email) {
                  console.log("your email already in resetpasswordtoken ");
                  return res.render("forgetpassword", {
                    message: "You already enterd this Email check your email",
                  });
                }
              }
            }
            // console.log(results.email);
          );
        } else {
          // here we always return ok response to prevent email enumeration
          return res.render("forgetpassword", {
            message: "Your email is Invaild",
          });
        }
        // console.log(results.email);
      }
    }
  );



  await sendPasswordResetEmail(Email, tokenValue, origin);
  // await validateResetToken(Email, tokenValue, origin, currentTime);
  
  // res.render("forgetpassword", {
  //   message: "Please check your email for a new password",
  // });
  // };

  // await validateResetToken(Email, tokenValue, currentTime);

  /* UPDATE QUERY FOR USER TABLE */

  // con.query(
  //   "UPDATE user SET name = ?, email = ?, password= ?, confirmpassword = ? WHERE id = ?",
  //   [name, email, password, confirmpassword, id],
  //   (error, result) => {
  //     if (error) {
  //       return console.log(error);
  //     } else {
  //       console.log(result);
  //       return res.send(result);
  //       // console.log(result);
  //     }
  //   }
  // );

  // db.updateUserPassword = (password, id) => {

  //   con.query(
  //     "UPDATE user SET  password=? WHERE id = ?",
  //     [password, id],
  //     (error) => {
  //       if (error) {
  //         return reject(error);
  //       }

  //       return resolve();
  //     }
  //   );
  // });
  // };

  

  // con.query("DELETE FROM user WHERE id = ?", [id], (error) => {
  //   if (error) {
  //     return console.log(error);
  //   } else {
  //     return res.send(console.log("User deleted"));
  //   }
  // });
  // };

};


 

