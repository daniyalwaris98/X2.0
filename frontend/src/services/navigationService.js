import { useNavigate } from "react-router-dom";

const useCheckTokenAndNavigate = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("monetx_access_token");

  if (!token) {
    // Token not present, navigate to login page
    navigate("/");
  }
  // Token is present, allow access to the route
};

export default useCheckTokenAndNavigate;
