import { Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { environment } from "../../environments/environment";

const useStyles = makeStyles({
  footerMain: {
    backgroundColor: "#fff",
    position: "fixed",
    width: "calc(100% - 40px)",
    padding: "20px",
    bottom: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    zIndex: 2
  },
  info: {
    fontSize: 13,
    fontFamily: "Lato",
    color: "#868686"
  },
  footerLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  linkName: {
    marginLeft: "10px",
    fontSize: 13,
    fontFamily: "Lato",
    color: "#868686",
    "&:hover": {
      textDecoration: "none"
    }
  },
  "@media screen and (max-width:767px)": {
    footerMain: {
      padding: "10px 20px",
      justifyContent: "center"
    }
  }
});

export default function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.footerMain}>
      <Typography className={classes.info}>Powered by edeXa Business Blockchain © {new Date().getFullYear()}</Typography>
      <div className={classes.footerLinks}>
        <Link href={environment.privacy} className={classes.linkName}>
          Privacy
        </Link>
        <Link href={environment.tCondition} className={classes.linkName}>
          {" "}
          Terms
        </Link>
      </div>
    </div>
  );
}
