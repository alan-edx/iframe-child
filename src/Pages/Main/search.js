import cryptojs from "crypto-js";
import { useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { checkMultiHash } from "../../actions/stamp";
import "../../assets/scss/layout/bstamp.scss";
import { handleLabelKEY, toastError } from "../../common/commonFunctions";
import { maxFileSize, maxFilesToStamp } from "../../common/constants";
import { getImageUrl } from "../../common/handleAmazonS3Image";
import { StampValidation } from "../../components/stampValidation";
import { sendFileHashArray } from "../../store/fileHashArray/action";
const SearchBigicon = getImageUrl("bstamp-images/search-big-icon.svg");
const Closeicon = getImageUrl("bstamp-images/close-icon.svg");

export const Search = ({ setsearchTack }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const stampListRef = useRef(null);

  const selected_Language = useSelector((state) => state.labelsReducer.lang_);
  const adminlabelsFromReducer = useSelector((state) => state.labelsReducer.labels);

  const [hashKey, setHashKey] = useState("");
  const [isFileDragged, setIsFileDragged] = useState(false);
  const [displayStampStatus, setDisplayStampStatus] = useState(false);
  const { fileHash } = useSelector((state) => state.fileHashArray);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [processingQueue, setProcessingQueue] = useState(false);

  const checkHash = (e) => {
    if (hashKey && !processingQueue) {
      if (e === "Enter") {
        history.push("/" + hashKey.trim());
        setsearchTack && setsearchTack(false);
      }
    }
  };

  const handleDrop = async (files) => {
    setIsFileDragged(false);
    if (files.length > maxFilesToStamp.number) {
      return toastError(maxFilesToStamp.message);
    }
    // if previous data present, check for total count
    if (fileHash.length > 0) {
      if (fileHash.length + files.length > maxFilesToStamp.number) {
        return toastError(maxFilesToStamp.message);
      }
    }
    function generateFileHash(file) {
      return new Promise((resolve, reject) => {
        try {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            let base64 = reader.result.split(",")[1];
            let hashVal = cryptojs.SHA256(base64).toString();
            // check if this hash already exists in the lisitng
            if (fileHash.length > 0) {
              if (fileHash.find((el) => el.hash === hashVal)) {
                reject(
                  handleLabelKEY(
                    selected_Language === "English" ? adminlabelsFromReducer?.EN?.your_file_already_exists : adminlabelsFromReducer?.DE?.your_file_already_exists,
                    "Your file already exists"
                  )
                );
              } else {
                resolve(hashVal);
              }
            } else {
              resolve(hashVal);
            }
          };
          reader.onerror = function () {
            reject(handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.somethingwentwrong : adminlabelsFromReducer?.DE?.somethingwentwrong, "Something went wrong!"));
          };
        } catch (e) {
          reject(handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.somethingwentwrong : adminlabelsFromReducer?.DE?.somethingwentwrong, "Something went wrong!"));
        }
      });
    }

    let fileHashArray = [];
    let isFileInvalid = false;

    // check for a invalid file, if yes don't proceed further
    files.every((file) => {
      if (file.size > maxFileSize) {
        toastError(
          handleLabelKEY(
            selected_Language === "English" ? adminlabelsFromReducer?.EN?.maximum_allowed_file_size_is_100_mb : adminlabelsFromReducer?.DE?.maximum_allowed_file_size_is_100_mb,
            "Maximum allowed file size is 100 MB"
          )
        );
        isFileInvalid = true;
        return false;
      } else {
        return true;
      }
    });

    if (isFileInvalid === false) {
      setFileProcessing(true);
      fileHashArray = files.map(async (file) => {
        return {
          file,
          hash: await generateFileHash(file)
        };
      });
      let totalFiles = [...fileHash];

      Promise.all(fileHashArray)
        .then((array) => {
          // check if selected files are duplicate by comparing their hash
          const hashDuplicate = hasDuplicateHash(array);
          if (hashDuplicate) {
            setFileProcessing(false);
            return toastError(
              handleLabelKEY(
                selected_Language === "English" ? adminlabelsFromReducer?.EN?.youhaveselectedduplicatefiles : adminlabelsFromReducer?.DE?.youhaveselectedduplicatefiles,
                "Your file already exists"
              )
            );
          }
          checkMultiHash({ hash: array.map((el) => el.hash) }).then((response) => {
            response.data.forEach((element) => {
              totalFiles.push({
                hash: element.hash,
                stamped: element.stamped,
                isEsign: element.isEsign,
                isPrivate: false,
                file: array.find((file) => file.hash === element.hash)?.file
              });
            });
            dispatch(sendFileHashArray(totalFiles));
            setDisplayStampStatus(true);
            setFileProcessing(false);
            //scroll to the end of page
            stampListRef?.current?.scrollIntoView({
              behavior: "smooth",
              block: "end",
              inline: "nearest"
            });
          });
        })
        .catch((e) => {
          toastError(e);
          setFileProcessing(false);
        });
    }
  };

  const hasDuplicateHash = (array) => {
    const hashArray = array.map((element) => element.hash);
    return new Set(hashArray).size !== hashArray.length;
  };

  const onDragOver = () => {
    setIsFileDragged(true);
  };

  const onDragLeave = () => {
    setIsFileDragged(false);
  };

  const handleReset = () => {
    if (!processingQueue) {
      dispatch(sendFileHashArray([]));
      history.goBack();
    }
  };

  return (
    <div className={"search-menu search-open"}>
      <div className="close-icon d-flex flex-wrap align-items-center justify-content-center" onClick={handleReset}>
        <img src={Closeicon} alt="Closeicon" />
      </div>
      <div className="container">
        <div className="serch-box">
          <InputGroup className="d-flex flex-wrap align-items-center">
            <Input
              placeholder={handleLabelKEY(
                selected_Language === "English" ? adminlabelsFromReducer?.EN?.search_and_hit_enter : adminlabelsFromReducer?.DE?.search_and_hit_enter,
                "Search and hit enter"
              )}
              name="searchbar"
              type="text"
              value={hashKey}
              onChange={(e) => setHashKey(e.target.value)}
              onKeyDown={(e) => checkHash(e.key)}
            />
            <InputGroupAddon addonType="append">
              <div className="search-icon d-flex flex-wrap align-items-center justify-content-center">
                <img src={SearchBigicon} alt="SearchBigicon" onClick={() => checkHash("Enter")} />
              </div>
            </InputGroupAddon>
          </InputGroup>
          <div className="div-or">
            <p style={{ margin: "auto" }}>{handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.or : adminlabelsFromReducer?.DE?.or, "OR")}</p>
          </div>
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div
                className={`dropZone ${isFileDragged ? "drop-effect" : ""}`}
                {...getRootProps({
                  onClick: () => {
                    fileHash.length === maxFilesToStamp.number && toastError(maxFilesToStamp.message);
                  }
                })}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}>
                <input {...getInputProps()} disabled={fileHash.length === maxFilesToStamp.number} />
                {/* eslint-disable-next-line  */}
                <p component={"span"} color="secondary" className="dragFile">
                  {fileProcessing ? (
                    <>
                      {handleLabelKEY(selected_Language === "English" ? adminlabelsFromReducer?.EN?.processing : adminlabelsFromReducer?.DE?.processing, "Processing")}
                      ...
                    </>
                  ) : (
                    <>
                      {handleLabelKEY(
                        selected_Language === "English" ? adminlabelsFromReducer?.EN?.drop_your_files_or_click_here : adminlabelsFromReducer?.DE?.drop_your_files_or_click_here,
                        "Drop your files, or click here"
                      )}
                    </>
                  )}
                </p>
              </div>
            )}
          </Dropzone>
        </div>
      </div>
      {displayStampStatus && fileHash?.length > 0 && <StampValidation stampListRef={stampListRef} processingQueue={processingQueue} setProcessingQueue={setProcessingQueue} />}
    </div>
  );
};
