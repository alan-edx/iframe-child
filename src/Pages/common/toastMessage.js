import { toast } from "react-toastify";
const options = {
  position: "bottom-left",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: false
};

const toaster = {
  success(message) {
    return toast.success(message, {
      ...options,
      style: { background: "#073D83" }
    });
  },
  error(message) {
    return toast.error(message, { ...options });
  }
};

export default toaster;
