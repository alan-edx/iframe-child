import CloseIcon from "@material-ui/icons/CloseOutlined";
import { useSelector } from "react-redux";
import { Modal } from "reactstrap";
import { handleLabelKEY, toastSuccess } from "../../common/commonFunctions";
import { getImageUrl } from "../../common/handleAmazonS3Image";
import { environment } from "../../environments/environment";
const Mac = getImageUrl("mac2.png");
const Ubuntu = getImageUrl("ubuntu2.png");
const Windows2 = getImageUrl("windows2.png");

const DesktopAppModalComponent = ({ open, setOpen }) => {
  const selected_Language = useSelector((state) => state.labelsReducer.lang_);
  const adminlabelsFromReducer = useSelector((state) => state.labelsReducer.labels);

  const handleClose = () => {
    setOpen(false);
  };

  const redirectPlaform = (type) => {
    if (type === "web") {
      document.documentElement.scrollTop = 0;
    } else if (type === "api") {
      window.open(`${environment.appsDomain.portalDomain}/apis`, "_blank");
    } else if (type === "window") {
      window.open(environment.msApplication, "_blank");
    } else if (type === "linux") {
      toastSuccess("Coming Soon...");
    } else if (type === "ext") {
      window.open(environment.chromeExtension, "_blank");
    } else if (type === "mac") {
      toastSuccess("Coming Soon...");
    }
  };

  return (
    <Modal className="desktopapp-model" isOpen={open} onClosed={handleClose} toggle={handleClose} centered style={{ width: "50%" }}>
      <div className="p-3">
        <div className="pb-3" style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: "26px" }}>
            {handleLabelKEY(
              selected_Language === "English" ? adminlabelsFromReducer?.EN?.desktop_applications_available_on : adminlabelsFromReducer?.DE?.desktop_applications_available_on,
              "Desktop Applications Available On"
            )}
          </div>
          <CloseIcon style={{ color: "gray" }} onClick={handleClose} className="cursor-pointer" />
        </div>
        <div className="p-3 row justify-content-md-between">
          <div className="modal-destop pt-3  col-4" onClick={() => redirectPlaform("window")}>
            <img src={Windows2} alt="" className="m-auto" width="40px" height="40px" />
            <p className="text-white m-auto mb-3">
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.download_for_windows : adminlabelsFromReducer?.DE?.download_for_windows, "Download for Windows")}
            </p>
            {/* Download for Windows */}
          </div>
          <div className="modal-destop pt-3  col-4" onClick={() => redirectPlaform("mac")}>
            <img className="m-auto" width="40px" height="40px" src={Mac} alt="" />
            <p className="text-white m-auto mb-3">
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.coming_soon : adminlabelsFromReducer?.DE?.coming_soon, "Coming Soon")}
            </p>
          </div>
          <div className="modal-destop pt-3 col-4" onClick={() => redirectPlaform("linux")}>
            <img className="text-white m-auto" src={Ubuntu} width="40px" height="40px" alt="" />
            <p className="text-white m-auto mb-3">
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.coming_soon : adminlabelsFromReducer?.DE?.coming_soon, "Coming Soon")}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DesktopAppModalComponent;
