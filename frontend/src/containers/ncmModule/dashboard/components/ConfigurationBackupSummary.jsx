import React, { useEffect } from "react";
import PropTypes from "prop-types";
import * as echarts from "echarts";

const ConfigurationBackupSummary = ({ data }) => {
  useEffect(() => {
    const chartDom = document.getElementById("backupSummaryChart");
    const myChart = echarts.init(chartDom);

    const { backupSuccess, backupFailure, notBackup } = data;

    const option = {
      angleAxis: {
        type: "category",
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      radiusAxis: {
        max: 8,
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      polar: {},
      series: [
        {
          type: "bar",
          data: [backupSuccess], // Use prop value for "Backup Successful"
          coordinateSystem: "polar",
          name: "Backup Successful",
          emphasis: {
            focus: "series",
          },
          color: "#63ABFD",
        },
        {
          type: "bar",
          data: [backupFailure], // Use prop value for "Backup Failure"
          coordinateSystem: "polar",
          name: "Backup Failure",
          emphasis: {
            focus: "series",
          },
          color: "#3D9E47",
        },
        {
          type: "bar",
          data: [notBackup], // Use prop value for "Not Backup"
          coordinateSystem: "polar",
          name: "Not Backup",
          emphasis: {
            focus: "series",
          },
          color: "#FF0000",
        },
      ],
      legend: {
        show: true,
        data: ["Backup Successful", "Backup Failure", "Not Backup"],
        y: "top",
        padding: [10, 0],
      },
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [data]);

  return <div id="backupSummaryChart" style={{ width: "100%", height: "400px" }}></div>;
};

ConfigurationBackupSummary.propTypes = {
  data: PropTypes.shape({
    backupSuccess: PropTypes.number.isRequired,
    backupFailure: PropTypes.number.isRequired,
    notBackup: PropTypes.number.isRequired,
  }).isRequired,
};

export default ConfigurationBackupSummary;
