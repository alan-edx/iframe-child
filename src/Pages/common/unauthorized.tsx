import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getImageUrl } from "../../common/handleAmazonS3Image";
import "./unauthorized.css";

const CloseIcon = getImageUrl("bstamp-images/close-red-icon.svg");

export const UnauthorizedUserComponent = () => {
  const history = useHistory();

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="user-unauthorized">
      <img className="closeRedIcon" alt="close-red-icon" src={CloseIcon} />
      <p className="unauthorized-title">Unauthorized</p>
      <p>
        You are not authorized to access this page. Go back to <span onClick={() => history.push("/")}>Home</span>
      </p>
      <p>
        for further inquiries, please contact <span onClick={() => (window.location.href = `mailto:${"helpdesk@edexa.com"}`)}>helpdesk@edexa.com</span>
      </p>
    </div>
  );
};
