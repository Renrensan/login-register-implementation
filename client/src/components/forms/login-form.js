import React, { useState } from "react";
import { Container, Paper, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ContentMiddle,
  WhiteTextField,
  GreyButton,
} from "../../styles/shared-styles";

export const LoginForm = (props) => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
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
        window.location.href = "/dashboard";
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
            <Typography
              variant="p"
              component="p"
              align="center"
              sx={{
                color: "white",
                mb: 3,
              }}
            >
              Dont have an account?{" "}
              <Typography
                href="/register"
                variant="a"
                component="a"
                sx={{
                  color: "blue",
                }}
              >
                Create an account
              </Typography>
            </Typography>
          </Container>
        </Container>
      </Paper>
    </Container>
  );
};
