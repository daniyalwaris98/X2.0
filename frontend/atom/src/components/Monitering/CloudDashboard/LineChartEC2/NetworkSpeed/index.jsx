import React, { useState, useEffect } from "react";
import {
  LineChart,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
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
          baseUrl + "/getEC2TimeSeriesData",

          {
            instance_id: props.instanceId,
          }
        );
        var timeS = null;
        // for (var i = 0; i <= res.data.length; i++) {
        //   console.log("res", res.data[i].timestamp);
        //   timeS = res.data[i].timestamp;
        // }
        // console.log(" list data 111111111111111111111", listData);
        console.log(res.data);
        // console.log("timeS", timeS);

        // const options = res.data.map((item) => ({
        //   network_in: item.network_in,
        //   name: item.instance_name,
        //   network_out: item.network_out,
        // }));
        // console.log(options);

        const result = [];

        // // Loop through each object in the array
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
            network_in: item.network_in,

            network_out: item.network_out,

            name: `${hour}` + ":" + `${minute}`,
          };

          // Add the dictionary object to the result array
          result.push(obj);
        });

        // console.log(result);

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
  const serviceCalls = async () => {
    setMainTableLoading(true);

    try {
      const res = await axios.post(
        baseUrl + "/getEC2TimeSeriesData",

        {
          instance_id: props.instanceId,
        }
      );
      var timeS = null;
      // for (var i = 0; i <= res.data.length; i++) {
      //   console.log("res", res.data[i].timestamp);
      //   timeS = res.data[i].timestamp;
      // }
      // console.log(" list data 111111111111111111111", listData);
      console.log(res.data);
      // console.log("timeS", timeS);

      // const options = res.data.map((item) => ({
      //   network_in: item.network_in,
      //   name: item.instance_name,
      //   network_out: item.network_out,
      // }));
      // console.log(options);

      const result = [];

      // // Loop through each object in the array
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
          network_in: item.network_in,

          network_out: item.network_out,

          name: `${hour}` + ":" + `${minute}`,
        };

        // Add the dictionary object to the result array
        result.push(obj);
      });

      // console.log(result);

      setFunctionData(result);

      // setFunctionData(res.data);
      setMainTableLoading(false);
    } catch (err) {
      console.log(err.response);
      setMainTableLoading(false);
    }
  };
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const loadAllData = async () => {
  //       try {
  //         const res = await axios.post(
  //           baseUrl + "/getEC2TimeSeriesData",

  //           {
  //             instance_id: props.instanceId,
  //           }
  //         );
  //         var timeS = null;
  //         // for (var i = 0; i <= res.data.length; i++) {
  //         //   console.log("res", res.data[i].timestamp);
  //         //   timeS = res.data[i].timestamp;
  //         // }
  //         // console.log(" list data 111111111111111111111", listData);
  //         console.log(res.data);
  //         // console.log("timeS", timeS);

  //         // const options = res.data.map((item) => ({
  //         //   network_in: item.network_in,
  //         //   name: item.instance_name,
  //         //   network_out: item.network_out,
  //         // }));
  //         // console.log(options);

  //         const result = [];

  //         // // Loop through each object in the array
  //         res.data.forEach((item) => {
  //           // Get the timestamp value from the object
  //           const timestamp = item.timestamp;

  //           // Create a new Date object using the timestamp value
  //           const date = new Date(timestamp);

  //           // Extract the hour and minute from the Date object
  //           const hour = date.getHours();
  //           const minute = date.getMinutes();

  //           // Append the hour and minute to a new dictionary object
  //           const obj = {
  //             network_in: item.network_in,

  //             network_out: item.network_out,

  //             name: `${hour}` + ":" + `${minute}`,
  //           };

  //           // Add the dictionary object to the result array
  //           result.push(obj);
  //         });

  //         // console.log(result);

  //         setFunctionData(result);

  //         // setFunctionData(res.data);
  //         setMainTableLoading(false);
  //       } catch (err) {
  //         console.log(err.response);
  //         setMainTableLoading(false);
  //       }
  //     };
  //     loadAllData();
  //   }, 10000); // 3 minutes in milliseconds

  //   return () => clearInterval(interval);
  // }, []);

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
        <div style={{ float: "right" }}>
        <button
          onClick={serviceCalls}
          style={{
            backgroundColor: "#6ab127",
            border: "none",
            color: "#fff",
            padding: "6px",
            borderRadius: "5px",
            marginRight: "12px",
          }}
        >
          Reload
        </button>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
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
          {/* <Legend /> */}
          <Line
            dataKey="network_in"
            stroke="#6ab127"
            // activeDot={{ r: 8 }}
            strokeWidth={3}
            dot={false}
          />
          <Line
            dataKey="network_out"
            dot={false}
            stroke="rgba(255,0,0,0.4)"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </SpinLoading>
  );
};

export default index;
