import React from "react";
import { CustomTableStyle } from "./CustomTable.style";

function CustomTable(props) {
  const { columns = [], dataSource = [], className } = props;

  return (
    <CustomTableStyle className={className}>
      <thead>
        <tr>
          {columns.map((column, index) => {
            return <td key={index}>{column.title}</td>;
          })}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key}>{row[column.dataIndex]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </CustomTableStyle>
  );
}

export default CustomTable;
