import CloseIcon from "@material-ui/icons/CloseOutlined";
import moment from "moment";
import { FC } from "react";
import { useSelector } from "react-redux";
import { Col, Container, Modal, Row } from "reactstrap";
import { handleLabelKEY } from "../../../common/commonFunctions";
import { IRootReducer } from "../../../store/root-reducer";

interface IBillingInformationModal {
  open: boolean;
  setopen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BillingInformationModal: FC<IBillingInformationModal> = ({ open, setopen }) => {
  const billInfo = useSelector((state: IRootReducer) => state.billInfo);
  const selected_Language = useSelector((state: IRootReducer) => state.labelsReducer.lang_);
  const adminlabelsFromReducer = useSelector((state: IRootReducer) => state.labelsReducer.labels);
  const handleClose = () => setopen(false);

  return (
    // @ts-ignore
    <Modal size="lg" centered className="myPlann-modal" isOpen={open} toggle={handleClose} style={{ width: "50%" }}>
      {/* @ts-ignore */}
      <Container>
        <div className="close-icon">
          <CloseIcon onClick={handleClose} className="cursor-pointer" />
        </div>
        {/* @ts-ignore */}
        <Row className="px-3 pb-4">
          {/* @ts-ignore */}
          <Col md={6}>
            <p className="modal-font-20 mb-3">
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.billing_information : adminlabelsFromReducer?.DE?.billing_information, "Billing information")}
            </p>
            <div className="modal-border">
              {/* @ts-ignore */}
              <Row className="modal-box">
                {/* @ts-ignore */}
                <Col xs={12}>
                  <div className="padding-20">
                    <div className="flex-apply pb-2">
                      <div>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.company_name : adminlabelsFromReducer?.DE?.company_name, "COMPANY NAME")}</div>
                      <div className="modal-drak-color font-we-700">{billInfo.companyName}</div>
                    </div>
                    <div className="flex-apply">
                      <div>EMAIL ADDRESS</div>
                      <div className="modal-drak-color font-we-700">{billInfo.email}</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          {/* @ts-ignore */}
          <Col md={6}>
            <p className="max-padding modal-font-20 mb-3">
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.billing_details : adminlabelsFromReducer?.DE?.billing_details, "Billing details")}
            </p>
            <div className="modal-border">
              {/* @ts-ignore */}
              <Row className="modal-box">
                {/* @ts-ignore */}
                <Col xs={12}>
                  <div className="padding-20">
                    <div className="flex-apply pb-2">
                      <div className="text-capitalize">
                        {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.date : adminlabelsFromReducer?.DE?.date, "DATE").toUpperCase()}
                      </div>
                      <div className="modal-drak-color font-we-700">{moment(billInfo.userPlan.purchaseDate).format("DD MMM, YYYY")}</div>
                    </div>
                    <div className="flex-apply pb-2">
                      <div>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.plan_name : adminlabelsFromReducer?.DE?.plan_name, "PLAN NAME").toUpperCase()}</div>
                      <div className="modal-drak-color font-we-700">{billInfo.userPlan.name}</div>
                    </div>
                    <div className="flex-apply pb-2">
                      <div>
                        {handleLabelKEY(
                          selected_Language === "English" ? adminlabelsFromReducer?.EN?.number_of_bstamps : adminlabelsFromReducer?.DE?.number_of_bstamps,
                          "NUMBER OF bStamps"
                        ).toUpperCase()}
                      </div>
                      <div className="modal-drak-color font-we-700">{billInfo.userPlan.totalStamps}</div>
                    </div>
                    <div className="flex-apply">
                      <div className="text-capitalize">TOTAL</div>
                      <div className="modal-drak-color font-we-700 ">$ {Number(billInfo.userPlan.price + billInfo.userPlan.discount).toFixed(2)}</div>
                    </div>
                  </div>
                </Col>
                <hr className="m-0"></hr>
                {/* @ts-ignore */}
                <Col xs={12}>
                  <div className="padding-20">
                    {billInfo.userPlan.discount !== 0 && (
                      <div className="flex-apply pb-2">
                        <div className="discount-color ">
                          {handleLabelKEY(
                            selected_Language === "English" ? adminlabelsFromReducer?.EN?.discount_applied : adminlabelsFromReducer?.DE?.discount_applied,
                            "DISCOUNT APPLIED"
                          ).toUpperCase()}{" "}
                          (&#x3e; {billInfo.userPlan.minDiscount} bStamps)
                          <div className="modal-font-11">
                            {handleLabelKEY(
                              selected_Language === "English" ? adminlabelsFromReducer?.EN?.discount_applied : adminlabelsFromReducer?.DE?.discount_applied,
                              "Discount apply on bulk orders of"
                            )}{" "}
                            {billInfo.userPlan.minDiscount}{" "}
                            {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.bstamps_or_more : adminlabelsFromReducer?.DE?.bstamps_or_more, "bStamps or more.")}
                          </div>
                        </div>
                        <div className="discount-color modal-font-16 font-we-700">- $ {Number(billInfo.userPlan.discount).toFixed(2)}</div>
                      </div>
                    )}
                    <div className="flex-apply">
                      <div>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.amount_paid : adminlabelsFromReducer?.DE?.amount_paid, "AMOUNT PAID")}</div>
                      <div className="discount-color modal-font-20 font-we-700">$ {Number(billInfo.userPlan.price).toFixed(2)}</div>
                    </div>
                  </div>
                </Col>
                <hr className="m-0"></hr>
                {/* @ts-ignore */}
                <Col xs={12}>
                  <div className="padding-20">
                    <div className="flex-apply">
                      <div>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.payment_method : adminlabelsFromReducer?.DE?.payment_method, "PAYMENT METHOD")}</div>
                      <div className="modal-drak-color font-we-700">{String(billInfo.userPlan.purchasePlanType).toUpperCase()}</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
};

export default BillingInformationModal;
