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
  const [functionData, setFunctionData] = useState([]);
  const [mainTableLoading, setMainTableLoading] = useState(false);

  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllMonitoringFunctions");
        setFunctionData(res.data);
        setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, [props.rowCount]);

  return (
    <SpinLoading spinning={mainTableLoading} tip="Loading...">
      <ResponsiveContainer width="100%" height={350}>
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
            // props.functionVal == data.activeLabel;
            props.funcVal(data.activeLabel);
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
