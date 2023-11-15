import React from "react";
import DefaultButton from "../../../components/buttons";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Icon } from "@iconify/react";
import { Table } from 'antd';
import useColumnSearchProps from "../../../hooks/useColumnSearchProps";




function Index() {
  const theme = useTheme();


  const getColumnSearchProps = useColumnSearchProps();
  
  const columnGenerator = () => {
 
    return [];
  };


  const dataSource = [
    {
      key: '1',
      user_name: 'Muhammad Husnain Chaudhry',
      password: '********',
      password_group: 'DXB_LAB',
      password_group_type: 'SSH',
      secret_password: '*****',
      password: '********',
    },
    {
      key: '2',
      user_name: 'Jahangir Khan',
      password: '********',
      password_group: 'F5__LAB',
      password_group_type: 'TELNET',
      secret_password: '*****',
      password: '********',
    },
    {
      key: '3',
      user_name: 'Hamza Duraz',
      password: '********',
      password_group: 'KSA',
      password_group_type: 'SSH',
      secret_password: '*****',
      password: '********',
    },
    {
      key: '4',
      user_name: 'Imran',
      password: '********',
      password_group: 'KSA_RO_1',
      password_group_type: 'SSH',
      secret_password: '*****',
      password: '********',
    },
    {
      key: '5',
      user_name: 'Sami Ullah',
      password: '********',
      password_group: 'KSA-SW',
      password_group_type: 'TELNET',
      secret_password: '*****',
      password: '********',
    },
    {
      key: '6',
      user_name: 'Nadeem Ahmed Khan',
      password: '********',
      password_group: 'KSA_WLC',
      password_group_type: 'SSH',
      secret_password: '*****',
      password: '********',
    },
    
  ];


  const TableStyle = Table; 


  let columns = columnGenerator(getColumnSearchProps, getTitle);

  columns = [
 
 
    {
      title: "User Name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Password Group",
      dataIndex: "password_group",
      key: "password_group",
    },
    {
      title: "Password Group Type",
      dataIndex: "password_group_type",
      key: "password_group_type",
    },
    {
      title: "Secret Password",
      dataIndex: "secret_password",
      key: "secret_password",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
   
  ];

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ display: "flex", justifyContent: "end", paddingBottom: "5px" }}>
        <DefaultButton
          sx={{ backgroundColor: theme.palette.color.primary }}
        >
          <Icon fontSize="16px" icon="ic:baseline-plus" />
          Add Password Group
        </DefaultButton>
      </div>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: theme.palette.textColor.tableText,
          }}
        >
          Password Group
        </Typography>

        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <DefaultButton
            sx={{ color: theme.palette.color.textBlackColor, border: "0.01px solid #DBDBDB" }}
          >
            <Icon fontSize="16px" icon="ic:baseline-plus" />
            Export
          </DefaultButton>
          <DefaultButton
            sx={{ backgroundColor: theme.palette.color.primary }}
          >
            <Icon fontSize="16px" icon="pajamas:import" /> Import
          </DefaultButton>
        </Typography>
      </Typography>

      <TableStyle
        size="small"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          defaultPageSize: 9,
          pageSizeOptions: [9, 50, 100, 500, 1000],
        }}
      />
    </div>
  );
}

export default Index;
