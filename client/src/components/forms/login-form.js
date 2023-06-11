import React, { useState } from "react";
import { Container, Paper, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import {
  ContentMiddle,
  WhiteTextField,
  GreyButton,
} from "../../styles/shared-styles";

export const LoginForm = () => {
  axios.defaults.withCredentials = true
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleUsernameChange = (event) => {
    setEnteredUsername(event.target.value);
  };
  const handlePassChange = (event) => {
    setEnteredPassword(event.target.value);
  };

  const postLoginData = async (loginData) => {
    try {
      const res = await axios.post("http://localhost:5000/login", loginData);
      if (res.status === 200) {
        setAuthorized(true);
        const protectedRes = await axios.get("http://localhost:5000/user")
        alert(protectedRes.data.message)
      }
    } catch (error) {
      if (error.response.status === 500) {
        console.log("Internal Server Error");
      } else if (error.response.status === 401) {
        setAuthorized(false);
        setShowError(true);
        console.log(error.response.data.message);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginData = {
      username: enteredUsername,
      password: enteredPassword,
    };
    postLoginData(loginData);
  };

  return (
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
            Login
          </Typography>
          <TextField
            sx={{
              ...WhiteTextField,
            }}
            label="Username/Email"
            variant="filled"
            value={enteredUsername}
            onChange={handleUsernameChange}
          />
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
          <Container sx={{ ...ContentMiddle, mt: 2 }}>
            {showError && (
              <Typography
                variant="p"
                component="p"
                align="center"
                sx={{
                  color: "red",
                }}
              >
                Invalid Username or Password
              </Typography>
            )}
          </Container>
          <Container sx={{ ...ContentMiddle }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ ...GreyButton, my: 3 }}
            >
              Login
            </Button>
          </Container>
        </Container>
      </Paper>
    </Container>
  );
};
