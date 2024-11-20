import { CircularProgress } from "@material-ui/core";
import { createTheme, makeStyles, MuiThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  overrides: {
    MuiCircularProgress: {
      root: {
        left: "45%"
      }
    }
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    color: "red",
    position: "absolute",
    "& >  + ": {
      marginLeft: theme.spacing(2)
    },

    top: 0,
    left: 0
  },
  loader: {
    zIndex: 10,
    width: "100px !important",
    height: "100px !important"
  }
}));

export default function CircularIndeterminate() {
  const classes = useStyles();
  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <CircularProgress className={classes.loader} style={{ color: "#073d83" }} />
      </div>
    </MuiThemeProvider>
  );
}
