export const ContentMiddle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

export const WhiteTextField = {
  backgroundColor: "white",
  maxHeight: "2.5 rem",
  width: "15rem",
  my:2,
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "lightgray",
    },
    "&:hover fieldset": {
      borderColor: "gray",
    },
    "&.Mui-focused fieldset": {
      borderColor: "blue",
    },
  },
  "& .MuiInputLabel-root": {
    color: "gray",
  },
};

export const GreyButton ={
    height: "3rem",
    width: "9rem",
    backgroundColor: "#808080",
    "&:hover": {
      backgroundColor: "#5A5A5A",
    }
}
