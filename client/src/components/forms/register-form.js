import { React, useState, useEffect, useRef } from "react";
import { Container, TextField, Typography, Button, Paper } from "@mui/material";
import { SuccessDialog } from "../UI/success-dialog";
import {
  ContentMiddle,
  WhiteTextField,
  GreyButton,
} from "../../styles/shared-styles";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export const RegisterForm = () => {
  axios.defaults.withCredentials = true;
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredPassConfirm, setEnteredPassConfirm] = useState("");

  //Validation States
  const [usernameValid, setUsernameValid] = useState(true);
  const [usernameError, setUsernameError] = useState("");

  const [emailValid, setEmailValid] = useState(true);
  const [emailError, setEmailError] = useState("");

  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordError, setPasswordError] = useState("");

  const [passwordConfirmValid, setPasswordConfirmValid] = useState(true);
  const [passwordConfirmError, setPasswordConfirmError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const [displayCaptchaError, setDisplayCaptchaError] = useState(false);
  const captchaRef = useRef();

  const handleCloseDialog = async () => {
    try {
      const loginData = {
        username: enteredUsername,
        password: enteredPassword,
      };
      const res = await axios.post("http://localhost:5000/login", loginData);
      if (res.status === 200) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      if (error.response.status === 500) {
        console.log("Internal Server Error");
      }
    }
    setOpenDialog(false);
  };

  const post_register = async (register_data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        register_data
      );
      if (response.status === 200) {
        setOpenDialog(true);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const errorMessages = {
    username: {
      error: (
        <Typography variant="p" component="p" sx={{ color: "red" }}>
          {usernameError}
        </Typography>
      ),
      success: (
        <Typography variant="p" component="p" sx={{ color: "green" }}>
          {usernameError}
        </Typography>
      ),
    },
    email: {
      success: (
        <Typography variant="p" component="p" sx={{ color: "green" }}>
          {emailError}
        </Typography>
      ),
      error: (
        <Typography variant="p" component="p" sx={{ color: "red" }}>
          {emailError}
        </Typography>
      ),
    },
    password: {
      success: (
        <Typography variant="p" component="p" sx={{ color: "green" }}>
          {passwordError}
        </Typography>
      ),
      error: (
        <Typography variant="p" component="p" sx={{ color: "red" }}>
          {passwordError}
        </Typography>
      ),
    },
    passwordConfirm: {
      success: (
        <Typography variant="p" component="p" sx={{ color: "green" }}>
          {passwordConfirmError}
        </Typography>
      ),
      error: (
        <Typography variant="p" component="p" sx={{ color: "red" }}>
          {passwordConfirmError}
        </Typography>
      ),
    },
    captcha: {
      error: (
        <Typography variant="p" component="p" sx={{ color: "red" }}>
          Please do the captcha verification correctly
        </Typography>
      ),
    },
  };

  const checkUsernameDuplicates = async (username) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/register/checkduplicates/username",
        { username }
      );
      if (res.status === 200) {
        setUsernameValid(true);
        setUsernameError("Username Valid");
      }
    } catch (error) {
      if (error.response.status === 400) {
        setUsernameValid(false);
        setUsernameError("Username already registered");
      }
    }
  };

  const checkEmailDuplicates = async (email) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/register/checkduplicates/email",
        { email }
      );
      if (res.status === 200) {
        setEmailValid(true);
        setEmailError("Email Valid");
      }
    } catch (error) {
      if (error.response.status === 400) {
        setEmailValid(false);
        setEmailError("Email already registered");
      }
    }
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      if (enteredUsername.trim().length < 5) {
        setUsernameValid(false);
        if (enteredUsername.trim().length === 0) {
          setUsernameError("Username cannot be Empty");
        } else {
          setUsernameError("Username must be 5 or more characters long");
        }
      } else {
        checkUsernameDuplicates(enteredUsername);
      }
    }, 500);
    return () => {
      clearTimeout(identifier);
    };
  }, [enteredUsername]);

  useEffect(() => {
    const identifier = setTimeout(() => {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      // Perform validation logic
      if (enteredEmail.trim().length === 0) {
        setEmailValid(false);
        setEmailError("Email cannot be empty!");
      } else if (!emailRegex.test(enteredEmail.trim())) {
        setEmailValid(false);
        setEmailError("Email is invalid");
      } else {
        checkEmailDuplicates(enteredEmail);
      }
    });

    return () => {
      clearTimeout(identifier);
    };
  }, [enteredEmail]);

  useEffect(() => {
    const identifier = setTimeout(() => {
      if (enteredPassword.trim().length < 8) {
        setPasswordValid(false);
        if (enteredPassword.trim().length === 0) {
          setPasswordError("Password cannot be empty");
        } else {
          setPasswordError("Password have to be 8 or more characters");
        }
      } else {
        setPasswordValid(true);
        setPasswordError("Password is valid");
      }
    });
    return () => {
      clearTimeout(identifier);
    };
  }, [enteredPassword]);

  useEffect(() => {
    const identifier = setTimeout(() => {
      if (enteredPassConfirm.trim().length === 0) {
        setPasswordConfirmValid(false);
        setPasswordConfirmError("Password doesn't match");
      } else {
        if (enteredPassConfirm !== enteredPassword) {
          setPasswordConfirmValid(false);
          setPasswordConfirmError("Password doesn't match");
        } else {
          setPasswordConfirmValid(true);
          setPasswordConfirmError("Password match");
        }
      }
      return () => {
        clearTimeout(identifier);
      };
    });
  }, [enteredPassConfirm, enteredPassword]);

  const handleUsernameChange = (event) => {
    setEnteredUsername(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEnteredEmail(event.target.value);
  };
  const handlePassChange = (event) => {
    setEnteredPassword(event.target.value);
  };
  const handlePassConfirmChange = (event) => {
    setEnteredPassConfirm(event.target.value);
  };

  const verifyCaptcha = async (responseToken) => {
    try {
      const res = await axios.post("http://localhost:5000/verifyCaptcha", {
        responseToken,
      });

      if (res.status === 200) {
        return true;
      }
    } catch (error) {
      if (error.response.status === 400) {
        return false;
      }
      console.error("reCAPTCHA verification error:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const registerData = {
      username: enteredUsername,
      email: enteredEmail,
      password: enteredPassword,
      passConfirm: enteredPassConfirm,
    };
    // IF ALL FIELDS ARE VALID THEN CHECK CAPTCHA 
    if (usernameValid && emailValid && passwordValid && passwordConfirmValid) {
      const captchaValid = await verifyCaptcha(captchaRef.current.getValue());
      //IF CAPTCHA VALID THEN USER REGISTER
      if (captchaValid) {
        post_register(registerData);
      } else {
        setDisplayCaptchaError(true);
      }
    }
  };

  return (
    <>
      <SuccessDialog
        message="Registration success"
        openDialog={openDialog}
        closeDialog={handleCloseDialog}
      ></SuccessDialog>
      <Container sx={{ ...ContentMiddle }} color="primary">
        <Paper sx={{ py: 5 }} component="form" onSubmit={handleSubmit}>
          <Container
            sx={{
              ...ContentMiddle,
              backgroundColor: "black",
              p: 3,
              width: "50vh",
            }}
          >
            <Typography
              variant="h4"
              component="h4"
              align="center"
              sx={{
                color: "white",
                my: 2,
              }}
            >
              Register
            </Typography>
            <TextField
              sx={{
                ...WhiteTextField,
              }}
              label="Username"
              variant="filled"
              value={enteredUsername}
              onChange={handleUsernameChange}
            />
            {!usernameValid
              ? errorMessages.username.error
              : errorMessages.username.success}
            <TextField
              sx={{
                ...WhiteTextField,
              }}
              type="email"
              label="Email"
              variant="filled"
              value={enteredEmail}
              onChange={handleEmailChange}
            />
            {!emailValid
              ? errorMessages.email.error
              : errorMessages.email.success}
            <TextField
              sx={{
                ...WhiteTextField,
              }}
              type="password"
              label="Password"
              variant="filled"
              value={enteredPassword}
              onChange={handlePassChange}
            />
            {!passwordValid
              ? errorMessages.password.error
              : errorMessages.password.success}
            <TextField
              sx={{
                ...WhiteTextField,
              }}
              type="password"
              label="Password Confirm"
              variant="filled"
              value={enteredPassConfirm}
              onChange={handlePassConfirmChange}
            />
            {passwordConfirmValid
              ? errorMessages.passwordConfirm.success
              : errorMessages.passwordConfirm.error}
            <Container sx={{ ...ContentMiddle, mt: 3, mb: 2 }}>
              <ReCAPTCHA
                sitekey="6Lc_V40mAAAAAC0K3piE7tL-ECrpxaCuJ1hj7qlm"
                ref={captchaRef}
              />
              {displayCaptchaError && errorMessages.captcha.error}
            </Container>
            <Container sx={{ ...ContentMiddle }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ ...GreyButton, my: 3 }}
              >
                Sign Up
              </Button>
              <Typography
                variant="p"
                component="p"
                align="center"
                sx={{
                  color: "white",
                  mb: 3,
                }}
              >
                Already have an account?{" "}
                <Typography
                  href="/login"
                  variant="a"
                  component="a"
                  sx={{
                    color: "blue",
                  }}
                >
                  Sign in
                </Typography>
              </Typography>
            </Container>
          </Container>
        </Paper>
      </Container>
    </>
  );
};
