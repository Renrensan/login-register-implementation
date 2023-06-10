import React, { useState } from "react";
import { Container, Paper, Typography, Button, TextField } from "@mui/material";
import {
  ContentMiddle,
  WhiteTextField,
  GreyButton,
} from "../../styles/shared-styles";

export const LoginForm = () => {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const handleUsernameChange = (event) => {
    setEnteredUsername(event.target.value);
  };
  const handlePassChange = (event) =>{
    setEnteredPassword(event.target.value)
  }

  const handleSubmit = event =>{
    event.preventDefault()
    const loginData = {
        username: enteredUsername,
        password: enteredPassword
    }
  }

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
            label="Username"
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
