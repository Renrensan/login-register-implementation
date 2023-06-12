// const pool = require("./connect.js")
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./connect-database");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const axios = require("axios");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
      secure: false, // Set to true if using HTTPS
    },
  })
);
app.use(cookieParser());
axios.defaults.withCredentials = true;

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

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { rows } = await pool.query(
      "SELECT user_id, password, username, email FROM users WHERE username = $1 OR email = $1",
      [username]
    );
    if (!rows[0]) {
      res.status(401).json({ message: "Invalid Username or Password" });
    } else {
      const userCredentials = rows[0];
      const passwordMatch = await bcrypt.compare(
        password,
        userCredentials.password
      );
      if (!passwordMatch) {
        res.status(401).json({ message: "Invalid Username or Password" });
      } else {
        loggedInUser = userCredentials.username;
        req.session.user = userCredentials;
        res
          .status(200)
          .json({ message: "Login success", user: userCredentials.username });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const authenticate = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

app.get("/user", authenticate, async (req, res) => {
  try {
    const userData = req.session.user;
    res.status(200).json({ message: "You fetched the data", data: userData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/logout", (req, res) => {
  // Clear the session data
  req.session.destroy();
  res.status(200).json({ message: "Logged out successfully" });
});

app.post("/verifyCaptcha", async (req, res) => {
  const secretKey = "6Lc_V40mAAAAAIW6W3amgDpSSfDHMahZsdj-mqtg";
  const { responseToken } = req.body;
  const verifySite = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${responseToken}`;
  try {
    const response = await axios.post(
      verifySite,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
      }
    );
    const success = response.data.success;
    if (success) {
      res.status(200).json({ message: "Captcha Verified" });
    }else{
      res.status(400).json({message:"Capctha is not done"})
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
