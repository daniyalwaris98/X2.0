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
import axios, { baseUrl } from "../../../../utils/axios";
import { SpinLoading } from "../../../AllStyling/All.styled";
const index = (props) => {
  const [functionData, setFunctionData] = useState([]);
  const [mainTableLoading, setMainTableLoading] = useState(false);
  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/perFunctionCountNcm");
        setFunctionData(res.data);
        setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, []);

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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          width={500}
          height={300}
          data={functionData}
          margin={{
            top: 5,
            right: 30,
            left: 40,
            bottom: 5,
          }}
          onClick={(data) => {
            console.log(data.activeLabel);
            props.setHandlebarClick(data.activeLabel);
            // onBarClick(data.activeLabel);
          }}
          // onClick={(data) => {
          //   // do your history.push based on data.activePayload[0]
          //   if (data && data.activePayload && data.activePayload.length > 0) {
          //     // return history.push(`/${data.activePayload[0].x.y.id}`);
          //     console.log(`${data.activePayload[0]}`);
          //   }
          // }}
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
            stackId="a"
            barSize={15}
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
