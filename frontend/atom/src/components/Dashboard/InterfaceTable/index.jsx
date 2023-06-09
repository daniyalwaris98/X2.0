import React, { useState, useEffect } from "react";
import axios, { baseUrl } from "../../../utils/axios";
import { TableStyling } from "../../AllStyling/All.styled.js";
import {Progress} from "antd";
const index = () => {
  const [cpuFunc, setCpuFunc] = useState([]);
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    const cpuFunc = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/getCpuDashboard");
        setCpuFunc(res.data);
        console.log(cpuFunc);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    cpuFunc();
  }, []);
  const cpuColumns = [
    {
      title: "Ip Address",
      dataIndex: "ip_address",
      key: "ip_address",
    },
    {
      title: "Device Name",
      dataIndex: "device_name",
      key: "device_name",
    },

    {
      title: "CPU Utilization",
      dataIndex: "cpu",
      key: "cpu",
      render: (text) => (
        <div
          onClick={() => {
            console.log(text);
          }}
          style={{
            // textAlign: "center",
            // marginLeft: "20px",
            marginTop: "-10px",
            paddingRight: "25px",
            paddingLeft: "15px",
          }}
        >
          {text <= 60 ? (
            <Progress
              strokeColor="#66B127"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
          {text > 60 && text <= 80 ? (
            <Progress
              strokeColor="#F57A40"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}

          {text > 80 && text <= 100 ? (
            <Progress
              strokeColor="#CC050C"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
        </div>
      ),
    },
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
    },
  ];
  return (
    <div>
      <TableStyling
        dataSource={cpuFunc}
        columns={cpuColumns}
        pagination={false}
      />
    </div>
  );
};

export default index;
