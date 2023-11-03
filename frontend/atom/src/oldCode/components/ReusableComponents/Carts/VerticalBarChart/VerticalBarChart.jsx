import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios, { baseUrl } from "../../../../utils/axios/index";
import { VerticalBarChartStyle } from "./VerticalBarChart.style";

function VerticalBarChart(props) {
  const { endPoint, setVendorValue = () => {}, vendorVal = () => {} } = props;
  const [vendorData, setVendorData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(baseUrl + "/getAllMonitoringVendors")
      .then((res) => {
        setVendorData(res.data);
      })
      .catch((err) => {
        console.log("err=======>", err);
      });
  };

  return (
    <VerticalBarChartStyle>
      <ResponsiveContainer width="100%" height={300}>
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
            setVendorValue(data.activeLabel);

            vendorVal(data.activeLabel);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis hide type="number" axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" stroke="#000" />

          <Tooltip />
          <Legend />
          <Bar
            dataKey="value"
            barSize={15}
            stackId="a"
            fill="#66B127"
            radius={[5, 5, 5, 5]}
          />
        </BarChart>
      </ResponsiveContainer>
    </VerticalBarChartStyle>
  );
}

export default VerticalBarChart;
