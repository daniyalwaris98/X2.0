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
import credentialsReducer from "./features/monitoringModule/credentials";

import manageNetworksReducer from "./features/autoDiscoveryModule/manageNetworks";
import manageDevicesReducer from "./features/autoDiscoveryModule/manageDevices";
import discoveryReducer from "./features/autoDiscoveryModule/discovery";
import v1V2CredentialsReducer from "./features/autoDiscoveryModule/manageCredentials/snmp/v1V2";
import v3CredentialsReducer from "./features/autoDiscoveryModule/manageCredentials/snmp/v3";
import sshLoginCredentialsReducer from "./features/autoDiscoveryModule/manageCredentials/login";

import dropDownsReducer from "./features/dropDowns";

export const store = configureStore({
  reducer: {
    // atom module
    atom: atomReducer,
    password_group: passwordGroupReducer,
    // uam module
    site: siteReducer,
    rack: rackReducer,
    device: deviceReducer,
    board: boardReducer,
    sub_board: subBoardReducer,
    sfps: sfpsReducer,
    license: licenseReducer,
    aps: apsReducer,
    hwLifeCycle: hwLifeCycleReducer,
    // monitoring module
    mdevice: mdeviceReducer,
    alert: alertReducer,
    credentials: credentialsReducer,
    // auto discovery module
    manage_networks: manageNetworksReducer,
    manage_devices: manageDevicesReducer,
    discovery: discoveryReducer,
    v1_v2_credentials: v1V2CredentialsReducer,
    v3_credentials: v3CredentialsReducer,
    ssh_login_credentials: sshLoginCredentialsReducer,
    // dropdowns
    drop_downs: dropDownsReducer,

    [monetxApi.reducerPath]: monetxApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(monetxApi.middleware),
});
