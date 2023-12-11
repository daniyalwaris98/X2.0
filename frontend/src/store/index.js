import { configureStore } from "@reduxjs/toolkit";
import { monetxApi } from "./features/apiSlice";
import atomReducer from "./features/atomModule/atom";
import passwordGroupReducer from "./features/atomModule/passwordGroup";
import siteReducer from "./features/uamModule/sites";
import rackReducer from "./features/uamModule/racks";
import deviceReducer from "./features/uamModule/devices";
import boardReducer from "./features/uamModule/boards";
import subBoardReducer from "./features/uamModule/subBoards";
import sfpsReducer from "./features/uamModule/sfps";
import licenseReducer from "./features/uamModule/licenses";
import apsReducer from "./features/uamModule/aps";
import hwLifeCycleReducer from "./features/uamModule/hwLifeCycle";
import mdeviceReducer from "./features/monitoringModule/devices";
import alertReducer from "./features/monitoringModule/alerts";
import credentialsReducer from "./features/monitoringModule/credentials"
import dropDownsReducer from "./features/dropDowns";



export const store = configureStore({
  reducer: {
    atom: atomReducer,
    password_group: passwordGroupReducer,
    site: siteReducer,
    rack: rackReducer,
    device: deviceReducer,
    board: boardReducer,
    sub_board: subBoardReducer,
    sfps: sfpsReducer,
    license: licenseReducer,
    aps: apsReducer,
    hwLifeCycle: hwLifeCycleReducer,
    mdevice: mdeviceReducer,
    alert: alertReducer,
    credentials:credentialsReducer,
    drop_downs: dropDownsReducer,
    [monetxApi.reducerPath]: monetxApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(monetxApi.middleware),
});
