import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { ContentMiddle, GreyButton } from "../styles/shared-styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Dashboard = (props) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout");
      window.location.href = "/dashboard"
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container sx={{ ...ContentMiddle, height: "100vh" }} color="primary">
      <Container
        sx={{
          ...ContentMiddle,
          backgroundColor: "black",
          width: "80vh",
          py: 5,
        }}
      >
        <Typography
          variant="h3"
          component="h3"
          align="center"
          sx={{
            color: "white",
            my: 1,
          }}
        >
          {props.username}
        </Typography>
        <Typography
          variant="h5"
          component="h5"
          align="center"
          sx={{
            color: "white",
            my: 2,
          }}
        >
          {props.email}
        </Typography>
        <Button
          onClick={handleLogout}
          variant="contained"
          size="large"
          sx={{ ...GreyButton, mt: 3 }}
        >
          Sign Out
        </Button>
      </Container>
    </Container>
  );
};
