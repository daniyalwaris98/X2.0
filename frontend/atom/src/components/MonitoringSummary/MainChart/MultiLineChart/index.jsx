import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "antd";
import ReactSpeedometer from "react-d3-speedometer";
import axios, { baseUrl } from "../../../../utils/axios";
import { useLocation } from "react-router-dom";

import ReactTooltip from "react-tooltip";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const index_Main = () => {
  const data = useLocation();
  console.log(data);
  const [mainTableLoading, setMainTableLoading] = useState("");
  // const [ipAddress, setIpAddress] = useState(data.state.ip_address);

  // const [responseData, setResponseData] = useState(data.state.res.cards);

  // const [availability, setAvailability] = useState(data.state.res.availability);
  // const [packet_loss, setPacket_loss] = useState(data.state.res.packet_loss);
  // const [cpu_utilization, setCpu_utilization] = useState(
  //   data.state.res.cpu_utilization
  // );
  // const [memory_utilization, setMemory_utilization] = useState(
  //   data.state.res.memory_utilization
  // );
  // const [responseTime, setResponseTime] = useState(
  //   data.state.res.response_time
  // );

  // console.log(ipAddress, responseData);
  //   useEffect(() => {
  //     const serviceCalls = async () => {
  //       setMainTableLoading(true);

  //       try {
  //         const res = await axios.get(baseUrl + "/getMonitoringDevicesCards");
  //         console.log("getMonitoringDevicesCards", res);
  //       } catch (err) {
  //         console.log(err.response);
  //         setMainTableLoading(false);
  //       }
  //     };
  //     serviceCalls();
  //   }, []);
  const graphData = [
    {
      name: "Page 1",
      uv: 4000,
      pv: 2400,
    },
    {
      name: "Page 2",
      uv: 3000,
      pv: 1398,
    },
    {
      name: "Page 3",
      uv: 2000,
      pv: 9800,
    },
    {
      name: "Page 4",
      uv: 2780,
      pv: 3908,
    },
    {
      name: "Page 5",
      uv: 1890,
      pv: 4800,
    },
    {
      name: "Page 6",
      uv: 2390,
      pv: 3800,
    },
    {
      name: "Page 7",
      uv: 3490,
      pv: 4300,
    },
  ];
  return (
    <div style={{ marginRight: "15px", marginLeft: "15px" }}>
      <br />
      {/* <Hamza /> */}
      <ResponsiveContainer width="95%" height={400}>
        <LineChart
          width={1000}
          height={300}
          data={graphData}
          margin={{
            top: 5,
            right: 5,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            activeDot={{ r: 8 }}
            dataKey="uv"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default index_Main;
