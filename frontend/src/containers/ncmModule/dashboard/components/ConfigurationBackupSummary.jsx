import React, { useEffect } from "react";
import PropTypes from "prop-types";
import * as echarts from "echarts";

const ConfigurationBackupSummary = ({ data }) => {
  // useEffect(() => {
  //   const chartDom = document.getElementById("backupSummaryChart");
  //   const myChart = echarts.init(chartDom);

  //   const { backup_successful, backup_failure, not_backup } = data; // Adjusted the keys here

  //   const option = {
  //     angleAxis: {
  //       type: "category",
  //       axisLine: {
  //         show: false,
  //       },
  //       axisLabel: {
  //         show: false,
  //       },
  //       axisTick: {
  //         show: false,
  //       },
  //     },
  //     radiusAxis: {
  //       max: 8,
  //       axisLine: {
  //         show: false,
  //       },
  //       axisLabel: {
  //         show: false,
  //       },
  //       axisTick: {
  //         show: false,
  //       },
  //     },
  //     polar: {},
  //     series: [
  //       {
  //         type: "bar",
  //         data: [backup_successful], // Adjusted the key here
  //         coordinateSystem: "polar",
  //         name: "Backup Successful",
  //         emphasis: {
  //           focus: "series",
  //         },
  //         color: "#63ABFD",
  //       },
  //       {
  //         type: "bar",
  //         data: [backup_failure], // Adjusted the key here
  //         coordinateSystem: "polar",
  //         name: "Backup Failure",
  //         emphasis: {
  //           focus: "series",
  //         },
  //         color: "#3D9E47",
  //       },
  //       {
  //         type: "bar",
  //         data: [not_backup], // Adjusted the key here
  //         coordinateSystem: "polar",
  //         name: "Not Backup",
  //         emphasis: {
  //           focus: "series",
  //         },
  //         color: "#FF0000",
  //       },
  //     ],
  //     legend: {
  //       show: true,
  //       data: ["Backup Successful", "Backup Failure", "Not Backup"],
  //       y: "top",
  //       padding: [10, 0],
  //     },
  //   };

  //   option && myChart.setOption(option);

  //   return () => {
  //     myChart.dispose();
  //   };
  // }, [data]);

  return (
    <div
      id="backupSummaryChart"
      style={{ width: "100%", height: "400px" }}
    ></div>
  );
};

ConfigurationBackupSummary.propTypes = {
  data: PropTypes.shape({
    backup_successful: PropTypes.number.isRequired,
    backup_failure: PropTypes.number.isRequired,
    not_backup: PropTypes.number.isRequired,
  }).isRequired,
};

export default ConfigurationBackupSummary;
