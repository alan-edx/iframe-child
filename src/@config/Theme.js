import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#073D83"
    },
    secondary: {
      main: "#868686"
    }
  },
  overrides: {
    MuiTypography: {
      colorTextPrimary: {
        color: "#56C75A"
      },
      body1: {
        fontFamily: "Lato"
      }
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 5
      },
      input: {
        padding: "19px 20px",
        color: "#4C4F53",
        fontFamily: "Lato",
        "&::placeholder": {
          color: "#868686",
          opacity: 1
        },
        "@media screen and (max-width: 767px)": {
          padding: 20
        }
      },
      notchedOutline: {
        borderColor: "#dadce0 !important"
      }
    },
    MuiSelect: {
      outlined: {
        textAlign: "left"
      }
    },
    MuiInputBase: {
      input: {
        "&:disabled": {
          color: "#868686"
        }
      },
      root: {
        color: "#4C4F53",
        fontFamily: "Lato"
      }
    },
    MuiFormHelperText: {
      contained: {
        marginLeft: 0,
        color: "#868686",
        fontFamily: "Lato"
      }
    },
    MuiTab: {
      root: {
        opacity: "1 !important",
        zIndex: 1
      },
      textColorInherit: {
        "&.Mui-selected": {
          backgroundColor: "#DADCE0 !important",
          borderRadius: "5px 5px 0 0"
        }
      }
    },
    PrivateTabIndicator: {
      root: {
        height: "100%",
        backgroundColor: "#DADCE0 !important",
        borderRadius: "5px 5px 0 0"
      }
    },
    MuiTabScrollButton: {
      root: {
        display: "none"
      }
    },
    MuiButton: {
      contained: {
        boxShadow: "none"
      }
    }
  }
});

export default theme;
