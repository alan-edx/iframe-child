import React from "react";
import { Card, CardBody, Collapse } from "reactstrap";
import { getImageUrl } from "../../common/handleAmazonS3Image";
const ChevronDown = getImageUrl("bstamp-images/chevron-down.svg");
const ChevronUp = getImageUrl("bstamp-images/chevron-up.svg");

const CollapseComponent = ({ isToggle, setIsToggele, step, paragraph, title }) => {
  const toggle = (number) => {
    if (number.includes("1")) {
      setIsToggele({
        step1: !isToggle.step1,
        step2: false,
        step3: false,
        step4: false,
        step5: false,
        step6: false
      });
    } else if (number.includes("2")) {
      setIsToggele({
        step1: false,
        step2: !isToggle.step2,
        step3: false,
        step4: false,
        step5: false,
        step6: false
      });
    } else if (number.includes("3")) {
      setIsToggele({
        step1: false,
        step2: false,
        step3: !isToggle.step3,
        step4: false,
        step5: false,
        step6: false
      });
    } else if (number.includes("4")) {
      setIsToggele({
        step1: false,
        step2: false,
        step3: false,
        step4: !isToggle.step4,
        step5: false,
        step6: false
      });
    } else if (number.includes("5")) {
      setIsToggele({
        step1: false,
        step2: false,
        step3: false,
        step4: false,
        step5: !isToggle.step5,
        step6: false
      });
    } else if (number.includes("6")) {
      setIsToggele({
        step1: false,
        step2: false,
        step3: false,
        step4: false,
        step5: false,
        step6: !isToggle.step6
      });
    }
  };
  return (
    <div className="faq-item">
      <div className={`collapsehead d-flex flex-wrap align-items-center justify-content-between ${isToggle[step] ? "open" : "close"}`} onClick={() => toggle(step)}>
        <div className="tittle">
          <p>
            <strong>{title}</strong>
          </p>
        </div>
        <div className="toggle-icon">{isToggle[step] ? <img src={ChevronUp} alt="ChevronUp" /> : <img src={ChevronDown} alt="ChevronDown" />}</div>
      </div>
      <Collapse isOpen={isToggle[step]}>
        <Card className="border-0 bg-transparent">
          <CardBody>
            <p>{paragraph}</p>
          </CardBody>
        </Card>
      </Collapse>
    </div>
  );
};

export default CollapseComponent;
