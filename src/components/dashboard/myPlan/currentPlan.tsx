import { Grid, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { FC } from "react";
import { useSelector } from "react-redux";
import { handleLabelKEY } from "../../../common/commonFunctions";

const useStyles = makeStyles({
  stampTitle: {
    fontFamily: "LatoMedium",
    fontSize: 22,
    color: "#0D0F12",
    marginBottom: 20
  },
  stampActive: {
    borderColor: "#073D83",
    border: "1px solid",
    borderRadius: 5,
    width: "100%",
    overflow: "hidden",
    height: 210
  },
  stampName: {
    fontSize: 18,
    fontFamily: "Lato",
    padding: "20px 0",
    textAlign: "center",
    background: "#073D83",
    color: "#fff"
  },
  stampDetail: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  stampPrice: {
    fontSize: 20,
    fontFamily: "LatoMedium",
    color: "#4C4F53",
    marginBottom: 10
  },
  f17: {
    fontSize: 17
  },
  file: {
    fontSize: 12,
    fontFamily: "Lato",
    color: "#8f8f8f"
  },
  paymentBtn: {
    fontSize: 16,
    fontFamily: "LatoMedium",
    padding: "15px 40px",
    color: "#fff !important",

    marginBottom: "10px"
  }
});

interface ICurrentPlan {
  setAction: (ac: any) => void;
}

const CurrentPlan: FC<ICurrentPlan> = ({ setAction }) => {
  const classes = useStyles();
  const selected_Language = useSelector((state: any) => state.labelsReducer.lang_);
  const adminlabelsFromReducer = useSelector((state: any) => state.labelsReducer.labels);
  const userPlan = useSelector((state: any) => state.userPlan);

  return (
    <Grid item sm={6}>
      <div className={classes.stampTitle}>
        {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.your_current_plan : adminlabelsFromReducer?.DE?.your_current_plan, "Your current plan")}
      </div>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <div style={{ marginRight: "20px" }}>
            <div className={`stampBox-12  ${classes.stampActive}`}>
              <div color="white" className={classes.stampName} style={{ textAlign: "left", paddingLeft: "20px" }}>
                {userPlan.planName}
              </div>
              <div className={classes.stampDetail} style={{ padding: "20px" }}>
                <Grid container>
                  <Grid item sm={4}>
                    <div className={classes.file}>PER FILE</div>
                    <div className={`${classes.stampPrice} ${classes.f17}`}>
                      {userPlan.totalStamps.toString() === "-1" ? "-" : userPlan.perFile === 0 ? "Free" : userPlan.perFile ? "$ " + Number(userPlan.perFile).toFixed(2) : userPlan.perFile}
                    </div>
                  </Grid>
                  <Grid item sm={4}>
                    <div className={classes.file}># Available Stamps</div>
                    <div className={`${classes.stampPrice} ${classes.f17}`}>{userPlan.totalStamps.toString() === "-1" ? "Unlimited" : userPlan.totalStamps}</div>
                  </Grid>
                  <Grid item sm={4}>
                    <div className={classes.file}># Used Stamps</div>
                    <div className={`${classes.stampPrice} ${classes.f17}`}>{userPlan.usedStamps}</div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        className={classes.paymentBtn}
        onClick={() =>
          setAction((action: boolean) => {
            return !action;
          })
        }>
        {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.upgrade : adminlabelsFromReducer?.DE?.upgrade, "UPGRADE")}
      </Button>
    </Grid>
  );
};

export default CurrentPlan;
