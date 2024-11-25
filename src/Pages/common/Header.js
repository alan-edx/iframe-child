import { MuiThemeProvider, createTheme, makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as io from "socket.io-client";
import { getAllApplication } from "../../actions/auth";
import { getDecryptedLocalStorage, getDeviceId, handleLabelKEY, handleLogout, setEncryptedLocalStorage } from "../../common/commonFunctions";
import { localStorageKeys, sessionStorageKeys } from "../../common/constants";
import { environment } from "../../environments/environment";
import "./header.css";

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
    MuiMenu: {
      paper: {
        borderRadius: 10,
        boxShadow: "none",
        border: "1px solid #dadce0",
        "&::-webkit-scrollbar": {
          display: "none"
        }
      },
      list: {
        width: "100% !important",
        paddingRight: "0 !important"
      }
    },
    MuiList: {
      padding: {
        paddingBottom: 0
      }
    }
  }
});

const useStyles = makeStyles({
  colorBlue: {
    textDecoration: "none"
  },
  customUserLogo: {
    background: "#073d83",
    width: 40,
    height: 40,
    borderRadius: 34,
    "& p": {
      color: "#fff",
      marginTop: 8
    }
  },
  headerMain: {
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#F8F8F8",
    width: "100%",
    left: 0,
    top: 0,
    zIndex: 2,
    height: 60
  },
  arrow: {
    "&:before": {
      border: "2px solid #073D83"
      // marginBottom: "50px",
    },
    color: "#073D83",
    marginTop: "50px"
  },
  Logo: {
    paddingLeft: 20,
    width: "120px",
    height: "30px"
  },
  rightSection: {
    display: "flex",
    alignItems: "center"
  },
  headerLink: {
    fontSize: 16,
    fontFamily: "LatoMedium",
    color: "#0D0F12",
    marginLeft: 15,
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none"
    }
  },
  dropDown: {
    borderStyle: "none",
    backgroundColor: "#F8F8F8",
    fontSize: 16,
    fontFamily: "LatoMedium",
    color: "#0D0F12",
    outline: "none"
  },
  logoutBtn: {
    width: 60,
    height: 60,
    padding: 0,
    marginLeft: 20,
    "&:hover": {
      backgroundColor: "#e8f0fe"
    }
  },
  loginBtn: {
    color: "#fff",
    fontSize: "16px",
    fontFamily: "LatoMedium",
    width: 88,
    height: 40,
    padding: 0,
    margin: "0 20px",
    textTransform: "capitalize",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#073D83",
      boxShadow: "none"
    }
  },
  userProfile: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    backgroundColor: "#868686",
    color: "#fff",
    marginRight: 10,
    overflow: "hidden",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  },
  userDetail: {
    display: "block"
  },
  userName: {
    fontSize: 16,
    fontFamily: "LatoBold",
    color: "#4C4F53",
    lineHeight: "20px"
  },
  userEmail: {
    fontSize: 14,
    fontFamily: "Lato",
    color: "#868686",
    lineHeight: "20px"
  },
  menuList: {
    padding: "10px 0",
    width: "100%",
    minWidth: 300,
    maxWidth: 398,
    overflow: "hidden",
    borderRadius: 10,
    margin: "auto",
    "&:hover": {
      backgroundColor: "#fff"
    }
  },
  menuBtn: {
    height: 60,
    width: 60,
    margin: "0 0 0 20px",
    "&:hover": {
      backgroundColor: "#fff"
    }
  },
  projectSection: {
    overflow: "auto",
    height: "100%",
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    margin: "auto",
    "&::-webkit-scrollbar": {
      display: "none"
    }
  },
  project: {
    width: "calc(25% - 8px)",
    height: "100%",
    textAlign: "center",
    padding: "10px 0 5px",
    margin: "0 4px 5px",
    pointerEvents: "visible",
    alignItems: "center",
    // justifyContent: "flex-end",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      backgroundColor: "#E8F0FE",
      borderRadius: 5
    }
  },
  disable: {
    opacity: 0.3,
    // pointerEvents: 'none',
    cursor: "not-allowed"
  },
  border: {
    // width: " 90%",
    // left: "-8px",
    position: "relative",
    border: "1px solid rgba(0,0,0,.15)"
  },
  appImg: {
    minHeight: 40,
    width: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      width: "100%",
      height: "100%"
    }
  },
  projectTitle: {
    fontSize: 14,
    paddingTop: 5
  },
  moreProject: {
    width: "100%",
    position: "sticky",
    bottom: 0,
    left: 0,
    height: 57,
    backgroundColor: "#fff",
    border: "1px solid #dadce0",
    borderWidth: "1px 0 0",
    cursor: "pointer",
    color: "#073D83",
    fontSize: 14,
    fontFamily: "LatoBold",
    "&:hover": {
      backgroundColor: "#E8F0FE"
    }
  },
  menuProfile: {
    width: 60,
    height: 60,
    padding: 0,
    marginRight: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: "#fff"
    }
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "transparent",
    overflow: "hidden",
    border: "none",
    minWidth: 0,
    padding: 0,
    "& img": {
      width: "100%"
    }
  },
  downArrow: {
    color: "#868686",
    position: "absolute",
    right: 15,
    width: "fit-content !important",
    top: 25,
    fontSize: 12
  },
  profileMsg: {
    fontSize: 11,
    color: "#4c4f53",
    background: "#e8f0fe",
    textAlign: "center",
    borderRadius: 5,
    padding: "4px 30px",
    lineHeight: "12px"
  },
  profileDetail: {
    textAlign: "center",
    marginTop: 20,
    width: "100%",
    "& img": {
      maxWidth: "80%",
      borderRadius: "50%",
      maxHeight: "100px"
    }
  },
  manageBtn: {
    color: "#fff",
    fontSize: 13,
    textTransform: "none",
    lineHeight: "28px",
    padding: 0,
    borderRadius: 5,
    boxShadow: "none"
  },
  profileName: {
    color: "#0d0f12",
    fontSize: 16,
    fontFamily: "LatoBold",
    lineHeight: "26px"
  },
  profileMail: {
    color: "#0d0f12",
    fontSize: 14,
    fontFamily: "Lato",
    lineHeight: "26px"
  },
  profileId: {
    width: "100%",
    padding: "0 5px",
    height: 190,
    overflow: "auto",
    "&::-webkit-scrollbar": {
      display: "none"
    }
  },
  profileDescription: {
    display: "flex",
    alignItems: "center",
    padding: 10,
    "& img": {
      borderRadius: "50%",
      marginRight: 10
    }
  },
  userProfileDetail: {
    padding: "0 5px 10px",
    width: "100%",
    "&:hover": {
      backgroundColor: "#fff"
    }
  },
  userTitle: {
    color: "#4C4F53",
    fontSize: 14,
    fontFamily: "LatoBold",
    lineHeight: "18px"
  },
  profileFooter: {
    position: "sticky",
    bottom: 0,
    left: 0,
    backgroundColor: "#fff",
    width: "100%"
  },
  logout: {
    borderWidth: "1px 0 1px 0",
    borderColor: "#DADCE0",
    borderStyle: "solid",
    height: 50,
    display: "flex",
    alignItems: "center",
    padding: "0 10px"
  },
  logoutButton: {
    background: "transparent",
    padding: 5,
    border: "1px solid #DADCE0",
    fontSize: 13,
    borderRadius: 5,
    width: "100%",
    lineHeight: "18px",
    cursor: "pointer"
  },
  policy: {
    textAlign: "center",
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  policyName: {
    color: "#868686",
    fontSize: 11,
    lineHeight: "16px",
    textDecoration: "none"
  },
  activeMenu: {
    color: "#0a58ca"
  },
  "@media screen and (max-width: 767px)": {
    Logo: {
      paddingLeft: 10
    },
    userDetail: {
      display: "none"
    },
    logoutBtn: {
      marginLeft: 0
    },
    headerLink: {
      marginLeft: 10,
      fontSize: 12
    },
    menuBtn: {
      width: 30,
      margin: "0 0 0 10px"
    },
    menuProfile: {
      width: 30
    }
  },
  "@media screen and (max-width: 320px)": {
    Logo: {
      width: "25%"
    }
  }
});

