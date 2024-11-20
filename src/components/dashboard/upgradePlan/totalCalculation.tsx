import { Button, Typography, makeStyles } from "@material-ui/core";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onCreatePayment } from "../../../actions/stamp";
import { handleLabelKEY, setEncryptedLocalStorage, toastSuccess } from "../../../common/commonFunctions";
import { localStorageKeys } from "../../../common/constants";
import { setLoading } from "../../../store/loader/action";
import { IRootReducer } from "../../../store/root-reducer";

const useStyles = makeStyles({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    paddingBottom: 60,
    marginTop: 50
  },
  stampTitle: {
    fontFamily: "LatoMedium",
    fontSize: 22,
    color: "#0D0F12",
    marginBottom: 20
  },
  stampBox: {
    background: " #fff",
    border: "1px solid #dadce0",
    borderRadius: 5,
    width: "100%",
    overflow: "hidden",
    height: 210
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
    padding: 10,
    height: 120
  },
  stampPrice: {
    fontSize: 20,
    fontFamily: "LatoMedium",
    color: "#4C4F53",
    marginBottom: 10
  },

  file: {
    fontSize: 12,
    fontFamily: "Lato",
    color: "#8f8f8f"
  },
  valueBox: {
    border: "1px solid #DADCE0",
    borderRadius: 2,
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  valueBtn: {
    backgroundColor: "#F8F8F8",
    color: "#868686",
    fontFamily: "LatoMedium",
    fontSize: 18,
    borderRadius: 2,
    padding: 0,
    height: 40,
    minWidth: 0,
    width: 50,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#F8F8F8",
      boxShadow: "none"
    }
  },
  value: {
    fontSize: 16,
    fontFamily: "LatoMedium",
    color: "#4C4F53"
  },
  paymentBox: {
    maxWidth: 400,
    marginTop: 40
  },
  payment: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15
  },
  paymentLabel: {
    fontSize: 14
  },
  paymentLabelTwo: {
    fontSize: 11
  },
  paymentValue: {
    fontSize: 20,
    fontFamily: "LatoMedium",
    color: "#4C4F53",
    textAlign: "right"
  },
  paymentBtn: {
    fontSize: 16,
    fontFamily: "LatoMedium",
    padding: "15px 40px",
    color: "#fff !important",

    marginBottom: "10px"
  }
});

interface ITotalCalculation {
  totalPrice: number;
  amountDue: number;
  discount: any;
  totalStamp: any;
  planList: any;
  planId: any;
}

const TotalCalculation: FC<ITotalCalculation> = ({ amountDue, discount, totalPrice, totalStamp, planList, planId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selected_Language = useSelector((state: IRootReducer) => state.labelsReducer.lang_);
  const adminlabelsFromReducer = useSelector((state: IRootReducer) => state.labelsReducer.labels);

  const handleDiscount = (data: number) => {
    return (totalPrice * data) / 100;
  };

  // user purche plan that to call this function
  const handleTransaction = (disabled: boolean) => {
    if (disabled) {
      if (amountDue > 0) {
        dispatch(setLoading(true));
        let data: any = {
          planId,
          price: amountDue,
          bStamps: totalStamp,
          purchaseFrom: "web"
        };
        if (discount.discount > 0) {
          data.couponId = discount._id;
        }
        onCreatePayment(data)
          .then((res: any) => {
            if (res.status === 200) {
              let planName = planList.find((item: any) => item._id === data.planId);
              data.date = new Date();
              data.planName = planName.name;
              setEncryptedLocalStorage(localStorageKeys.transactionSuccess, data);
              let win: any = window.open(res.data, "_self");
              win.focus();
              dispatch(setLoading(false));
            }
          })
          .catch((error) => {
            dispatch(setLoading(false));
          });
      }
    } else {
      toastSuccess("Coming Soon...");
    }
  };

  const edxToken = () => {
    toastSuccess("Coming Soon...");
  };

  return (
    <div className={classes.paymentBox}>
      <div className={classes.stampTitle}>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.total : adminlabelsFromReducer?.DE?.total, "Total")}</div>
      <div className={classes.payment}>
        <Typography component={"span"} color="secondary" className={classes.paymentLabel}>
          {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.number_of_bstamps : adminlabelsFromReducer?.DE?.number_of_bstamps, "NUMBER OF bStamps")}
        </Typography>
        <div className={`${classes.paymentValue} font-we-700`}>{totalStamp}</div>
      </div>
      <div className={classes.payment}>
        <Typography component={"span"} color="secondary" className={classes.paymentLabel}>
          {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.total : adminlabelsFromReducer?.DE?.total, "Total")}
        </Typography>
        <div className="modal-drak-color font-we-700 ">$ {totalPrice.toFixed(2)}</div>
      </div>
      {discount.discount > 0 ? (
        <div className="flex-apply pb-3">
          <div className="discount-color ">
            {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.discount_applied : adminlabelsFromReducer?.DE?.discount_applied, "DISCOUNT APPLIED")}
            (&#x3e; {discount.minDiscount} bStamps)
            <div className="modal-font-11">
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.discount_applied : adminlabelsFromReducer?.DE?.discount_applied, "Discount apply on bulk orders of")}
              {discount.minDiscount} {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.bstamps_or_more : adminlabelsFromReducer?.DE?.bstamps_or_more, "bStamps or more.")}
            </div>
          </div>
          <div className="discount-color modal-font-16 font-we-700">- $ {Number(handleDiscount(discount.discount)).toFixed(2)}</div>
        </div>
      ) : null}
      <hr style={{ width: "100%", background: "#dadce0", height: "3px" }} />
      <div className={classes.payment} style={{ alignItems: "center" }}>
        <Typography component={"span"} color="secondary" className={classes.paymentLabel}>
          {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.amount_due : adminlabelsFromReducer?.DE?.amount_due, "AMOUNT DUE")}
        </Typography>
        <Typography style={{ fontSize: 30, color: "#073D83" }} className={classes.paymentValue}>
          $ {amountDue.toFixed(2)}
        </Typography>
      </div>
      <Button variant="contained" color="primary" className={classes.paymentBtn} onClick={() => handleTransaction(true)} style={{ width: "100%" }} disabled={amountDue > 0 ? false : true}>
        {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.pay_with_paypal : adminlabelsFromReducer?.DE?.pay_with_paypal, "PAY WITH PAYPAL")}
      </Button>
      <Button variant="contained" color="primary" className={classes.paymentBtn} onClick={edxToken} style={{ width: "100%" }}>
        {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.pay_with_edx_token : adminlabelsFromReducer?.DE?.pay_with_edx_token, "PAY WITH EDX TOKEN")}
      </Button>
    </div>
  );
};

export default TotalCalculation;
