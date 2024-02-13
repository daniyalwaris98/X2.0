import { monetxApi } from "../../apiSlice";

export const extendedApi = monetxApi.injectEndpoints({
  endpoints: (builder) => ({
    getSnmpStatus: builder.query({           
      query: () => "/api/v1/auto_discovery_dashboard/get_snmp_status_graph",
    }),


    
    getCredentialsSummary: builder.query({
      query: () => "/api/v1/auto_discovery_dashboard/get_credentials_graph",
      
    }),
    getTopVendorForDiscovery: builder.query({
        query: () => "/api/v1/auto_discovery_dashboard/get_top_vendors_for_discovery",
        
      }),
      getTopOs: builder.query({
        query: () => "/api/v1/auto_discovery_dashboard/get_top_os_for_discovery",
        
      }),
   
      getCountPerFunction: builder.query({
        query: () => "/api/v1/auto_discovery_dashboard/get_top_functions_for_discovery",
        
      }),

  }),
});

export const {
  useGetSnmpStatusQuery, useGetCredentialsSummaryQuery, useGetTopVendorForDiscoveryQuery, useGetTopOsQuery, useGetCountPerFunctionQuery
} = extendedApi;
// import React, { useEffect, useRef } from 'react';
// import * as echarts from 'echarts';

// const TopOpenPorts = ({ chartData }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (!chartData || !chartData.name || !chartData.value) {
//       console.error('Invalid chart data:', chartData);
//       return;
//     }
    
//     const option = {
//       xAxis: {
//         type: 'category',
//         data: chartData.name,
//       },
//       yAxis: {
//         type: 'value',
//       },
//       series: [
//         {
//           data: chartData.values,
//           type: 'bar',
//           showBackground: true,
//           backgroundStyle: {
//             color: '#F4F8F3',
//             borderRadius: [20, 20, 0, 0],
//           },
//           itemStyle: {
//             color: '#66B127',
//             borderRadius: [20, 20, 0, 0],
//           },
//           emphasis: {
//             itemStyle: {
//               color: '#66B127',
//               borderRadius: [20, 20, 0, 0],
//             },
//           },
//         },
//       ],
//     };

//     const myChart = echarts.init(chartRef.current);
//     myChart.setOption(option);

//     return () => {
//       myChart.dispose();
//     };
//   }, [chartData]);

//   return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
// };

// export default TopOpenPorts;
