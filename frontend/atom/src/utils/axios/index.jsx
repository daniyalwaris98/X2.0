import React, { useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import { createBrowserHistory } from "history";
import axios from "axios";

export const baseUrl = "http://localhost:5010"; //! local
// export const baseUrl = "http://192.168.10.151:5010"; //! VM
// export const baseUrl = "http://192.168.10.150:5010"; //! VM
// export const baseUrl = "https://monetxbackend.nets-x-map.com"; //! local
// export const baseUrl = "https://192.168.10.242:5010"; //! DR
// export const baseUrl = "http://192.168.10.218:5010"; //! Production
// export const baseUrl = "https://192.168.10.222:5010"; //! Testing
// export const baseUrl = "http://10.254.169.51:5010"; //! For PTCL
// export const baseUrl = "http://192.168.201.24:5010"; //! For NIC
// export const baseUrl = "http://182.176.228.148:5010"; //! For NCWH

// export const baseUrl = "http://172.16.0.16:5010"; //! For NCWH

// export const baseUrl = "http://172.22.5.230:5010";

const instance = axios.create();
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("monetx_token");
  //   // console.log("token => " + token);
  if (token) {
    // config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["X-Auth-Key"] = token;
  }
  return config;
});

// Response interceptor for API calls
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    // console.clear();
    // console.log(error?.response?.status);
    if (error?.response?.status === 401) {
      localStorage.removeItem("monetx_token");
      localStorage.removeItem("user");
      localStorage.removeItem("monetx_configuration");
      createBrowserHistory().push("/");
      window.location.reload();
    } else {
      return error;
    }
  }
);

//https://thedutchlab.com/blog/using-axios-interceptors-for-refreshing-your-api-token

export default instance;
