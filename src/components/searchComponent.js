import React, { useRef, useState } from "react";
import cryptojs from "crypto-js";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { checkMultiHash } from "../actions/stamp";
import { handleLabelKEY, toastError } from "../common/commonFunctions";
import { maxFileSize, maxFilesToStamp } from "../common/constants";
import { getImageUrl } from "../common/handleAmazonS3Image";
import { sendFileHashArray } from "../store/fileHashArray/action";
import "../assets/scss/layout/bstamp.scss";

const SearchBigicon = getImageUrl("bstamp-images/search-big-icon.svg");
const Closeicon = getImageUrl("bstamp-images/close-icon.svg");

export const SearchComponent = ({ onClose }) => {
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
        console.log("Perform search for hash:", hashKey.trim());
        setHashKey("");
      }
    }
  };

  const handleDrop = async (files) => {
    setIsFileDragged(false);
    if (files.length > maxFilesToStamp.number) {
      return toastError(maxFilesToStamp.message);
    }
    if (fileHash.length > 0 && fileHash.length + files.length > maxFilesToStamp.number) {
      return toastError(maxFilesToStamp.message);
    }

    function generateFileHash(file) {
      return new Promise((resolve, reject) => {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const base64 = reader.result.split(",")[1];
            const hashVal = cryptojs.SHA256(base64).toString();
            if (fileHash.find((el) => el.hash === hashVal)) {
              reject(
                handleLabelKEY(
                  selected_Language === "English"
                    ? adminlabelsFromReducer?.EN?.your_file_already_exists
                    : adminlabelsFromReducer?.DE?.your_file_already_exists,
                  "Your file already exists"
                )
              );
            } else {
              resolve(hashVal);
            }
          };
          reader.onerror = () => reject("Error reading file.");
        } catch (e) {
          reject("Error generating hash.");
        }
      });
    }

    const isFileInvalid = files.some((file) => {
      if (file.size > maxFileSize) {
        toastError(
          handleLabelKEY(
            selected_Language === "English"
              ? adminlabelsFromReducer?.EN?.maximum_allowed_file_size_is_100_mb
              : adminlabelsFromReducer?.DE?.maximum_allowed_file_size_is_100_mb,
            "Maximum allowed file size is 100 MB"
          )
        );
        return true;
      }
      return false;
    });

    if (!isFileInvalid) {
      setFileProcessing(true);
      const fileHashArray = await Promise.all(
        files.map((file) =>
          generateFileHash(file).then((hash) => ({ file, hash }))
        )
      );
      const hashDuplicate = new Set(fileHashArray.map((el) => el.hash)).size !== fileHashArray.length;

      if (hashDuplicate) {
        setFileProcessing(false);
        return toastError(
          handleLabelKEY(
            selected_Language === "English"
              ? adminlabelsFromReducer?.EN?.youhaveselectedduplicatefiles
              : adminlabelsFromReducer?.DE?.youhaveselectedduplicatefiles,
            "Duplicate files selected."
          )
        );
      }

      checkMultiHash({ hash: fileHashArray.map((el) => el.hash) })
        .then((response) => {
          const totalFiles = [
            ...fileHash,
            ...response.data.map((element) => ({
              hash: element.hash,
              stamped: element.stamped,
              isEsign: element.isEsign,
              isPrivate: false,
              file: fileHashArray.find((file) => file.hash === element.hash)?.file,
            })),
          ];
          dispatch(sendFileHashArray(totalFiles));
          setDisplayStampStatus(true);
          setFileProcessing(false);
          stampListRef?.current?.scrollIntoView({ behavior: "smooth" });
        })
        .catch((error) => {
          toastError(error);
          setFileProcessing(false);
        });
    }
  };

  return (
    <div className="search-menu search-open">
      <div
        className="close-icon d-flex flex-wrap align-items-center justify-content-center"
        onClick={onClose}
      >
        <img src={Closeicon} alt="Closeicon" />
      </div>
      <div className="container">
        <div className="serch-box">
          <InputGroup className="d-flex flex-wrap align-items-center">
            <Input
              placeholder={handleLabelKEY(
                selected_Language === "English"
                  ? adminlabelsFromReducer?.EN?.search_and_hit_enter
                  : adminlabelsFromReducer?.DE?.search_and_hit_enter,
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
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div
                className={`dropZone ${isFileDragged ? "drop-effect" : ""}`}
                {...getRootProps()}
                onDragOver={() => setIsFileDragged(true)}
                onDragLeave={() => setIsFileDragged(false)}
              >
                <input {...getInputProps()} />
                <p>
                  {fileProcessing ? "Processing..." : "Drop files or click here"}
                </p>
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </div>
  );
};
