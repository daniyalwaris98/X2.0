// import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
// import { RadialBar } from "@ant-design/charts";
// import axios, { baseUrl } from "../../../../../utils/axios";
// import { SpinLoading } from "../../../../AllStyling/All.styled";

// const DemoRadialBar = () => {
//   const [loading, setLoading] = useState(false);
//   const [myFunction, setMyFunction] = useState([]);

//   useEffect(() => {
//     const serviceCalls = async () => {
//       setLoading(true);

//       try {
//         const res = await axios.get(baseUrl + "/getMonitoringSpiral");
//         console.log("getMonitoringSpiral", res);
//         setMyFunction(res.data);
//         setLoading(false);
//       } catch (err) {
//         console.log(err.response);
//         setLoading(false);
//       }
//     };
//     serviceCalls();
//   }, []);
//   const data = [
//     {
//       name: "Fast Ethernet",
//       value: "11.47",
//       // pv: 2400,
//       fill: "#56CCF2",
//     },
//     {
//       name: "1G",
//       value: 2.69,
//       // pv: 4567,
//       fill: "#FACE10",
//     },
//     {
//       name: "10G",
//       value: 15.69,
//       // pv: 1398,
//       fill: "#BB6BD9",
//     },
//     {
//       name: "25G",
//       value: 8.22,
//       // pv: 9800,
//       fill: "#82ca9d",
//     },
//     {
//       name: "100G",
//       value: 8.63,
//       // pv: 3908,
//       fill: "#F2994A",
//     },
//   ];
//   const config = {
//     data: myFunction,
//     xField: "name",
//     yField: "value",
//     maxAngle: 270,

//     radius: 0.8,
//     innerRadius: 0.1,
//     tooltip: {
//       formatter: (datum) => {
//         return {
//           name: "value",
//           value: datum.value,
//         };
//       },
//     },
//     colorField: "name",
//     color: ({ name }) => {
//       if (name === "Clear") {
//         return "#67B027";
//       } else if (name === "InActive") {
//         return "#A8A6A6";
//       } else if (name === "Critical") {
//         return "#FE9B3F";
//       } else if (name === "Attention") {
//         return "#E2B200";
//       } else if (name === "Device Down") {
//         return "#DC3938";
//       }

//       return "#559eec";
//     },
//   };
//   return (
//     <>
//       <SpinLoading spinning={loading} tip="Loading...">
//         <div style={{ height: "320px", paddingTop: "40px", width: "100%" }}>
//           <RadialBar {...config} />
//         </div>
//       </SpinLoading>
//     </>
//   );
// };

// export default DemoRadialBar;
