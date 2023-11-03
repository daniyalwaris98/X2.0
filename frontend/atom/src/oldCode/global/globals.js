export const baseUrl = "http://localhost:5010"; //! local
// export const baseUrl = "http://192.168.10.150:5010"; //! local vm
// export const baseUrl = "http://192.168.10.151:5010"; //! VM
// export const baseUrl = "https://monetxbackend.nets-x-map.com"; //! local
// export const baseUrl = "https://192.168.10.242:5010"; //! DR
// export const baseUrl = "http://192.168.10.218:5010"; //! Production
// export const baseUrl = "https://192.168.10.222:5010"; //! Testing
// export const baseUrl = "http://10.254.169.51:5010"; //! For PTCL
// export const baseUrl = "http://192.168.201.24:5010"; //! For NIC
// export const baseUrl = "http://182.176.228.148:5010"; //! For NCWH

// export const baseUrl = "http://172.16.0.16:5010"; //! For NCWH
// export const baseUrl = "http://192.168.0.32:5010"; //! For Nust Resarpur server

// export const baseUrl = "http://172.22.5.230:5010";

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const setData = (role, name, config) => {
  localStorage.setItem("role", btoa(role));
  localStorage.setItem("name", btoa(name));
  localStorage.setItem("config", btoa(config));
};

export const getData = () => {
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  return {
    user,
    token,
    role,
  };
};

export const removeData = () => {
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("config");
};
