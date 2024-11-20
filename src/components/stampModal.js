/* eslint-disable no-unused-vars */
import CloseIcon from "@material-ui/icons/CloseOutlined";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useSelector } from "react-redux";
import XMLViewer from "react-xml-viewer";
import { Modal } from "reactstrap";
import { handleLabelKEY } from "../common/commonFunctions";
import "./stampWatermark.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const StampModal = ({ display, fileData, XMLValue, handleModalClose, getAlignPostion, alignVAL, isPdf }) => {
  const selected_Language = useSelector((state) => state.labelsReducer.lang_);
  const adminlabelsFromReducer = useSelector((state) => state.labelsReducer.labels);

  const [pageNumber, setPageNumber] = useState(1);
  const [pdfWidth, setpdfWidth] = useState();
  const [align, setAlign] = useState(alignVAL);
  const [savePosition, setSavePosition] = useState(true);
  const [pdfHeight, setpdfHeight] = useState();
  const [isPdfView, setisPdfView] = useState(isPdf);
  const [renderCount, setRenderCount] = useState(0);
  const [XMLData, setXMLData] = useState(XMLValue);

  let fileVal = URL.createObjectURL(fileData);

  const getPdfHeightWidth = (pagenumber) => {
    return new Promise(async (resolve, reject) => {
      try {
        const existingPdfBytes = await fetch(fileVal).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        let pageList = pages[pagenumber];
        resolve(pageList.getSize());
      } catch (e) {
        reject(false);
      }
    });
  };

  const onLoadSuccessView = () => {
    getPdfHeightWidth(0).then((value) => {
      setpdfWidth(value.width);
      setpdfHeight(value.height);
      if (renderCount === 0) {
        alignPosition(alignVAL, true);
      } else {
        alignPosition(align, true);
      }
      setRenderCount(1);
    });
  };

  const alignPosition = (type, checked) => {
    if (document.getElementById("rectangle-pos")) {
      document.getElementById("rectangle-pos").remove();
    }
    const element = document.createElement("div");
    element.className = "rectangle";
    element.id = "rectangle-pos";
    element.style.position = "absolute";
    element.style.border = "2px solid #0084FF";
    element.style.borderRadius = "3px";
    element.style.padding = "14px 0px";
    element.style["text-align"] = "center";
    element.style["font-weight"] = "500";
    element.style["font-size"] = "12px";
    element.style["text-transform"] = "capitalize";
    element.style["z-index"] = "1";
    var offsetHeight = document.getElementsByClassName("react-pdf__Page")[0].offsetHeight;
    var offsetWidth = document.getElementsByClassName("react-pdf__Page")[0].offsetWidth;
    if (type === "top") {
      if (checked) {
        setAlign("top");
        element.style.left = 5 + "px";
        element.style.top = 0 + "px";
        element.style.width = "98%";
        element.style.height = 50 + "px";
      } else {
        setAlign("bottom");
        element.style.top = pdfHeight - 50 + "px";
        element.style.left = 5 + "px";
        element.style.width = "98%";
        element.style.height = 50 + "px";
      }
    } else {
      if (checked) {
        setAlign("bottom");
        element.style.top = pdfHeight - 50 + "px";
        element.style.left = 5 + "px";
        element.style.width = "98%";
        element.style.height = 50 + "px";
      } else {
        element.style.left = 5 + "px";
        element.style.top = 0 + "px";
        element.style.width = "98%";
        element.style.height = 50 + "px";
        setAlign("top");
      }
    }
    document.getElementsByClassName("to-draw-rectangle")[0].append(element);
  };

  return (
    <Modal centered isOpen={display} style={{ width: "50%" }} toggle={handleModalClose} className="water-mark-modal" backdrop="static">
      <div className="close-icon">
        <CloseIcon onClick={handleModalClose} className="cursor-pointer" />
      </div>
      <div className="d-flex inner-content ">
        {isPdfView ? (
          <>
            <Document
              className="to-draw-rectangle"
              style={{ width: `${pdfWidth}px`, height: `${pdfHeight}px` }}
              file={{
                url: fileVal,
                httpHeaders: { "X-CustomHeader": "40359820958024350238508234" },
                withCredentials: true
              }}
              onLoadSuccess={onLoadSuccessView}>
              <Page pageNumber={pageNumber} />
            </Document>
          </>
        ) : (
          <>
            <XMLViewer collapsible={true} indentSize={15} className="xml-view" xml={XMLData} />
          </>
        )}
      </div>
      {isPdf ? (
        <>
          <div className="p-20 d-flex align-items-center watermark-position">
            <p className="modal-title">
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.watermark_position : adminlabelsFromReducer?.DE?.watermark_position, "Watermark Position")}
            </p>
            <input id="top" className="checkbox-custom" value="top" name="top" type="checkbox" checked={align === "top" ? true : false} onChange={(e) => alignPosition("top", e.target.checked)} />
            <label htmlFor="top" className="checkbox-custom-label">
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.top : adminlabelsFromReducer?.DE?.top, "Top")}
            </label>
            <input
              id="bottom"
              className="checkbox-custom"
              value="bottom"
              name="bottom"
              type="checkbox"
              checked={align === "bottom" ? true : false}
              onChange={(e) => alignPosition("bottom", e.target.checked)}
            />
            <label htmlFor="bottom" className="checkbox-custom-label">
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.bottom : adminlabelsFromReducer?.DE?.bottom, "Bottom")}
            </label>
            <input
              id="savePostition"
              className="checkbox-custom"
              name="savePostition"
              value={savePosition}
              type="checkbox"
              checked={savePosition}
              onChange={(el) => setSavePosition(el.target.checked)}
            />
            <label htmlFor="savePostition" className="checkbox-custom-label">
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.save_option_for_later : adminlabelsFromReducer?.DE?.save_option_for_later, "Save option for later")}
            </label>
            <button className="comman-btn" onClick={() => getAlignPostion(align, savePosition)}>
              {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.continue : adminlabelsFromReducer?.DE?.continue, "Continue")}
            </button>
          </div>
        </>
      ) : (
        <div className="p-20 d-flex align-items-center watermark-position">
          <button className="comman-btn" onClick={handleModalClose}>
            {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.continue : adminlabelsFromReducer?.DE?.continue, "Continue")}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default StampModal;
