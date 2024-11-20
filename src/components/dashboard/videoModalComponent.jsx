import React from "react";
import { Modal, ModalHeader } from "reactstrap";

const VideoModalComponent = ({ videoPlay, setVideoPlay }) => {
  return (
    <Modal isOpen={videoPlay} centered toggle={() => setVideoPlay(!videoPlay)} className="videomodle" backdrop="static">
      <ModalHeader>
        <div className="videoClose" onClick={() => setVideoPlay(false)}>
          <i className="fas fa-times m-auto"></i>
        </div>
      </ModalHeader>
      <iframe
        width="600"
        height="400"
        src="https://www.youtube.com/embed/WPRvDneL4C0"
        title="YouTube video player"
        autoPlay="true"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen></iframe>
    </Modal>
  );
};

export default VideoModalComponent;
