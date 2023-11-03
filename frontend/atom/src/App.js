import * as React from "react";
import "antd/dist/antd.min.css";

import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./routes";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
