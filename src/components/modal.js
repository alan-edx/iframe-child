import CloseIcon from "@material-ui/icons/CloseOutlined";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Col, Modal, Row } from "reactstrap";
import { getDecryptedLocalStorage, handleLabelKEY } from "../common/commonFunctions";
import { localStorageKeys } from "../common/constants";
import { getImageUrl } from "../common/handleAmazonS3Image";
import "./myPlann.css";
const Success = getImageUrl("success.svg");
const Cancel = getImageUrl("cancel.svg");

const ModalPlan = ({ display, type, handleModalClose }) => {
  const history = useHistory();

  const selected_Language = useSelector((state) => state.labelsReducer.lang_);
  const adminlabelsFromReducer = useSelector((state) => state.labelsReducer.labels);

  const [data, setData] = useState({}); 

  useEffect(() => {
    let transactionSuccessData = getDecryptedLocalStorage(localStorageKeys.transactionSuccess);
    if (transactionSuccessData) {
      if (type === "success") {
        setData(transactionSuccessData);
      }
    } else {
      history.push("/account");
    }
    //eslint-disable-next-line
  }, []);

  return (
    <Modal centered size="md" className="my-modal-width" isOpen={display} toggle={handleModalClose}>
      <div className="close-icon ">
        <CloseIcon onClick={handleModalClose} className="cursor-pointer" />
      </div>
      {type === "cancel" && (
        <>
          <div className="cancel-modal">
            <img src={Cancel} alt="svg" width="60px" height="60px" />
            <h3 className="cancel-modla-heading font-we-700">
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.transaction_failed : adminlabelsFromReducer?.DE?.transaction_failed, "Transaction failed")}
            </h3>
            <p className="text-center cancel-modla-paragraph">
              {handleLabelKEY(
                selected_Language === "English"
                  ? adminlabelsFromReducer?.EN?.we_arent_able_t_process_your_payment_at_this_time_please_go_back_and_try_again_or_please_approach_the_merchant
                  : adminlabelsFromReducer?.  DE?.we_arent_able_t_process_your_payment_at_this_time_please_go_back_and_try_again_or_please_approach_the_merchant,
                "We aren't able to process your payment at this time. Please go back and try again or please approach the merchant."
              )}
            </p>
          </div>
        </>
      )}
      {type === "success" && (
        <>
          <div className="cancel-modal">
            <img src={Success} alt="svg" width="60px" height="60px" />
            <h3 className="cancel-modla-heading font-we-700">
              {handleLabelKEY(
                selected_Language === "English" ? adminlabelsFromReducer?.EN?.thank_you_transaction_successful : adminlabelsFromReducer?.DE?.thank_you_transaction_successful,
                "Thank you, Transaction Successful"
              )}
            </h3>
            <p className="text-center pb-4 cancel-modla-paragraph">
              {handleLabelKEY(
                selected_Language === "English"
                  ? adminlabelsFromReducer?.EN?.successfully_your_selected_plan_has_been_purchased_purchased_plan_mail_has_been_sent_to_your_registered_mail_id
                  : adminlabelsFromReducer?.DE?.successfully_your_selected_plan_has_been_purchased_purchased_plan_mail_has_been_sent_to_your_registered_mail_id,
                "Successfully your selected plan has been purchased. Purchased plan mail has been sent to your registered mail ID."
              )}
            </p>
            <div className="modal-border w-100 mb-4">
              <Row className="modal-box">
                <Col xs={12}>
                  <div className="padding-20">
                    <div className="flex-apply pb-3">
                      <div>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.date : adminlabelsFromReducer?.DE?.date, "DATE")}</div>
                      <div className="modal-drak-color font-we-700">{moment(data.date).format("DD MMM, YYYY")}</div>
                    </div>
                    <div className="flex-apply pb-3">
                      <div>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.plan_name : adminlabelsFromReducer?.DE?.plan_name, "Plan name")}</div>
                      <div className="modal-drak-color font-we-700">{data.planName}</div>
                    </div>
                    <div className="flex-apply pb-3">
                      <div>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.number_of_bstamps : adminlabelsFromReducer?.DE?.number_of_bstamps, "NUMBER OF bStamps")}</div>
                      <div className="modal-drak-color font-we-700">{data.bStamps}</div>
                    </div>
                    <div className="flex-apply">
                      <div>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.total : adminlabelsFromReducer?.DE?.total, "Total")}</div>
                      <div className="modal-drak-color font-we-700">$ {Number(data.price).toFixed(2)}</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ModalPlan;
