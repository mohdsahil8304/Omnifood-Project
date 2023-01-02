// const mysql = require("mysql");
// const con = require("../src/app");

// const db = {};

// // ***Requests to the User table ***

// db.allUser = () => {
//   return (req, res) => {
//     con.query("SELECT * FROM user", (error, result) => {
//       if (error) {
//         return console.log(error);
//       } else {
//         res.send(result);
//         console.log(result);
//       }
//     });
//   };
//   // return new Promise((resolve, reject) => {
//   //   con.query("SELECT * FROM user ", (error, users) => {
//   //     if (error) {
//   //       return reject(error);
//   //     }
//   //     return resolve(users);
//   //   });
//   // });
// };

// db.getUserByEmail = (email) => {
//   return (req, res) => {
//     con.query(
//       "SELECT * FROM user WHERE email = ?",
//       [email],
//       async (error, result) => {
//         let results = JSON.parse(JSON.stringify(result));
//         results = results.find((item) => item.email);
//         console.log(">>>>>>>>>", result, results, email, [email]);
//         if (error) {
//           return console.log(error);
//         } else {
//           res.send(results.email);
//           console.log(results.email);
//         }
//       }
//     );
//   };
//   // return new Promise((resolve, reject) => {
//   //   con.query("SELECT * FROM user WHERE email = ?", [email], (error, users) => {
//   //     if (error) {
//   //       console.log("error");
//   //       return reject(error);
//   //     }
//   //     return resolve(users[0]);
//   //   });
//   // });
// };

// db.updateUser = (name, email, password, confirmpassword, id) => {
//   return (req, res) => {
//     con.query(
//       "UPDATE user SET name = ?, email = ?, password= ?, confirmpassword = ? WHERE id = ?",
//       [name, email, password, confirmpassword, id],
//       (error, result) => {
//         if (error) {
//           return console.log(error);
//         } else {
//           res.send(result);
//           console.log(result);
//         }
//       }
//     );
//   };
//   // return new Promise((resolve, reject) => {
//   //   con.query(
//   //     "UPDATE user SET name = ?, email = ?, password= ?, confirmpassword = ? WHERE id = ?",
//   //     [name, email, password, confirmpassword, id],
//   //     (error) => {
//   //       if (error) {
//   //         return reject(error);
//   //       }

//   //       return resolve();
//   //     }
//   //   );
//   // });
// };

// db.updateUserPassword = (password, id) => {
//   return (req, res) => {
//     con.query(
//       "UPDATE user SET  password=? WHERE id = ?",
//       [password, id],
//       (error, result) => {
//         if (error) {
//           return console.log(error);
//         } else {
//           res.send(result.password);
//           console.log(result.password);
//         }
//       }
//     );
//   };
//   // return new Promise((resolve, reject) => {
//   //   con.query(
//   //     "UPDATE user SET  password=? WHERE id = ?",
//   //     [password, id],
//   //     (error) => {
//   //       if (error) {
//   //         return reject(error);
//   //       }

//   //       return resolve();
//   //     }
//   //   );
//   // });
// };

// db.deleteUser = (id) => {
//   return (req, res) => {
//     con.query("DELETE FROM user WHERE id = ?", [id], (error) => {
//       if (error) {
//         return console.log(error);
//       } else {
//         res.send(console.log("User deleted"));
//       }
//     });
//   };
//   // return new Promise((resolve, reject) => {
//   //   con.query("DELETE FROM user WHERE id = ?", [id], (error) => {
//   //     if (error) {
//   //       return reject(error);
//   //     }
//   //     return resolve(console.log("User deleted"));
//   //   });
//   // });
// };

// // ***Requests to the  resetPasswordToken table ***

// db.expireOldTokens = (email, used) => {
//   return (req, res) => {
//     con.query(
//       "UPDATE resetpasswordtoken SET used = ?  WHERE email = ?",
//       [used, email],
//       (error, result) => {
//         if (error) {
//           return console.log(error);
//         } else {
//           res.send(result.used);
//           console.log(result.used);
//         }
//       }
//     );
//   };
//   // return new Promise((resolve, reject) => {
//   //   con.query(
//   //     "UPDATE resetpasswordtoken SET used = ?  WHERE email = ?",
//   //     [used, email],
//   //     (error) => {
//   //       if (error) {
//   //         return reject(error);
//   //       }

//   //       return resolve();
//   //     }
//   //   );
//   // });
// };

// db.insertResetToken = (email, tokenValue, createdAt, expiredAt, used) => {
//   return (req, res) => {
//     con.query(
//       "INSERT INTO resetrasswordtoken ( email, Token_value,created_at, expired_at, used) VALUES (?, ?,?, ?, ?)",
//       [email, tokenValue, createdAt, expiredAt, used],
//       (error, result) => {
//         if (error) {
//           return console.log(error);
//         } else {
//           res.send(result.insertId);
//         }
//       }
//     );
//   };
//   // return new Promise((resolve, reject) => {
//   //   con.query(
//   //     "INSERT INTO resetrasswordtoken ( email, Token_value,created_at, expired_at, used) VALUES (?, ?,?, ?, ?)",
//   //     [email, tokenValue, createdAt, expiredAt, used],
//   //     (error, result) => {
//   //       if (error) {
//   //         return reject(error);
//   //       }
//   //       return resolve(result.insertId);
//   //     }
//   //   );
//   // });
// };

// db.findValidToken = (token, email, currentTime) => {
//   return (req, res) => {
//     con.query(
//       "SELECT * FROM resetpasswordtoken WHERE (email = ? AND Token_value = ? AND expired_at > ?)",
//       [email, token, currentTime],
//       (error, result) => {
//         if (error) {
//           return console.log(error);
//         } else {
//           res.send(result.token[0]);
//         }
//       }
//     );
//   };
//   // return new Promise((resolve, reject) => {
//   //   con.query(
//   //     "SELECT * FROM resetpasswordtoken WHERE (email = ? AND Token_value = ? AND expired_at > ?)",
//   //     [email, token, currentTime],
//   //     (error, tokens) => {
//   //       if (error) {
//   //         return reject(error);
//   //       }
//   //       return resolve(tokens[0]);
//   //     }
//   //   );
//   // });
// };
