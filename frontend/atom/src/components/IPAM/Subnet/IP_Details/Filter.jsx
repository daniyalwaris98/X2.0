import React, { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { InputField } from "./Input.styled.js";

const ColumnHeader = ({
  dataIndex,
  title,
  setRowCount,
  setDataSource,
  excelData,
  columnFilters,
}) => {
  const handleColumnInput = (e) => {
    if (dataIndex in columnFilters) {
      if (e.target.value.length > 0) {
        columnFilters[dataIndex] = e.target.value;
      } else delete columnFilters[dataIndex];
    } else {
      columnFilters[dataIndex] = e.target.value;
    }
    let filteredSuggestions = excelData;

    for (const [key, value] of Object.entries(columnFilters)) {
      filteredSuggestions = filteredSuggestions.filter(
        (d) =>
          JSON.stringify(d[key])
            .replace(" ", "")
            .toLowerCase()
            .indexOf(value.replace(" ", "").toLowerCase()) > -1
      );
    }
    setRowCount(filteredSuggestions.length);
    setDataSource(filteredSuggestions);
  };

  return (
    <div style={{ margin: "0  auto" }}>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <InputField
          id="textFiledTest"
          placeholder={title}
          suffix={<SearchOutlined style={{ color: "rgba(0,0,0,0.5)" }} />}
          style={{
            height: "25px",
            borderRadius: "5px",
            marginTop: "5px",

            margin: "0 auto",
          }}
          defaultValue={columnFilters[dataIndex]}
          onChange={handleColumnInput}
        />
      </div>
    </div>
  );
};

//-------------------------------------------------------------------------------------------

// if (subnetAddress !== "" && typeof subnetAddress !== "undefined") {
//   columnFilters = { subnet: subnetAddress };

// }

export const getColumnSearchProps = (
  dataIndex,
  title,
  setRowCount,
  setDataSource,
  excelData,
  columnFilters
) => {
  if (dataIndex === "subnet" || dataIndex === "open_ports") {
    console.log(
      "columnFilterscolumnFilterscolumnFilterscolumnFilterscolumnFilterscolumnFilterscolumnFilterscolumnFilterscolumnFilters",
      columnFilters
    );
  }
  return {
    title: (
      <ColumnHeader
        dataIndex={dataIndex}
        title={title}
        setRowCount={setRowCount}
        setDataSource={setDataSource}
        excelData={excelData}
        columnFilters={columnFilters}
      />
    ),
  };
};
