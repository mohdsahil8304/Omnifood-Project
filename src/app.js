const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const dotenv = require("dotenv");
const cookie = require("cookie-parser");
const port = process.env.PORT || 7000;
const mysql = require("mysql2");

const session = require("express-session");
// const apiRouter = require("../routes/apiRouter");
const cors = require("cors");
app.use(cookie());
// const dotenv = require("dotenv").config();

dotenv.config({ path: "./.env" });

const con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: process.env.DATABASE_MULTIPLESTATEMENTS,
  connectionLimit: process.env.CONNECTION_LIMIT,
});
con.connect((err) => {
  if (err) {
    console.warn("error");
  } else {
    console.warn("connected");
  }
});
module.exports = con;

const oneDay = 1000 * 60;

app.use(
  session({
    secret: "webslesson",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
  })
);
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by Api clients)
app.use(express.json());
//Define Routes
app.use("/", require("../routes/pages"));
app.use("/auth", require("../routes/auth"));
app.use("/apiRouter", require("../routes/apiRouter"));
app.use(cors());
// app.get("/meals", (req, res) => {
//   res.render("meals");
// });
// app.get("/testimonials", (req, res) => {
//   res.render("testimonials");
// });
// app.get("/pricing", (req, res) => {
//   res.render("pricing");
// });

app.listen(port, () => {
  console.log(`listening to the port at ${port}`);
});
