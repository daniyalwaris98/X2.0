import React, { useState, useRef, useEffect } from "react";
import { columnSearch } from "../../utils";
import ips from "./assets/ips.svg";
import { Table, Row, Col, message, Progress, notification } from "antd";
import SubnetIpDevices from "./SubnetIpDevices";
import myexport from "../UAM/assets/export.svg";
import ip from "./assets/ip.svg";
import subnet from "./assets/subnet.svg";
import devices from "./assets/devices.svg";
import Modal from "./AddIPAMModal";
import EditModal from "./EditIPAMModal";
import axios, { baseUrl } from "../../utils/axios";
import * as XLSX from "xlsx";

import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
} from "@ant-design/icons";

import {
  TableStyling,
  StyledImportFileInput,
  StyledButton,
  OnBoardStyledButton,
  AddAtomStyledButton,
  StyledExportButton,
  StyledInput,
  Styledselect,
  InputWrapper,
  StyledSubmitButton,
  StyledModalButton,
  ColStyling,
  AddStyledButton,
  TableStyle,
  SpinLoading,
  MainTableModal,
} from "../AllStyling/All.styled.js";

let excelData = [];
let columnFilters = {};

const index = () => {
  const [name, setName] = useState("");
  const [number, setNaumber] = useState("");
  const [myImg, setMyImg] = useState("");

  let [dataSource, setDataSource] = useState(excelData);

  const [Name, setSiteName] = useState("");

  const [myNumber, setMyNumber] = useState("");
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [privateLoading, setPrivateLoading] = useState(false);
  const [publicloading, setPublicLoading] = useState(false);
  const [mainTableloading, setMainTableLoading] = useState(false);
  const [mySubnetInformation, setMySubnetInformation] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const inputRef = useRef(null);
  const [mainModalVisible, setMainModalVisible] = useState(false);

  const [prvtSubnet, setPrvtSubnet] = useState([]);
  const [publicSubnet, setPublicSubnet] = useState([]);
  const [ipamCards, setIpamCard] = useState([]);

  const [configData, setConfigData] = useState(null);
  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
    console.log(JSON.parse(config));
  }, []);
  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllIpam");
        console.log("res IPAM", res);
        excelData = res.data;

        setDataSource(excelData);
        setRowCount(excelData.length);
        setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const showSubnetData = async (subnet) => {
    console.log("subnet", subnet);
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getSubnetInformation?subnet=${subnet}`
      );
      console.log("subnet data", res.data);
      setMySubnetInformation(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    const ipamCards = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/ipamCards");
        console.log("ipamCards", res.data);
        setIpamCard(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    ipamCards();
  }, []);

  useEffect(() => {
    const privateSubnets = async () => {
      setPrivateLoading(true);

      try {
        const res = await axios.get(baseUrl + "/privateSubnet");
        console.log("privateSubnet", res.data);
        setPrvtSubnet(res.data);
        setPrivateLoading(false);
      } catch (err) {
        console.log(err.response);
        setPrivateLoading(false);
      }
    };
    privateSubnets();
  }, []);

  useEffect(() => {
    const publicSubnets = async () => {
      setPublicLoading(true);

      try {
        const res = await axios.get(baseUrl + "/publicSubnet");
        console.log("publicSubnet", res.data);
        setPublicSubnet(res.data);
        setPublicLoading(false);
      } catch (err) {
        console.log(err.response);
        setPublicLoading(false);
      }
    };
    publicSubnets();
  }, []);
  // useEffect(() => {
  //   const dataCenterStatus = async () => {
  //     setLoading(true);

  //     try {
  //       const res = await axios.get(baseUrl + "/dataCentreStatus");
  //       console.log("dataCenterStatus", res);
  //       setDoughnutData(res.data);
  //     } catch (err) {
  //       console.log(err.response);
  //       setLoading(false);
  //     }
  //   };
  //   dataCenterStatus();
  // }, []);

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );
  // Alert
  // const openSweetAlert = (title, type) => {
  //   Swal.fire({
  //     title,
  //     type,
  //   });
  // };

  const postSeed = async (seed) => {
    setLoading(true);
    await axios
      .post(baseUrl + "/addSite", seed)
      .then((response) => {
        console.log("hahahehehoho");
        console.log(response.status);
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data?.response, "error");
          setLoading(false);
        } else {
          openSweetAlert("Site Added Successfully", "success");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllSites")
              .then((response) => {
                console.log("response===>", response);
                // setExcelData(response.data);

                console.log(response.data);
                console.log("asd", response);
                excelData = response?.data;
                setRowCount(response?.data?.length);
                setDataSource(response?.data);

                // console.log(response.data);

                // excelData = response.data;
                // setDataSource(excelData);

                // setRowCount(response.data.length);
                // setDataSource(response.data);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
              })
          );
          setLoading(false);
          return Promise.all(promises);
        }
      })
      .catch((err) => {
        // openSweetAlert("Something Went Wrong!", "danger");
        console.log("error ==> " + err);
        setLoading(false);
      });
  };

  const data = [
    {
      key: "1",
      subnet_name: "John Brown",
      space_used: "50",
      ip_available: "12:35:33",
      ip_used: 23,
    },
    {
      key: "2",
      subnet_name: "John Brown",
      space_used: "60",
      ip_available: "12:35:33",
      ip_used: 23,
    },
    {
      key: "3",
      subnet_name: "John Brown",
      space_used: "90",
      ip_available: "12:35:33",
      ip_used: 23,
    },
    {
      key: "4",
      subnet_name: "John Brown",
      space_used: "43",
      ip_available: "12:35:33",
      ip_used: 23,
    },
    {
      key: "5",
      subnet_name: "John Brown",
      space_used: "20",
      ip_available: "12:35:33",
      ip_used: 23,
    },
  ];

  const SubnetColumns = [
    {
      title: "Ip Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text) => (
        <p
          style={{
            // textAlign: "center",
            paddingTop: "10px",
            marginLeft: "20px",
            color: "#66B127",
            textDecoration: "underline",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <p
          style={{
            // textAlign: "center",
            paddingTop: "10px",
            marginLeft: "20px",
            // color: "#66B127",
            // textDecoration: "underline",
          }}
        >
          {text}
        </p>
      ),
    },
  ];

  const PrvtColumns = [
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text) => (
        <p
          onClick={() => showMainModal(text)}
          style={{
            // textAlign: "center",
            paddingTop: "10px",
            cursor: "pointer",
            marginLeft: "20px",
            color: "#66B127",
            textDecoration: "underline",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Subnet Mask",
      dataIndex: "subnet_mask",
      key: "subnet_mask",
      render: (text) => (
        <p
          style={{
            // textAlign: "center",
            marginLeft: "20px",
            paddingTop: "10px",
            // color: "#66B127",
            // textDecoration: "underline",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "IP % Space Used",
      dataIndex: "ip_percentage_used",
      key: "ip_percentage_used",
      render: (text) => (
        <div
          style={{
            // textAlign: "center",
            // marginLeft: "20px",
            marginTop: "-10px",
            paddingRight: "55px",
            paddingleft: "45px",
          }}
        >
          <Progress
            strokeColor="#66B127"
            percent={text}
            size="small"
            status="active"
          />
        </div>
      ),
    },

    {
      title: "IP Used",
      dataIndex: "ip_used",
      key: "ip_used",
      render: (text) => (
        <p
          style={{
            // textAlign: "center",
            paddingTop: "10px",
            marginLeft: "20px",
            // color: "#66B127",
            // textDecoration: "underline",
          }}
        >
          {text}
        </p>
      ),
    },
  ];

  const showMainModal = (subnet) => {
    setMainModalVisible(true);
    showSubnetData(subnet);
  };
  const handleMainOk = () => {
    setMainModalVisible(false);
  };

  const handleMainCancel = () => {
    setMainModalVisible(false);
  };
  const PublicColumns = [
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text) => (
        <p
          onClick={() => showMainModal(text)}
          style={{
            // textAlign: "center",
            paddingTop: "10px",
            cursor: "pointer",

            marginLeft: "20px",
            color: "#66B127",
            textDecoration: "underline",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Subnet Mask",
      dataIndex: "subnet_mask",
      key: "subnet_mask",
      render: (text) => (
        <p
          style={{
            // textAlign: "center",
            marginLeft: "20px",
            paddingTop: "10px",
            // color: "#66B127",
            // textDecoration: "underline",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "IP % Space Used",
      dataIndex: "ip_percentage_used",
      key: "ip_percentage_used",
      render: (text) => (
        <div
          style={{
            // textAlign: "center",
            // marginLeft: "20px",
            marginTop: "-10px",
            paddingRight: "55px",
            paddingleft: "45px",
          }}
        >
          <Progress
            strokeColor="#66B127"
            percent={text}
            size="small"
            status="active"
          />
        </div>
      ),
    },

    {
      title: "IP Used",
      dataIndex: "ip_used",
      key: "ip_used",
      render: (text) => (
        <p
          style={{
            // textAlign: "center",
            paddingTop: "10px",
            marginLeft: "20px",
            // color: "#66B127",
            // textDecoration: "underline",
          }}
        >
          {text}
        </p>
      ),
    },
  ];

  const column = [
    {
      title: "",
      key: "edit",
      width: "1%",

      render: (text, record) => (
        <>
          {!configData?.uam.pages.subboards.read_only ? (
            <>
              <a
                disabled
                // onClick={() => {
                //   edit(record);
                // }}
              >
                <EditOutlined
                  style={{ paddingRight: "50px", color: "#66A111" }}
                />
              </a>
            </>
          ) : (
            <a
              onClick={() => {
                edit(record);
              }}
            >
              <EditOutlined
                style={{ paddingRight: "50px", color: "#66A111" }}
              />
            </a>
          )}
        </>
      ),
    },

    {
      title: "region",
      dataIndex: "region",
      key: "region",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "region",
        "Region",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Site Name",
      dataIndex: "site_name",
      key: "site_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "site_name",
        "Site Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Device Name",
      dataIndex: "device_name",
      key: "device_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,
      ...getColumnSearchProps(
        "device_name",
        "Device Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Ip Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "ip_address",
        "Ip Address",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subnet Mask",
      dataIndex: "subnet_mask",
      key: "subnet_mask",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "subnet_mask",
        "Subnet Mask",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "subnet",
        "Subnet",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Protocol Status",
      dataIndex: "protocol_status",
      key: "protocol_status",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "protocol_status",
        "Protocol Status",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Admin Status",
      dataIndex: "admin_status",
      key: "admin_status",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "admin_status",
        "Admin Status",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "VLAN",
      dataIndex: "vlan",
      key: "vlan",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "vlan",
        "VLAN",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Interface Name",
      dataIndex: "interface_name",
      key: "interface_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "interface_name",
        "Interface Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "VLAN Name",
      dataIndex: "vlan_name",
      key: "vlan_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "vlan_name",
        "VLAN Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Virtual Ip",
      dataIndex: "virtual_ip",
      key: "virtual_ip",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "virtual_ip",
        "Virtual Ip",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "description",
        "Description",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "creation_date",
        "Creation Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Modification Date",
      dataIndex: "modification_date",
      key: "modification_date",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "modification_date",
        "Modification Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Management Ip",
      dataIndex: "management_ip",
      key: "management_ip",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "management_ip",
        "Management Ip",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Site Type",
      dataIndex: "site_type",
      key: "site_type",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "site_type",
        "Site Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const SecColumns = [
    {
      title: "Subnet Name",
      dataIndex: "subnet_name",
      key: "subnet_name",
      render: (text) => (
        <a
          style={{
            marginLeft: "20px",
            color: "#66B127",
            textDecoration: "underline",
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "IP % Space Used",
      dataIndex: "space_used",
      key: "space_used",
      render: (text) => (
        <div style={{ paddingRight: "55px", paddingleft: "45px" }}>
          <Progress
            strokeColor="#66B127"
            percent={50}
            size="small"
            status="active"
          />
        </div>
      ),
    },
    {
      title: "IP Available",
      dataIndex: "ip_available",
      key: "ip_available",
    },
    {
      title: "IP Used",
      dataIndex: "ip_used",
      key: "ip_used",
    },

    // {
    //   title: "",
    //   key: "edit",
    //   width: "2%",

    //   render: (text, record) => (
    //     <a>
    //       <EditOutlined
    //         style={{ paddingRight: "50px" }}
    //         // onClick={() => {
    //         //   edit(record);
    //         // }}
    //       />
    //     </a>
    //   ),
    // },
    // {
    //   title: "Subnet Name",
    //   dataIndex: "subnet_name",
    //   key: "subnet_name",

    //   ...getColumnSearchProps(
    //     "subnet_name",
    //     "Subnet Name",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    // {
    //   title: "IP % Space Used",
    //   dataIndex: "space_used",
    //   key: "space_used",

    //   ...getColumnSearchProps(
    //     "space_used",
    //     "IP % Space Used",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    // {
    //   title: "IP Available",
    //   dataIndex: "ip_available",
    //   key: "ip_available",

    //   ...getColumnSearchProps(
    //     "ip_available",
    //     "IP Available",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    // {
    //   ...getColumnSearchProps(
    //     "ip_used",
    //     "IP Used",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
  ];

  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.ipam.pages.ipam.read_only,
    }),
  };
  const exportSeed = async () => {
    if (excelData.length > 0) {
      jsonToExcel(dataSource);
      openNotification();
    } else {
      openSweetAlert("No Data Found!", "info");
    }
  };
  const jsonToExcel = (atomData) => {
    let wb = XLSX.utils.book_new();
    let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
    XLSX.utils.book_append_sheet(wb, binaryAtomData, "ipam");
    XLSX.writeFile(wb, "ipam.xlsx");
    // setExportLoading(false);
  };
  const openNotification = () => {
    notification.open({
      message: "File Exported Successfully",
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  // const postSeed = async (seed) => {
  //   setLoading(true);
  //   await axios
  //     .post(baseUrl + "/addAtomDevices", seed)
  //     .then((response) => {
  //       console.log("hahahehehoho");
  //       console.log(response.status);
  //       if (response?.response?.status == 500) {
  //         openSweetAlert(response?.response?.data?.response, "error");
  //         setLoading(false);
  //       } else {
  //         openSweetAlert("Atom Added Successfully", "success");
  //         const promises = [];
  //         promises.push(
  //           axios
  //             .get(baseUrl + "/getAtoms")
  //             .then((response) => {
  //               // console.log("response===>", response);
  //               // setExcelData(response.data);

  //               console.log(response.data);
  //               excelData = response?.data;
  //               setRowCount(response?.data?.length);
  //               setDataSource(response?.data);

  //               console.log(response.data);

  //               excelData = response.data;
  //               setDataSource(excelData);

  //               setRowCount(response.data.length);
  //               setDataSource(response.data);
  //               setLoading(false);
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //               setLoading(false);
  //             })
  //         );
  //         setLoading(false);
  //         return Promise.all(promises);
  //       }
  //     })
  //     .catch((err) => {
  //       // openSweetAlert("Something Went Wrong!", "danger");
  //       console.log("error ==> " + err);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   const serviceCalls = async () => {
  //     setLoading(true);

  //     try {
  //       const res = await axios.get(baseUrl + "/getAllSites");
  //       excelData = res.data;
  //       setDataSource(excelData);
  //       setRowCount(excelData.length);
  //       setLoading(false);
  //     } catch (err) {
  //       console.log(err.response);
  //       setLoading(false);
  //     }
  //   };
  //   serviceCalls();
  // }, []);

  const convertToJson = (headers, fileData) => {
    let rows = [];
    fileData.forEach((row) => {
      const rowData = {};
      row.forEach((element, index) => {
        rowData[headers[index]] = element;
      });
      rows.push(rowData);
    });
    rows = rows.filter((value) => JSON.stringify(value) !== "{}");
    return rows;
  };
  // useEffect(() => {
  //   inputRef.current.addEventListener("input", importExcel);
  // }, []);

  const showModal = () => {
    setEditRecord(null);
    setAddRecord(null);
    setIsModalVisible(true);
  };
  const showEditModal = () => {
    setIsModalVisible(true);
  };
  const edit = (record) => {
    setEditRecord(record);
    // setAddRecord(record);
    setIsEditModalVisible(true);
  };
  const imgFun = (myimg) => {
    if (myimg === "Total Subnets") {
      return subnet;
    } else if (myimg === "Total Devices") {
      return devices;
    } else {
      return ip;
    }
  };
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div style={{ backgroundColor: "#FFFFFF", height: "100%" }}>
        <Row
          style={{
            padding: "10px",
            marginTop: "5px",
            marginRight: "15px",
            marginLeft: "15px",
          }}
        >
          <Col
            // span={3}
            xs={{ span: 6 }}
            md={{ span: 6 }}
            lg={{ span: 6 }}
            // xl={{ span: 2 }}
          >
            <SpinLoading spinning={loading}>
              <div style={{ marginRight: "10px" }}>
                <div style={{ marginBottom: "6px" }}>
                  {ipamCards.map((item, index) => (
                    <div key={index} style={{ marginBottom: "5px" }}>
                      <SubnetIpDevices
                        style={{ marginBottom: "15px" }}
                        Name={item.name}
                        myImg={imgFun(item.name)}
                        number={item.value}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SpinLoading>
            {/* <div style={{ marginRight: "10px" }}>
              <div style={{ marginBottom: "6px" }}>
                <SubnetIpDevices
                  myImg={subnet}
                  name={"Total Subnet"}
                  number={350}
                />
              </div> */}
            {/* <div style={{ marginBottom: "6px" }}>
                <SubnetIpDevices myImg={ip} name={"Total IPs"} number={50} />
              </div>
              <SubnetIpDevices
                myImg={devices}
                name={"Total Deevices"}
                number={950}
              />
            </div> */}
          </Col>
          <Col
            // span={3}
            xs={{ span: 18 }}
            md={{ span: 18 }}
            lg={{ span: 18 }}
            // xl={{ span: 2 }}
          >
            <div>
              <div
                style={{
                  // display: "flex",
                  // marginRight: "5px",
                  // margin: "2px",
                  // border: '1px solid',
                  // paddingTop: '15px',
                  height: "100%",
                  // marginRight: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#fcfcfc",
                  marginBottom: "5px",
                }}
              >
                <h3
                  style={{
                    color: "#000",
                    borderLeft: "3px solid #3D9E47",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "10px",
                    alignItems: "center",
                    // marginLeft: '-6px',
                    paddingTop: "4px",
                    fontWeight: "bold",
                    paddingBottom: "0px",
                    marginBottom: "0px",
                  }}
                >
                  Private Subnets
                </h3>
                <SpinLoading spinning={privateLoading}>
                  <TableStyle
                    pagination={{
                      defaultPageSize: 5,
                      //   showSizeChanger: true,
                      //   pageSizeOptions: ["10", "20", "30"],
                    }}
                    columns={PrvtColumns}
                    // dataSource={dataSource}
                    dataSource={prvtSubnet}
                    // pagination={false}
                    style={{ width: "100%" }}
                  />
                </SpinLoading>
              </div>
              <div
                style={{
                  // display: "flex",
                  marginRight: "5px",
                  // margin: "2px",
                  // border: '1px solid',
                  // paddingTop: '15px',
                  height: "100%",
                  marginRight: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#fcfcfc",
                  marginBottom: "5px",
                }}
              >
                <h3
                  style={{
                    color: "#000",
                    borderLeft: "3px solid #3D9E47",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "10px",
                    alignItems: "center",
                    // marginLeft: '-6px',
                    paddingTop: "4px",
                    fontWeight: "bold",
                    paddingBottom: "0px",
                    marginBottom: "0px",
                  }}
                >
                  Public Subnets
                </h3>
                <SpinLoading spinning={publicloading}>
                  <TableStyle
                    pagination={{
                      defaultPageSize: 5,
                      //   showSizeChanger: true,
                      //   pageSizeOptions: ["10", "20", "30"],
                    }}
                    columns={PublicColumns}
                    // dataSource={dataSource}
                    dataSource={publicSubnet}
                    // pagination={false}
                    style={{ width: "100%" }}
                  />
                </SpinLoading>
              </div>
            </div>
          </Col>
        </Row>
        <MainTableModal
          width={"75%"}
          title="Subnet Information"
          open={mainModalVisible}
          // closable={false}
          footer={false}
          onOk={handleMainOk}
          onCancel={handleMainCancel}
          style={{ padding: "0px !important" }}
        >
          <SpinLoading spinning={loading}>
            <TableStyle
              // style={{ marginTop: "-5px" }}
              columns={SubnetColumns}
              pagination={{ pageSize: 10 }}
              dataSource={mySubnetInformation}
              // style={{ padding: "0px" }}
            />
          </SpinLoading>
        </MainTableModal>
        <div style={{ padding: "15px" }}>
          <div style={{ float: "left" }}>
            <AddStyledButton
              onClick={showModal}
              style={{ display: "none" }}
              disabled={!configData?.ipam.pages.ipam.read_only}
            >
              + Add IPAM
            </AddStyledButton>
            <div style={{ display: "flex", marginTop: "3px" }}>
              <h3
                style={{
                  marginLeft: "10px",
                  // float: "right",
                  marginRight: "20px",
                  fontWeight: "bold",
                }}
              >
                Col : 12
              </h3>
              <h3
                style={{
                  marginLeft: "10px",
                  // float: "right",
                  marginRight: "20px",
                  fontWeight: "bold",
                }}
              >
                Row :{rowCount}
              </h3>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              float: "right",
              marginRight: "15px",
            }}
          >
            <StyledExportButton
              onClick={exportSeed}
              style={{
                // float: 'right',
                paddingTop: "4px",
              }}
            >
              <img src={myexport} alt="" width="18px" height="18px" />
              &nbsp; Export
            </StyledExportButton>
          </div>
        </div>
        {isModalVisible && (
          <Modal
            style={{ padding: "0px" }}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            dataSource={dataSource}
            setDataSource={setDataSource}
            excelData={excelData}
            setRowCount={setRowCount}
            // editRecord={editRecord}
            addRecord={addRecord}
            centered={true}
          />
        )}
        {isEditModalVisible && (
          <EditModal
            style={{ padding: "0px" }}
            isEditModalVisible={isEditModalVisible}
            setIsEditModalVisible={setIsEditModalVisible}
            dataSource={dataSource}
            setDataSource={setDataSource}
            excelData={excelData}
            setRowCount={setRowCount}
            editRecord={editRecord}
            centered={true}
          />
        )}
        <SpinLoading spinning={mainTableloading} tip="Loading...">
          <div style={{ padding: "25px" }}>
            <TableStyling
              rowSelection={rowSelection}
              scroll={{ x: 4000 }}
              rowKey="ip_address"
              columns={column}
              dataSource={dataSource}
              // pagination={false}
              style={{ width: "100%", padding: "2%" }}
            />
          </div>
        </SpinLoading>

        <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
          <img src={message} alt="" />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default index;
