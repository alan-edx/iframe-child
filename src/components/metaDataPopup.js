import { FormControl, MenuItem, Select } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";
import theme from "../@config/Theme";
import {
  checkIfStringIsOnlyWhiteSpace,
  handleLabelKEY,
  toastError,
} from "../common/commonFunctions";
import { metaDataKeyValueLimit, waterMarkPosition } from "../common/constants";
import "./stampValidation.css";
import StampValidationSwitch from "./stampValidationSwitch";

export const MetaDataPopupComponent = ({
  metaDataStateForPopup,
  setMetaDataStateForPopup,
  setStampButtonPopupDisabled,
  electricSignature,
}) => {
  const useStyles = makeStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    statusLabel: {
      padding: "3px 10px",
      color: "#fff",
      background: "#28C76F",
      borderRadius: 11,
      textTransform: "uppercase",
      fontSize: 11,
    },
    textUp: {
      textTransform: "uppercase",
    },
    firstStamp: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      width: "100%",
      height: "calc(100vh - 280px)",
    },
    closeicon: {
      float: "right",
      cursor: "pointer",
    },
    tabContent: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      padding: "16px",
    },
    stampTitle: {
      fontFamily: "LatoBold",
      fontSize: 18,
      color: "#0D0F12",
    },
    stampDescription: {
      fontSize: 20,
      fontFamily: "Lato",
      margin: "20px 0 40px",
    },
    addBtn: {
      width: 180,
      height: 55,
      padding: 0,
      borderRadius: 5,
      fontFamily: "Lato",
      fontSize: 16,
    },
    dropZone: {
      background: "#F8F8F8",
      border: "2px dashed #dadce0",
      borderRadius: 10,
      width: "100%",
      textAlign: "center",
      padding: "65px 0",
      cursor: "pointer",
      "&:focus": {
        outline: "none",
      },
    },
    stampText: {
      marginBottom: 50,
      fontSize: "14px",
      marginTop: "10px",
    },
    dragFile: {
      fontSize: 20,
    },
    metadata: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    addLink: {
      fontSize: 16,
      color: "#073D83",
      fontFamily: "LatoBold",
      cursor: "pointer",
      textDecoration: "none",
    },
    stampData: {
      padding: "20px 20px",
      textAlign: "center",
      borderRadius: 10,
      border: "1px solid #dadce0",
    },
    dataList: {
      display: "flex",
      width: "100%",
      marginBottom: 20,
      "&:last-child": {
        marginBottom: 0,
      },
    },
    stampBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: 5,
    },
    actionBtn: {
      padding: "15px 40px",
      fontSize: 16,
      marginLeft: 10,
      fontFamily: "LatoBold",
      "&:hover": {
        backgroundColor: "#073D83",
        color: "#fff",
      },
    },
    labelData: {
      width: "calc(33.3333% - 45px)",
      marginRight: 20,
      "& fieldset": {
        top: 0,
      },
      "& input": {
        padding: "15px",
      },
    },
    labelDescription: {
      width: "calc(66.6666% - 45px)",
      marginRight: 20,
      "& fieldset": {
        top: 0,
      },
      "& input": {
        padding: "15px",
      },
    },
    selectType: {
      width: "25%",
      marginRight: 10,
      color: "#4C4F53",
    },
    deleteBtn: {
      minWidth: 0,
      width: 50,
      padding: 10,
      border: "1px solid #dadce0 !important",
      "&:hover": {
        backgroundColor: "#DADCE0",
        border: "1px solid #dadce0",
        color: "red",
        "& svg": {
          color: "red",
        },
      },
    },
    deleteIcon: {
      width: 16,
    },
    deleteName: {
      display: "none",
    },
    trackVertical: {
      right: 0,
      top: 0,
      height: "100% !important",
      width: "2px !important",
      "& div": {
        backgroundColor: "#073D83 !important",
        width: "2px !important",
      },
    },
    "@media screen and (max-width: 767px)": {
      dropZone: {
        marginBottom: 30,
      },
      stampTitle: {
        fontSize: 20,
      },
      labelData: {
        width: "100%",
        margin: "0 0 10px",
      },
      selectType: {
        width: "100%",
        margin: "0 0 10px",
      },
      labelDescription: {
        width: "100%",
        margin: "0 0 10px",
      },
      dataList: {
        flexWrap: "wrap",
      },
      stampBtn: {
        justifyContent: "center",
      },
      actionBtn: {
        fontSize: 14,
        padding: "10px 30px",
      },
      deleteBtn: {
        width: "100%",
      },
      deleteIcon: {
        marginTop: "-3px",
      },
      deleteName: {
        display: "block",
        marginLeft: 10,
      },
    },
  });
  const classes = useStyles();
  useEffect(() => {
    checkIfFormValid(metaDataStateForPopup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addMetaData = (primaryIndex) => {
    const metaDataArrayClone = [...metaDataStateForPopup];
    const previousIndex = metaDataArrayClone[primaryIndex].data.length - 1;
    const previousElement =
      metaDataArrayClone[primaryIndex].data[previousIndex];
    if (
      previousElement["label"] === "" ||
      checkIfStringIsOnlyWhiteSpace(previousElement["label"])
    ) {
      return toastError("Please Fill Label Field");
    }
    if (
      previousElement["value"] === "" ||
      checkIfStringIsOnlyWhiteSpace(previousElement["value"])
    ) {
      return toastError("Please Fill Description Field");
    }
    metaDataArrayClone[primaryIndex].data.push({
      label: "",
      value: "",
    });
    setMetaDataStateForPopup(metaDataArrayClone);
    checkIfFormValid(metaDataArrayClone);
  };

  const handleInputChange = (value, primaryIndex, secondaryIndex, key) => {
    const metaDataArrayClone = [...metaDataStateForPopup];
    metaDataArrayClone[primaryIndex].data[secondaryIndex][key] = value;
    setMetaDataStateForPopup(metaDataArrayClone);
    checkIfFormValid(metaDataArrayClone);
  };

  const handleMetaDataDelete = (primaryIndex, secondaryIndex) => {
    const metaDataArrayClone = [...metaDataStateForPopup];
    metaDataArrayClone[primaryIndex].data.splice(secondaryIndex, 1);
    setMetaDataStateForPopup(metaDataArrayClone);
    checkIfFormValid(metaDataArrayClone);
  };

  const checkIfFormValid = (formData) => {
    let isValid = true;
    // eslint-disable-next-line
    stop: for (let i = 0; i <= formData.length; i++) {
      for (let j = 0; j < formData[i]?.data?.length; j++) {
        if (
          formData[i]?.data[j]?.label === "" ||
          checkIfStringIsOnlyWhiteSpace(formData[i]?.data[j]?.label) ||
          formData[i]?.data[j]?.value === "" ||
          checkIfStringIsOnlyWhiteSpace(formData[i]?.data[j]?.value)
        ) {
          setStampButtonPopupDisabled(true);
          isValid = false;
          break stop;
        }
      }
    }
    if (isValid) {
      setStampButtonPopupDisabled(false);
    }
  };
  const adminlabelsFromReducer = useSelector(
    (state) => state.labelsReducer.labels
  );
  const selected_Language = useSelector((state) => state.labelsReducer.lang_);
  return (
    <>
      <MuiThemeProvider theme={theme}>
        <Scrollbars
          style={{ width: "100%" }}
          autoHide
          autoHeight
          autoHeightMin={0}
          autoHeightMax={400}
          className="scrollCustom"
          renderTrackVertical={(props) => (
            <div {...props} className={classes.trackVertical} />
          )}
        >
          {metaDataStateForPopup &&
            metaDataStateForPopup?.length > 0 &&
            metaDataStateForPopup?.map((element, primaryIndex) => {
              return (
                <div className={classes.tabContent} key={primaryIndex}>
                  <div className={classes.metadata}>
                    <Typography
                      component={"span"}
                      className={classes.stampTitle}
                    >
                      {element?.data[0].value}
                    </Typography>
                    {element.stamped ? (
                      <p className={classes.statusLabel}>
                        {handleLabelKEY(
                          selected_Language === "English"
                            ? adminlabelsFromReducer?.EN?.stamped
                            : adminlabelsFromReducer?.DE?.stamped,
                          "stamped"
                        )}
                      </p>
                    ) : element.processing ? (
                      <Spinner animation="border" />
                    ) : (
                      (electricSignature
                        ? element.data.length < 8
                        : element.data.length < 7) && (
                        <Link
                          className={classes.addLink}
                          onClick={() => addMetaData(primaryIndex)}
                        >
                          {handleLabelKEY(
                            selected_Language === "English"
                              ? adminlabelsFromReducer?.EN?.add_metadata
                              : adminlabelsFromReducer?.DE?.add_metadata,
                            "Add Metadata"
                          )}
                        </Link>
                      )
                    )}
                  </div>
                  <div className={classes.stampData}>
                    {element?.data?.map((el, secondaryIndex) => {
                      return (
                        <>
                          {(el.label !== "Watermark Position" ||
                            element.file.type !== "text/xml") &&
                            ((el.label !== "hash" && electricSignature) ||
                              !electricSignature) && (
                              <div
                                key={secondaryIndex}
                                className={classes.dataList}
                              >
                                <TextField
                                  placeholder={handleLabelKEY(
                                    selected_Language === "English"
                                      ? adminlabelsFromReducer?.EN?.ex_label
                                      : adminlabelsFromReducer?.DE?.ex_label,
                                    "ex. Label"
                                  )}
                                  name="label"
                                  id="label"
                                  variant="outlined"
                                  color="secondary"
                                  value={el.label}
                                  disabled={
                                    el.label === "filename" ||
                                    el.label === "hash" ||
                                    el.label === "Watermark Position"
                                  }
                                  className={classes.labelData}
                                  inputProps={{
                                    maxLength: metaDataKeyValueLimit.label,
                                  }}
                                  onChange={(e) => {
                                    if (
                                      el.label !== "filename" ||
                                      el.label !== "hash"
                                    ) {
                                      handleInputChange(
                                        e.target.value,
                                        primaryIndex,
                                        secondaryIndex,
                                        "label"
                                      );
                                    }
                                  }}
                                />
                                {el.label === "Watermark Position" ? (
                                  <FormControl
                                    variant="outlined"
                                    className={`${classes.labelDescription}`}
                                  >
                                    <Select
                                      placeholder={handleLabelKEY(
                                        selected_Language === "English"
                                          ? adminlabelsFromReducer?.EN
                                              ?.select_watermark_position
                                          : adminlabelsFromReducer?.DE
                                              ?.select_watermark_position,
                                        "Select Watermark Position"
                                      )}
                                      value={el.value.toLowerCase()}
                                      style={{ height: 50 }}
                                      onChange={(e) =>
                                        handleInputChange(
                                          e.target.value,
                                          primaryIndex,
                                          secondaryIndex,
                                          "value"
                                        )
                                      }
                                    >
                                      {waterMarkPosition.map(
                                        (position, index) => {
                                          return (
                                            <MenuItem
                                              key={index}
                                              value={position.toLowerCase()}
                                            >
                                              {position}
                                            </MenuItem>
                                          );
                                        }
                                      )}
                                    </Select>
                                  </FormControl>
                                ) : (
                                  <TextField
                                    placeholder={handleLabelKEY(
                                      selected_Language === "English"
                                        ? adminlabelsFromReducer?.EN
                                            ?.description
                                        : adminlabelsFromReducer?.DE
                                            ?.description,
                                      "Description"
                                    )}
                                    name="description"
                                    id="description"
                                    variant="outlined"
                                    color="secondary"
                                    disabled={
                                      el.label === "filename" ||
                                      el.label === "hash"
                                    }
                                    inputProps={{
                                      maxLength: metaDataKeyValueLimit.value,
                                    }}
                                    className={`${classes.labelDescription} ${classes.textUp}`}
                                    value={el.value}
                                    onChange={(e) => {
                                      if (
                                        el.label !== "filename" ||
                                        el.label !== "hash"
                                      ) {
                                        handleInputChange(
                                          e.target.value,
                                          primaryIndex,
                                          secondaryIndex,
                                          "value"
                                        );
                                      }
                                    }}
                                  />
                                )}
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  className={classes.deleteBtn}
                                  disabled={
                                    el.label === "filename" ||
                                    el.label === "hash" ||
                                    el.label === "Watermark Position"
                                  }
                                  onClick={() =>
                                    handleMetaDataDelete(
                                      primaryIndex,
                                      secondaryIndex
                                    )
                                  }
                                >
                                  <i
                                    className={"fal fa-trash-alt"}
                                    style={{ fontSize: "18px" }}
                                  ></i>
                                  <span className={classes.deleteName}>
                                    {handleLabelKEY(
                                      selected_Language === "English"
                                        ? adminlabelsFromReducer?.EN?.delete
                                        : adminlabelsFromReducer?.DE?.delete,
                                      "Delete"
                                    )}
                                  </span>
                                </Button>
                              </div>
                            )}
                        </>
                      );
                    })}
                  </div>
                  <StampValidationSwitch
                    index={element.index}
                    status={element.isPrivate}
                    modal={true}
                  />
                  {/* Show Add Metadata caption unless it is clicked for a particular index */}
                  {(electricSignature
                    ? metaDataStateForPopup[primaryIndex].data.length <= 4
                    : metaDataStateForPopup[primaryIndex].data.length <= 3) && (
                    <Typography
                      component={"span"}
                      color="secondary"
                      style={{ fontSize: 14, marginTop: 10, marginBottom: 10 }}
                    >
                      {handleLabelKEY(
                        selected_Language === "English"
                          ? adminlabelsFromReducer?.EN
                              ?.you_can_add_more_information_by_clicking_on
                          : adminlabelsFromReducer?.DE
                              ?.you_can_add_more_information_by_clicking_on,
                        "You can add more information by clicking on"
                      )}{" "}
                      <b>
                        {" "}
                        {handleLabelKEY(
                          selected_Language === "English"
                            ? adminlabelsFromReducer?.EN?.add_metadata
                            : adminlabelsFromReducer?.DE?.add_metadata,
                          "Add Metadata"
                        )}
                      </b>
                    </Typography>
                  )}
                </div>
              );
            })}
        </Scrollbars>
      </MuiThemeProvider>
    </>
  );
};
