import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleLabelKEY } from "../../common/commonFunctions";
import { IRootReducer } from "../../store/root-reducer";
import TotalCalculation from "./upgradePlan/totalCalculation";

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

interface IMyPlanDetails {
  setAction: (ac: any) => void;
  discountList: any[];
}
const UpgradePlansDetails: FC<IMyPlanDetails> = ({ setAction, discountList }) => {
  const classes = useStyles();
  const selected_Language = useSelector((state: IRootReducer) => state.labelsReducer.lang_);
  const adminlabelsFromReducer = useSelector((state: IRootReducer) => state.labelsReducer.labels);
  const planList = useSelector((state: IRootReducer) => state.planList);

  const [planId, setPlanId] = useState("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalStamp, setTotalStemp] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [amountDue, setAmountdue] = useState(0);
  const [typePlaus, setTypePuls] = useState("");
  const [discount, setdiscount] = useState({
    code: "",
    discount: 0,
    _id: "",
    minDiscount: 0
  });

  useEffect(() => {
    if (planList.length > 0) {
      setTotalStemp(planList[0]?.totalStamps);
      setTotalPrice(planList[0]?.totalStamps * planList[0]?.price);
      setAmountdue(planList[0]?.totalStamps * planList[0]?.price);
      setPlanId(planList[0]?._id);
    }
  }, [planList]);

  // user click box that time init value set in total stamp and price
  const handlePriceClick = (index: number, type: number, id: string) => {
    setPlanId(id);
    if (type === 1) {
      setTotalStemp(0);
      setTotalPrice(0);
      setAmountdue(0);
      setCurrentIndex(index);
      setdiscount({
        code: "",
        discount: 0,
        _id: "",
        minDiscount: 0
      });
    } else {
      let dt = planList.find((data: any) => data.type === type);
      let tprice = dt.totalStamps * dt.price;
      setTotalStemp(dt.totalStamps);
      setTotalPrice(tprice);
      setAmountdue(tprice);
      setCurrentIndex(index);
      setdiscount({
        code: "",
        discount: 0,
        _id: "",
        minDiscount: 0
      });
    }
  };

  let hanldetype = (type: any) => {
    if (type === 2) {
      return "BASIC";
    }
    if (type === 3) {
      return "PRO";
    }
    if (type === 4) {
      return "PLUS";
    }
  };

  // increment of total stamp
  const handleStampIncrement = (data: any) => {
    let { totalStamps, price, maxStamps, minStamps, minDiscount, type, index, id } = data;

    let st = 0;

    let tp = type + 1;
    if (typePlaus !== tp) {
      st = 0;
      setTypePuls(tp);
    } else {
      if (totalStamp < minStamps) {
        st = 0;
      } else {
        st = totalStamp;
      }
    }

    if (st < maxStamps) {
      let tstamp = st + totalStamps;
      let tprice = tstamp * price;
      let dis = 0;
      if (tstamp >= minDiscount) {
        let ty = hanldetype(type);
        let ds: any = discountList.find((data: any) => data.code === ty);
        dis = (tprice * ds.discount) / 100;
        ds.minDiscount = data.minDiscount;
        setdiscount(ds);
      } else {
        setdiscount({
          code: "",
          discount: 0,
          _id: "",
          minDiscount: 0
        });
      }
      setPlanId(id);
      setCurrentIndex(index);
      setTotalStemp(tstamp);
      setTotalPrice(tprice);
      setAmountdue(tprice - dis);
    } else {
      if (planList.length !== index + 1) {
        if (index === currentIndex) {
          // eslint-disable-next-line
          planList.map((data: any) => {
            if (data.type === type + 1) {
              let tstamp = st + totalStamps;
              let tprice = tstamp * data.price;
              let dis = 0;
              if (tstamp >= data.minDiscount) {
                let ty = hanldetype(data.type);
                let ds: any = discountList.find((data: any) => data.code === ty);
                dis = (tprice * ds.discount) / 100;
                ds.minDiscount = data.minDiscount;
                setdiscount(ds);
              } else {
                setdiscount({
                  code: "",
                  discount: 0,
                  _id: "",
                  minDiscount: 0
                });
              }
              setPlanId(data._id);
              setTotalStemp(tstamp);
              setTotalPrice(tprice);
              setAmountdue(tprice - dis);
            }
          });
          setCurrentIndex(currentIndex + 1);
        }
      }
    }
  };

  // decrement of total stamp
  const handleStampDecrement = (data: any) => {
    let { totalStamps, price, minDiscount, minStamps, type, index, id } = data;
    let st = 0;
    let tp = type + 1;
    if (typePlaus !== tp) {
      st = 0;
      setTypePuls(tp);
    } else {
      st = totalStamp;
    }
    if (st > minStamps) {
      let tstamp = st - totalStamps;
      let tprice = tstamp * price;
      let dis = 0;
      if (tstamp >= minDiscount) {
        let ty = hanldetype(type);
        let ds: any = discountList.find((data: any) => data.code === ty);
        dis = (tprice * ds.discount) / 100;
        ds.minDiscount = data.minDiscount;
        setdiscount(ds);
      } else {
        setdiscount({
          code: "",
          discount: 0,
          _id: "",
          minDiscount: 0
        });
      }
      setPlanId(id);
      setTotalStemp(tstamp);
      setTotalPrice(tprice);
      setAmountdue(tprice - dis);
    } else {
      if (typePlaus !== tp) {
        setTypePuls(tp);
        if (type - 1 !== 1) {
          // eslint-disable-next-line
          planList.map((data: any) => {
            if (data.type === type - 1) {
              let tstamp = st + data.totalStamps;
              let tprice = tstamp * data.price;
              let dis = 0;
              if (tstamp >= data.minDiscount) {
                let ty = hanldetype(data.type);
                let ds: any = discountList.find((data: any) => data.code === ty);
                dis = (tprice * ds.discount) / 100;
                ds.minDiscount = data.minDiscount;
                setdiscount(ds);
              } else {
                setdiscount({
                  code: "",
                  discount: 0,
                  _id: "",
                  minDiscount: 0
                });
              }
              setPlanId(data._id);
              setTotalStemp(tstamp);
              setTotalPrice(tprice);
              setAmountdue(tprice - dis);
            }
          });
        } else {
          setPlanId("");
          setdiscount({
            code: "",
            discount: 0,
            _id: "",
            minDiscount: 0
          });
          setTotalStemp(0);
          setTotalPrice(0);
          setAmountdue(0);
        }
        setCurrentIndex(index - 1);
      }
    }
  };

  return (
    <div>
      <div className="header-div">
        <Typography className={classes.stampTitle}>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.plans : adminlabelsFromReducer?.DE?.plans, "Plans")}</Typography>
        <div
          onClick={() =>
            setAction((action: boolean) => {
              return !action;
            })
          }
          className="link-div">
          {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.your_plan : adminlabelsFromReducer?.DE?.your_plan, "Your Plan")}
        </div>
      </div>
      <Grid container spacing={2}>
        {planList.map((data: any, index: any) => (
          <Grid key={index} item xs={12} sm={6} md={3} lg={3}>
            <div
              className={`${classes.stampBox}
                    ${index === currentIndex && classes.stampActive}
                  `}
              onClick={() => {
                handlePriceClick(index, data.type, data._id);
              }}>
              <div color="white" className={classes.stampName}>
                {data.name}
              </div>
              <div className={classes.stampDetail}>
                {data.type.toString() === "1" ? (
                  <Typography className={classes.stampPrice}>{data.totalStamps} bStamps</Typography>
                ) : (
                  <>
                    <div className={`${classes.file} w-100 text-center`} color="secondary">
                      {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.per_file : adminlabelsFromReducer?.DE?.per_file, "PER FILE")}
                    </div>
                    <div className={`${classes.stampPrice} w-100 text-center`}>$ {data.price.toFixed(2)}</div>
                    <div className={`${classes.file} w-100 text-center`} color="secondary">
                      # {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.of : adminlabelsFromReducer?.DE?.of, "OF")} bStamps
                    </div>
                    <div className={classes.valueBox} onClick={(event) => event.stopPropagation()}>
                      <Button
                        variant="contained"
                        className={classes.valueBtn}
                        disabled={index === 0 ? data?.minStamps === totalStamp : false}
                        onClick={(event) => {
                          let dt = {
                            totalStamps: data.totalStamps,
                            price: data.price,
                            maxStamps: data.maxStamps,
                            minDiscount: data.minDiscount,
                            minStamps: data.minStamps,
                            type: data.type,
                            index: index,
                            id: data._id
                          };
                          handleStampDecrement(dt);
                          event.stopPropagation();
                        }}>
                        -
                      </Button>
                      <label className={classes.value}>{index === currentIndex ? totalStamp : data.totalStamps}</label>
                      <Button
                        variant="contained"
                        className={classes.valueBtn}
                        onClick={(event) => {
                          let dt = {
                            totalStamps: data.totalStamps,
                            price: data.price,
                            maxStamps: data.maxStamps,
                            minDiscount: data.minDiscount,
                            minStamps: data.minStamps,
                            type: data.type,
                            index: index,
                            id: data._id
                          };
                          handleStampIncrement(dt);
                          event.stopPropagation();
                        }}>
                        +
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
      <TotalCalculation amountDue={amountDue} discount={discount} planId={planId} planList={planList} totalPrice={totalPrice} totalStamp={totalStamp} />
    </div>
  );
};
export default UpgradePlansDetails;
