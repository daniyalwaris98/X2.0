import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Checkbox, Spin, Modal, Row, Col } from "antd";
import styled from "styled-components";
import { useLocation, useHistory } from "react-router-dom";
import { columnSearch } from "../../utils";
import { TableStyling } from "../AllStyling/All.styled.js";

let columnFilters = {};

let excelData = [];
const RackNameModel = (props) => {
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
      title: "Rack Name",
      dataIndex: "rack_name",
      key: "rack_name",
      // ...getColumnSearchProps("device_id"),
      // ...getColumnSearchProps(
      //   "site_name",
      //   "Rack Name",
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
      title: "Site Name",
      dataIndex: "site_name",
      key: "site_name",
      // ...getColumnSearchProps("ne_ip_address"),
      // ...getColumnSearchProps(
      //   "site_name",
      //   "Site Name",
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
      title: "Serial Number",
      dataIndex: "serial_number",
      key: "serial_number",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "serial_number",
      //   "Serial Number",
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
      title: "Manufacturer Date",
      dataIndex: "manufactuer_date",
      key: "manufactuer_date",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "manufactuer_date",
      //   "Manufactuer Date",
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
      title: "Unit Position",
      dataIndex: "unit_position",
      key: "unit_position",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "unit_position",
      //   "Unit Position",
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
      title: "RU",
      dataIndex: "ru",
      key: "ru",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "ru",
      //   "RU",
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
      title: "RFS Date",
      dataIndex: "rfs_date",
      key: "rfs_date",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "rfs_date",
      //   "RFS Date",
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
      title: "Height",
      dataIndex: "height",
      key: "height",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "height",
      //   "Height",
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
      title: "Width",
      dataIndex: "width",
      key: "width",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "width",
      //   "Width",
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
      title: "Depth",
      dataIndex: "depth",
      key: "depth",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "depth",
      //   "Depth",
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
      title: "PN Code",
      dataIndex: "pn_code",
      key: "pn_code",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "pn_code",
      //   "PN Code",
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
    //   title: "tag_id",
    //   dataIndex: "tag_id",
    //   key: "tag_id",
    //   // ...getColumnSearchProps("status"),
    //   ...getColumnSearchProps(
    //     "tag_id",
    //     "Tag Id",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   // sorter: (a, b) => a.region.length - b.region.length,
    //   // sortOrder: sortedInfo.columnKey === "region" && sortedInfo.order,
    //   ellipsis: true,
    // },
    {
      title: "Rack Modal",
      dataIndex: "rack_model",
      key: "rack_model",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "rack_model",
      //   "Rack Model",
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
      title: "Floor",
      dataIndex: "floor",
      key: "floor",
      // ...getColumnSearchProps("status"),
      // ...getColumnSearchProps(
      //   "floor",
      //   "Floor",
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
    props.setRackNameModalVisible(false);
  };

  return (
    <Modal
      style={{ marginTop: "0px", zIndex: "99999" }}
      width="75%"
      title=""
      closable={false}
      open={props.rackNameModalVisible}
      footer=""
    >
      <TableStyling
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: [50, 100, 500, 1000],
        }}
        scroll={{ x: 3000 }}
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
export default RackNameModel;
