import React from "react";
import { Navigate } from "react-router-dom";


import CloudMonitoringModule from "../containers/cloudMonitoringModule/";
import { MODULE_PATH } from "../containers/cloudMonitoringModule";

// import MonitoringModule from "../containers/monitoringModule";
// import { MODULE_PATH } from "../containers/monitoringModule";
// import Aws from "../containers/cloudMonitoringModule/aws";
// import { DROPDOWN_PATH as DROPDOWN_PATH_CLOUDS } from "../containers/monitoringModule/cloudsDropDown";

// import AWSDropDown from "../containers/monitoringModule/cloudsDropDown/awsDropDown";
// import { DROPDOWN_PATH as DROPDOWN_PATH_AWS } from "../containers/monitoringModule/cloudsDropDown/awsDropDown";


// import Aws from "../containers/monitoringModule/cloudsDropDown/awsDropDown";
// import { PAGE_PATH as PAGE_PATH_AWS } from "../containers/cloudMonitoringModule/aws/aws/constants";

import Aws from "../containers/cloudMonitoringModule/aws/runningServices/index";
import { PAGE_PATH as PAGE_PATH_AWS } from "../containers/cloudMonitoringModule/aws/runningServices/constants";




import AwsAccounts from "../containers/monitoringModule/cloudsDropDown/awsDropDown/accounts";
import { PAGE_PATH as PAGE_PATH_AWS_ACCOUNTS } from "../containers/monitoringModule/cloudsDropDown/awsDropDown/accounts/constants";

import EC2 from "../containers/monitoringModule/cloudsDropDown/awsDropDown/ec2";
import { PAGE_PATH as PAGE_PATH_EC2 } from "../containers/monitoringModule/cloudsDropDown/awsDropDown/ec2/constants";

import S3 from "../containers/monitoringModule/cloudsDropDown/awsDropDown/s3";
import { PAGE_PATH as PAGE_PATH_S3 } from "../containers/monitoringModule/cloudsDropDown/awsDropDown/s3/constants";

import ELB from "../containers/monitoringModule/cloudsDropDown/awsDropDown/elb";
import { PAGE_PATH as PAGE_PATH_ELB } from "../containers/monitoringModule/cloudsDropDown/awsDropDown/elb/constants";

import { MAIN_LAYOUT_PATH } from "../layouts/mainLayout";

export default function moduleRoutes(roleConfigurations, authorizePageRoutes) {
  const routes = [
    {
      path: PAGE_PATH_AWS_ACCOUNTS,
      element: <AwsAccounts />,
      
    },
  ];

  // Authorize module page routes
  const authorizedPageRoutes = authorizePageRoutes({
    module: MODULE_PATH,
    pageRoutes: routes,
    roleConfigurations,
    defaultPagePath: `/${MAIN_LAYOUT_PATH}/${MODULE_PATH}`,
  });

  return {
    path: MODULE_PATH,
    element: <CloudMonitoringModule />,
    children: authorizedPageRoutes,
  };
}
