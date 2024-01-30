import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRoleConfiguration } from "../store/features/login";
import { defaultConfiguration } from "../containers/adminModule/roles/defaultConfiguration";

export default function useJwtHandling() {
  const dispatch = useDispatch();
  localStorage.setItem(
    "monetx_jwt_token",
    JSON.stringify(defaultConfiguration)
  );

  // useEffect(() => {

  //   // const token = localStorage.getItem("monetx_jwt_token");
  //   // process token
  //   console.log("defaultConfiguration", defaultConfiguration);
  //   dispatch(setRoleConfiguration(defaultConfiguration));
  // }, [dispatch]);
}
