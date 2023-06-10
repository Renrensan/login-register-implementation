// const pool = require("./connect.js")
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./connect-database");
const bcrypt = require("bcrypt");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(5000, () => {
  console.log("Connected to Server port 5000");
});

const validateEmptyRegData = async (req, res, next) => {
  const { username, email, password } = req.body;
  const isEmptyFields = {
    username: false,
    email: false,
    password: false,
  };

  if (
    username.trim().length !== 0 &&
    email.trim().length !== 0 &&
    password.trim().length !== 0
  ) {
    console.log("no empty data");
    next();
  } else {
    if (username.trim().length === 0) {
      isEmptyFields.username = true;
    }
    if (email.trim().length === 0) {
      isEmptyFields.email = true;
    }
    if (password.trim().length === 0) {
      isEmptyFields.password = true;
    }
    return res.status(400).json({
      message: "There are empty fields being inputted",
      empty: isEmptyFields,
    });
  }
};

app.post("/register/checkduplicates/username", async (req, res) => {
  try {
    const { username } = req.body;
    const { rows } = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1) AS username_exists",
      [username]
    );
    const isDuplicate = rows[0].username_exists;
    if (!isDuplicate) {
      return res.status(200).json({ message: "Username Available" });
    } else {
      return res.status(400).json({ message: "Username Exists" });
    }
  } catch (error) {
    console.error("Error while checking username duplicates:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register/checkduplicates/email", async (req, res) => {
  try {
    const { email } = req.body;
    const { rows } = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) AS email_exists",
      [email]
    );
    const isDuplicate = rows[0].email_exists;
    if (!isDuplicate) {
      return res.status(200).json({ message: "Email Available" });
    } else {
      return res.status(400).json({ message: "Email Exists" });
    }
  } catch (error) {
    console.error("Error while checking email duplicates:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register", validateEmptyRegData, async (req, res) => {
  try {
    const { username, password, email } = req.body;
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);
    await pool.query(
      "  INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
      [username, hashedPassword, email]
    );
    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
