import { Navigate, createBrowserRouter } from "react-router-dom";
import FailedDevices from "../containers/adminModule/failedDevices";
import AutoDiscovery from "../containers/autoDiscoveryModule";
import ManageDevices from "../containers/autoDiscoveryModule/manageDevices";
const router = createBrowserRouter([
  {
    path: "/",
    element: <FailedDevices />,
  },
  {
    path: "/auto-discovery",
    element: <AutoDiscovery />,

    children: [
      {
        path: "manage-devices",
        element: <ManageDevices />,
      },
    ],
  },
]);

export default router;
