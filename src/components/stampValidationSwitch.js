import { makeStyles, Tooltip, Typography } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleLabelKEY } from "../common/commonFunctions";
import { sendFileHashArray } from "../store/fileHashArray/action";
const useStyles = makeStyles({
  stampTitle: {
    fontFamily: "LatoBold",
    fontSize: 18,
    color: "#0D0F12"
  }
});
const StampValidationSwitch = ({ status, index, modal }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isBlockchainPrivate, setIsBlockchainPrivate] = useState(status ? status : true);
  const fileHash = useSelector((state) => state?.fileHashArray?.fileHash);
  const handleAction = (e) => {
    if (Array.isArray(fileHash)) {
      const newFileHashArray = fileHash.map((data, i) => {
        if (i === index) {
          return { ...data, isPrivate: e };
        }
        return data;
      });
      dispatch(sendFileHashArray(newFileHashArray));
    }
  };

  useEffect(() => {
    setIsBlockchainPrivate(fileHash[index]?.isPrivate);
    // eslint-disable-next-line
  }, [fileHash[index]?.isPrivate]);

  const adminlabelsFromReducer = useSelector((state) => state.labelsReducer.labels);
  const selected_Language = useSelector((state) => state.labelsReducer.lang_);
  return (
    <>
      {modal && (
        <>
          <Typography className={classes.stampTitle} style={{ marginTop: 10 }}>
            Blockchain Settings
          </Typography>
          <p style={{ color: "#868686" }}>
            {" "}
            <strong>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.note : adminlabelsFromReducer?.DE?.note, "Note:")}</strong>{" "}
            {isBlockchainPrivate ? "Your file will be stamped in private Blockchain" : "Your file will be stamped in public Blockchain"}
          </p>
        </>
      )}
      <Tooltip title={modal ? "" : isBlockchainPrivate ? "Your file will be stamped in private Blockchain" : "Your file will be stamped in public Blockchain"}>
        {/* <Switch
          checked={isBlockchainPrivate}
          color="primary"
          size="small"
          inputProps={{ "aria-label": "controlled" }}
          onChange={(e) => {
            handleAction(e.target.checked);
            setIsBlockchainPrivate(e.target.checked);
          }}
        /> */}

        {/* Do Not Remove the below commented out code.. as this commented only for now */}

        <Switch
          checked={isBlockchainPrivate}
          color="primary"
          size="small"
          inputProps={{ "aria-label": "controlled" }}
          onChange={(e) => {
            handleAction(e.target.checked);
            setIsBlockchainPrivate(e.target.checked);
          }}
        />
      </Tooltip>
    </>
  );
};

export default StampValidationSwitch;
