import moment from "moment";
import React from "react";
import "./underMaintenance.css";

interface IUndermaintenanceProps {}
const Undermaintenance: React.FunctionComponent<IUndermaintenanceProps> = () => {
  const rediretUrl = (type: any) => {
    if (type === "privacy") {
      window.open(`${process.env.REACT_APP_privacy}`, "_blank");
    } else if (type === "terms") {
      window.open(`${process.env.REACT_APP_tCondition}`, "_blank");
    } else if (type === "about") {
      window.open(`${process.env.REACT_APP_edexaDomain}/about`, "_blank");
    } else if (type === "help") {
      window.open(`${process.env.REACT_APP_edexaDomain}/`, "_blank");
    }
  };
  return (
    <div className="p-20 pb-0">
      <div className="mx-auto under-maintanance-wrapper">
        <div className="position-relative" style={{ top: "10px", left: "10px" }}>
          <img src={"https://bstamp-live.s3.eu-central-1.amazonaws.com/assets/bstamp-images/bstamp-logo.png"} alt="logo" width={120} />
        </div>
        <div className="under-maintenance-content">
          <h3 className="mb-3">WE ARE UNDER</h3>
          <h3 className="mb-3" style={{ opacity: "1" }}>
            MAINTENANCE
          </h3>
          <p className="mb-0">Will be back soon!</p>
        </div>
      </div>
      <div className="footer-wrapper d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: "99%" }}>
          <div className="row">
            <div className="col-sm-6 text-center text-sm-start">
              <p className="c-tx-ninth mb-0">edeXa - bStamp © {moment().year()}</p>
            </div>
            <div className="col-sm-6">
              <ul className="page-link-list justify-content-center justify-content-sm-end">
                <li
                  onClick={(event) => {
                    event?.preventDefault();
                    rediretUrl("privacy");
                  }}>
                  <a href="#">Privacy</a>
                </li>
                <li
                  onClick={(event) => {
                    event?.preventDefault();
                    rediretUrl("terms");
                  }}>
                  <a href="#">Terms</a>
                </li>
                <li
                  onClick={(event) => {
                    event?.preventDefault();
                    rediretUrl("about");
                  }}>
                  <a href="#">About</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Undermaintenance;
