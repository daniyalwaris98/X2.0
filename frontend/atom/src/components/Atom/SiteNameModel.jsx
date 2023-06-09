import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Checkbox, Spin, Modal, Row, Col } from "antd";
import styled from "styled-components";
import { useLocation, useHistory } from "react-router-dom";
import { columnSearch } from "../../utils";
import { TableStyling } from "../AllStyling/All.styled.js";

let columnFilters = {};

let excelData = [];

const SiteNameModel = (props) => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  // const { excelData, racks, getRacks, domain } = useContext(Context);

  let [sortedInfo, setSortedInfo] = useState(null);
  let [filteredInfo, setFilteredInfo] = useState(null);
  let [dataSource, setDataSource] = useState(props.dataSource);
  let [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

  const handleChange = (pagination, filters, sorter, extra) => {
    console.log("Various parameters", pagination, filters, sorter);
    setRowCount(extra.currentDataSource.length);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Site Name",
      dataIndex: "site_name",
      key: "site_name",
      // ...getColumnSearchProps("device_id"),
      // ...getColumnSearchProps(
      //   "site_name",
      //   "Site Name",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // sorter: (a, b) => a.device_id.length - b.device_id.length,
      // sortOrder: sortedInfo.columnKey === "device_id" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      // ...getColumnSearchProps("ne_ip_address"),
      // ...getColumnSearchProps(
      //   "region",
      //   "Region",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // sorter: (a, b) => a.ne_ip_address.length - b.ne_ip_address.length,
      // sortOrder: sortedInfo.columnKey === "ne_ip_address" && sortedInfo.order,
      ellipsis: true,
    },

    {
      title: "Latitude",
      dataIndex: "latitude",
      key: "latitude",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "latitude",
      //   "Latitude",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // sorter: (a, b) => a.region.length - b.region.length,
      // sortOrder: sortedInfo.columnKey === "region" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "longitude",
      //   "Longitude",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // sorter: (a, b) => a.region.length - b.region.length,
      // sortOrder: sortedInfo.columnKey === "region" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "city",
      //   "City",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // sorter: (a, b) => a.region.length - b.region.length,
      // sortOrder: sortedInfo.columnKey === "region" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "creation_date",
      //   "Creation Date",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // sorter: (a, b) => a.region.length - b.region.length,
      // sortOrder: sortedInfo.columnKey === "region" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Modification Date",
      dataIndex: "modification_date",
      key: "modification_date",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "modification_date",
      //   "Modification Date",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // sorter: (a, b) => a.region.length - b.region.length,
      // sortOrder: sortedInfo.columnKey === "region" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "status",
      //   "Status",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // sorter: (a, b) => a.region.length - b.region.length,
      // sortOrder: sortedInfo.columnKey === "region" && sortedInfo.order,
      ellipsis: true,
    },
    // {
    //   title: "Total Count",
    //   dataIndex: "total_count",
    //   key: "total_count",
    //   // ...getColumnSearchProps("status"),
    //   // ...getColumnSearchProps(
    //   //   "total_count",
    //   //   "Total Count",
    //   //   setRowCount,
    //   //   setDataSource,
    //   //   excelData,
    //   //   columnFilters
    //   // ),
    //   // sorter: (a, b) => a.region.length - b.region.length,
    //   // sortOrder: sortedInfo.columnKey === "region" && sortedInfo.order,
    //   ellipsis: true,
    // },
  ];

  const handleCancel = () => {
    props.setSiteNameModalVisible(false);
  };

  return (
    <Modal
      style={{ marginTop: "0px", zIndex: "99999" }}
      width="75%"
      title=""
      closable={false}
      visible={props.siteNameModalVisible}
      footer=""
    >
      <TableStyling
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50, 100, 500, 1000],
        }}
        scroll={{
          x: 1800,
          // y: 700
        }}
        columns={columns}
        dataSource={dataSource}
        onChange={handleChange}
      />
      <Row>
        <Col span={24} style={{ textAlign: "center" }}>
          <br />
          <StyledButton color={"#66b127"} onClick={handleCancel}>
            Close
          </StyledButton>
        </Col>
      </Row>
    </Modal>
  );
};
const StyledButton = styled(Button)`
  height: 27px;
  font-size: 11px;
  font-weight: bolder;
  width: 15%;
  // font-family: Montserrat-Regular;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: ${(props) => props.color};
  border-color: ${(props) => props.color};
  color: white;
  border-radius: 5px;
  &:focus,
  &:hover {
    background-color: ${(props) => props.color};
    border-color: ${(props) => props.color};
    color: white;
    opacity: 0.8;
  }
`;
export default SiteNameModel;
