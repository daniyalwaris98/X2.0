import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { InputField } from "./Input.Styled.js";
import "../App.css";
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
      } else {
        delete columnFilters[dataIndex];
      }
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

    e.target.value = "";
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
          onChange={handleColumnInput}
        />
      </div>
    </div>
  );
};

export const columnSearch = () => {
  const getColumnSearchProps = (
    dataIndex,
    title,
    setRowCount,
    setDataSource,
    excelData,
    columnFilters
  ) => ({
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
  });

  return getColumnSearchProps;
};
