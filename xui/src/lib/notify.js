import { toast } from "mdbreact"

const notify = (type, message) => {
  // return () => {
  switch (type) {
    case "info":
      toast.info(message, {
        closeButton: false
      });
      break;
    case "success":
      toast.success(message, {
        closeButton: false
      });
      break;
    case "warning":
      toast.warn(message, {
        closeButton: false
      });
      break;
    case "error":
      toast.error(message, {
        closeButton: false
      });
      break;
    default:
      toast.error(message, {
        closeButton: false
      });
  }
  // };
};

export default notify
