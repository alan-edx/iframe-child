/* eslint-disable no-unused-vars */
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { onPlanList, onUserPlanList } from "../actions/stamp";
import { removeLocalStorageKey } from "../common/commonFunctions";
import { localStorageKeys } from "../common/constants";
import { setLoading } from "../store/loader/action";
import { onPlanListInsert } from "../store/planList/action";
import { onTabIndex } from "../store/tabState/action";
import { onUserPlanListInsert } from "../store/userPlan/action";
import MyPlanDetails from "./dashboard/myPlanDetails";
import UpgradePlansDetails from "./dashboard/upgradePlansDetails";
import ModalPlan from "./modal";
import "./myPlann.css";

const useStyles = makeStyles({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    paddingBottom: 60,
    marginTop: 50
  }
});

const MyPlan = (props) => {
  const classes = useStyles();
  const [planId, setPlanId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalStamp, setTotalStemp] = useState(0);
  const [discount, setdiscount] = useState({
    code: "",
    discount: 0,
    _id: ""
  });
  const [amountDue, setAmountdue] = useState(0);
  const dispatch = useDispatch();
  const [discountList, setDiscountList] = useState([]);
  const [modal, setModal] = useState({
    status: false,
    type: ""
  });

  const [dis, setDis] = useState(props.display);
  const history = useHistory();

  useEffect(() => {
    dispatch(setLoading(true));
    if (!dis) {
      onPlanList().then((res) => {
        dispatch(setLoading(false));
        if (res.status === 200) {
          setDiscountList(res.coupons);
          dispatch(onPlanListInsert(res.data));
        }
      });
    } else {
      onUserPlanList().then((res) => {
        dispatch(setLoading(false));
        dispatch(onUserPlanListInsert(res.data));
      });
    }
    //eslint-disable-next-line
  }, [dis]);
  useEffect(() => {
    if (props.link === "/pay/cancel") {
      setModal({
        status: true,
        type: "cancel"
      });
    }
    if (props.link === "/pay/success") {
      setModal({
        status: true,
        type: "success"
      });
    }
  }, [props]);

  const handleModalClose = () => {
    removeLocalStorageKey(localStorageKeys.transactionSuccess);
    handleResetPlan();
    history.push("/account");
    setModal({
      status: false,
      type: ""
    });
    let data = {
      status: true,
      index: 3
    };
    dispatch(onTabIndex(data));
  };
  // success or reject modal call this metho
  const handleResetPlan = () => {
    setPlanId("");
    setCurrentIndex(0);
    setTotalPrice(0);
    setTotalStemp(0);
    setdiscount(0);
    setAmountdue(0);
  };
  return (
    <>
      {dis ? (
        <div className={classes.tabContent}>
          <MyPlanDetails setAction={setDis} />
        </div>
      ) : (
        <div className={classes.tabContent}>
          <UpgradePlansDetails setAction={setDis} discountList={discountList} />
        </div>
      )}
      {modal.status && <ModalPlan display={modal.status} type={modal.type} handleModalClose={handleModalClose} />}
    </>
  );
};

export default MyPlan;