const fallBackLogo = "https://account-files-bucket.s3.ap-south-1.amazonaws.com/logo/bstamp.svg";

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const selected_Language = useSelector((state) => state.labelsReducer.lang_);
  const adminlabelsFromReducer = useSelector((state) => state.labelsReducer.labels);
  const userDataStringified = useSelector((state) => state.userDetails.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIN);
  const userData = JSON.parse(userDataStringified);

  const [isAvailableApps, setAvailableApps] = useState([]);
  const [bStampLogo, setBStampLogo] = useState("");

  const availableApps = getDecryptedLocalStorage(localStorageKeys.isAvailableApps);
  const availableAppsList = JSON.parse(availableApps);

  useEffect(() => {
    let socket = io.io(environment.accountsAPIEndpoint, {
      path: "/socket.io",
      transports: ["websocket", "polling"]
    });
    if (isLoggedIn && userDataStringified) {
      getAllApplication()
        .then((response) => {
          setEncryptedLocalStorage(localStorageKeys.isAvailableApps, JSON.stringify(response.data));
          setAvailableApps(response.data);
          setBStampLogo(() => {
            if (Array.isArray(response.data)) {
              return response.data.find((item) => item?.name === "bStamp")?.logo || fallBackLogo;
            } else {
              return fallBackLogo;
            }
          });
        })
        .catch(() => {
          setAvailableApps(availableAppsList);
        });
      let userId = userData?.userId;

      socket.on(`deviceLogout_${userId}`, (data) => {
        if (data.logoutAll) {
          handleLogout();
          history.push("/");
        } else {
          if (getDeviceId() === data.deviceId) {
            handleLogout();
            history.push("/");
          }
        }
      });
    }
    return () => {
      socket.removeAllListeners();
      socket.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const searchToogle = () => {
    history.push("/search");
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.headerMain}>
        <Link to="/">{bStampLogo ? <img src={bStampLogo} alt="logo" className={classes.Logo} /> : null}</Link>
        <div className={classes.rightSection}>
          {isLoggedIn && (
            <div style={{ display: "flex" }}>
              <div onClick={searchToogle} className={classes.headerLink}>
                {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.validate : adminlabelsFromReducer?.DE?.validate, "Validate")}
              </div>
            </div>
          )}
        </div>
      </div>
    </MuiThemeProvider>
  );
}
