import { Grid, Typography, makeStyles } from "@material-ui/core";
import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";
import { onBillInfo } from "../../../actions/stamp";
import { handleLabelKEY } from "../../../common/commonFunctions";
import { onAddBillInfo } from "../../../store/bilingInfo/action";
import { setLoading } from "../../../store/loader/action";
import { IRootReducer } from "../../../store/root-reducer";
import BillingInformationModal from "./billingInformationModal";

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

const BillingHistory = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setopen] = useState(false);

  const selected_Language = useSelector((state: IRootReducer) => state.labelsReducer.lang_);
  const adminlabelsFromReducer = useSelector((state: IRootReducer) => state.labelsReducer.labels);
  const userPlan = useSelector((state: IRootReducer) => state.userPlan);

  const handleBillInfo = (id: string) => {
    dispatch(setLoading(true));
    const params = {
      billingId: id
    };
    onBillInfo(params).then((res) => {
      dispatch(onAddBillInfo(res.data));
      setopen(true);
      dispatch(setLoading(false));
    });
  };

  return (
    <Grid item sm={6}>
      <Typography className={classes.stampTitle}>
        {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.billing_history : adminlabelsFromReducer?.DE?.billing_history, "Billing history")}
      </Typography>
      <div className="table-responsive table-stamp p-0">
        {/* @ts-ignore */}
        <Table borderless>
          <thead
            className="table-header-color "
            style={{
              backgroundColor: "#f8f8f8",
              color: "#4c4f53"
            }}>
            <tr>
              <th className="tableHeader">{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.date : adminlabelsFromReducer?.DE?.date, "Date")}</th>
              <th className="tableHeader">{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.plan_name : adminlabelsFromReducer?.DE?.plan_name, "Plan name")}</th>
              <th className="tableHeader">{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.amount : adminlabelsFromReducer?.DE?.amount, "Amount")}</th>
              <th className="tableHeader">{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.action : adminlabelsFromReducer?.DE?.action, "Action")}</th>
            </tr>
          </thead>
          <tbody>
            {userPlan.userSubscription.length === 0 ? (
              <tr>
                <td colSpan={4} align="center">
                  {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.no_data : adminlabelsFromReducer?.DE?.no_data, "No Data")}
                </td>
              </tr>
            ) : (
              userPlan.userSubscription.map((data: any, index: any) => (
                <tr key={index}>
                  <td className="tableData">{moment(data.purchaseDate).format("DD MMM, YYYY")}</td>
                  <td className="tableData">{data.name}</td>
                  <td className="tableData">${Number(data.price).toFixed(2)}</td>
                  <td
                    className="tableData cursor-poiter link-color"
                    onClick={() => {
                      handleBillInfo(data._id);
                    }}>
                    View
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
      <BillingInformationModal open={open} setopen={setopen} />
    </Grid>
  );
};

export default BillingHistory;
