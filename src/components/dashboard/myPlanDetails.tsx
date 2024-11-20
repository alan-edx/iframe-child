import Grid from "@material-ui/core/Grid";
import { FC } from "react";
import BillingHistory from "./myPlan/billingHistory";
import CurrentPlan from "./myPlan/currentPlan";

interface IMyPlanDetails {
  setAction: (ac: any) => void;
}

const MyPlanDetails: FC<IMyPlanDetails> = ({ setAction }) => {
  return (
    <Grid container>
      <CurrentPlan setAction={setAction} />
      <BillingHistory />
    </Grid>
  );
};

export default MyPlanDetails;
