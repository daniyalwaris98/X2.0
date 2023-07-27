import React, { useEffect, useState } from "react";
import axios, { baseUrl } from "../../../utils/axios/index";

import { TableStyle } from "./Table.style";

function Table(props) {
  const { columns, endPoint, pagination, data, ...otherTableProps } = props;
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getTableData();
  }, []);

  const getTableData = async () => {
    if (endPoint) {
      await axios
        .get(`${baseUrl}/${endPoint}`)
        .then((res) => {
          setTableData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <TableStyle
      columns={columns}
      pagination={{ pageSize: pagination }}
      dataSource={endPoint ? tableData : data}
      {...otherTableProps}
    />
  );
}

export default Table;
