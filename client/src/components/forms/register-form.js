import { React, useState, useEffect } from "react";
import { Container, TextField, Typography, Button, Paper} from "@mui/material";
import { SuccessDialog } from "../UI/success-dialog";
import {
  ContentMiddle,
  WhiteTextField,
  GreyButton,
} from "../../styles/shared-styles";
import axios from "axios";

export const RegisterForm = () => {  
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
  
  const[openDialog,setOpenDialog] = useState(false)
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const post_register = async (register_data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        register_data
      );
      if (response.status === 200) {
        setEnteredUsername("");
        setEnteredEmail("");
        setEnteredPassword("");
        setEnteredPassConfirm("");
        setOpenDialog(true)
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
  }, [enteredUsername]);

  useEffect(() => {
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
  }, [enteredEmail]);

  useEffect(() => {
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
  }, [enteredPassword]);

  useEffect(() => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const registerData = {
      username: enteredUsername,
      email: enteredEmail,
      password: enteredPassword,
      passConfirm: enteredPassConfirm,
    };
    if (usernameValid && emailValid && passwordValid && passwordConfirmValid) {
      post_register(registerData);
    } else {
      alert("Correct Data First");
    }
  };

  return (
    <>
      <SuccessDialog message = "Registration success" openDialog={openDialog} closeDialog = {handleCloseDialog}></SuccessDialog>
      <Container sx={{ ...ContentMiddle, height: "100vh" }} color="primary">
        <Paper component="form" onSubmit={handleSubmit}>
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
            <Container sx={{ ...ContentMiddle }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ ...GreyButton, my: 3 }}
              >
                Sign Up
              </Button>
            </Container>
          </Container>
        </Paper>
      </Container>
    </>
  );
};
