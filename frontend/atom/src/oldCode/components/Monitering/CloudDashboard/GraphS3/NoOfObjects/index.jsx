import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
        const res = await axios.post(
          baseUrl + "/getS3TimeSeriesData",

          {
            bucket_name: props.bucket_name,
          }
        );
        var timeS = null;
        // for (var i = 0; i <= res.data.length; i++) {
        //   console.log("res", res.data[i].timestamp);
        //   timeS = res.data[i].timestamp;
        // }
        // console.log(" list data 111111111111111111111", listData);
        // console.log("timeS", timeS);

        // const options = res.data.map((item) => ({
        //   cpu_utilization: item.cpu_utilization,
        //   timeStamp: item.timestamp,
        // }));
        // console.log(options);

        const result = [];

        // Loop through each object in the array
        res.data.forEach((item) => {
          // Get the timestamp value from the object
          const timestamp = item.timestamp;

          // Create a new Date object using the timestamp value
          const date = new Date(timestamp);

          // Extract the hour and minute from the Date object
          const hour = date.getHours();
          const minute = date.getMinutes();

          // Append the hour and minute to a new dictionary object
          const obj = {
            number_of_objects: item.number_of_objects,

            name: `${hour}` + ":" + `${minute}`,
          };

          // Add the dictionary object to the result array
          result.push(obj);
        });

        // const startIndex = 0; // Start index of the subset
        // const count = 48; // Number of objects to extract

        // const resultList = []; // Array to store the subset

        // // Loop through the subset using slice method
        // result.slice(startIndex, startIndex + count).forEach((item) => {
        //   resultList.push(item);
        // });

        setFunctionData(result);

        // setFunctionData(res.data);
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
    <SpinLoading spinning={mainTableLoading}>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          width={500}
          height={400}
          data={functionData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            // type="monotone"
            dataKey="number_of_objects"
            stroke="#62a127"
            fill="#62a127"
          />
        </AreaChart>
      </ResponsiveContainer>
    </SpinLoading>
  );
};

export default index;
