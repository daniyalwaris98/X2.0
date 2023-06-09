import React, { useState, useEffect } from "react";
import axios, { baseUrl } from "../../../../utils/axios";
// import { TableStyling } from "./Table.styled.js";

import {
  TableStyling,
  StyledImportFileInput,
  StyledButton,
  OnBoardStyledButton,
  AddAtomStyledButton,
  StyledExportButton,
  StyledInput,
  Styledselect,
  InputWrapper,
  StyledSubmitButton,
  StyledModalButton,
  ColStyling,
  AddStyledButton,
  TableStyle,
  SpinLoading,
} from "../../../AllStyling/All.styled.js";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/topSitesDashboard");
        console.log("topSitesDashboard", res.data);
        setMyFunction(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);
  console.log(myFunction);

  const columns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => <p style={{ textAlign: "left" }}>{text}</p>,
    },
    {
      title: "Site Name",
      dataIndex: "site_name",
      key: "site_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,
    },

    {
      title: "OnBoard Status",
      dataIndex: "onboard_status",
      key: "onboard_status",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,
    },
    {
      title: "Operational Status",
      dataIndex: "operational_status",
      key: "operational_status",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,
    },
  ];
  // const data = [
  //   {
  //     key: '1',
  //     ip_address: '0.11.1.0',
  //     site_name: 'RIO',
  //     device_type: 'Kch Bhi',
  //     onboard_status: 'OnBoard',
  //     operation_status: 'Active',
  //   },
  //   {
  //     key: '1',
  //     ip_address: '0.11.1.0',
  //     site_name: 'RIO',
  //     device_type: 'Kch Bhi',
  //     onboard_status: 'OnBoard',
  //     operation_status: 'Active',
  //   },
  //   {
  //     key: '1',
  //     ip_address: '0.11.1.0',
  //     site_name: 'RIO',
  //     device_type: 'Kch Bhi',
  //     onboard_status: 'OnBoard',
  //     operation_status: 'Active',
  //   },
  //   {
  //     key: '1',
  //     ip_address: '0.11.1.0',
  //     site_name: 'RIO',
  //     device_type: 'Kch Bhi',
  //     onboard_status: 'OnBoard',
  //     operation_status: 'Active',
  //   },
  //   {
  //     key: '1',
  //     ip_address: '0.11.1.0',
  //     site_name: 'RIO',
  //     device_type: 'Kch Bhi',
  //     onboard_status: 'OnBoard',
  //     operation_status: 'Active',
  //   },
  // ];

  return (
    <>
      <SpinLoading spinning={loading}>
        <TableStyling
          // scroll={{ x: 830 }}
          columns={columns}
          dataSource={myFunction}
          pagination={{ pageSize: 6 }}
          size="middle"
        />
      </SpinLoading>
    </>
  );
};

export default index;
