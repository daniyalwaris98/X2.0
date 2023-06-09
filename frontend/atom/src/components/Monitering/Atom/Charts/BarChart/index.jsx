import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios, { baseUrl } from "../../../../../utils/axios";
import { SpinLoading } from "../../../../AllStyling/All.styled";

const index = (props) => {
  const [vendorData, setVendorData] = useState([]);
  const [mainTableLoading, setMainTableLoading] = useState(false);
  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllMonitoringVendors");
        console.log("res", res);
        setVendorData(res.data);
        setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, [props.rowCount]);

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <SpinLoading spinning={mainTableLoading} tip="Loading...">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          layout="vertical"
          width={500}
          height={300}
          data={vendorData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          onClick={(data) => {
            console.log(data.activeLabel);
            props.setVendorValue(data.activeLabel);
            // props.venderVal == data.activeLabel;

            props.vendorVal(data.activeLabel);
            // onBarClick(data.activeLabel);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis hide type="number" axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" stroke="#000" />
          {/* <XAxis type="number" axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" stroke="#000" fontSize="12" /> */}

          <Tooltip />
          <Legend />
          <Bar
            dataKey="value"
            barSize={15}
            stackId="a"
            fill="#66B127"
            radius={[5, 5, 5, 5]}
          />
          {/* <Bar dataKey="uv" stackId="b" fill="#DC3938" radius={[5, 5, 5, 5]} /> */}
          {/* <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" /> */}
        </BarChart>
      </ResponsiveContainer>
    </SpinLoading>
  );
};

export default index;
