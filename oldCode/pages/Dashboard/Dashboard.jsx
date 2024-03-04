import React, { useState, useRef, useEffect } from "react";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import GridLayout from "react-grid-layout";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";

import {
  BoardsIcon,
  DeviceIcon,
  LicenseIcon,
  LocationIcon,
  RackIcon,
  SfpsIcon,
  SwitchesIcon,
} from "../../svg";
import Container from "../../components/ReusableComponents/Container/Container";
import axios, { baseUrl } from "../../utils/axios/index";
import {
  PieChart,
  HorizontalBarChart,
  BarChartBold,
} from "../../components/ReusableComponents/Carts";
import { Progress } from "antd";
import { CustomModal, Table } from "../../components/ReusableComponents";
import {
  DashboardStyle,
  DevicesPerGlobalStyle,
  MenusWrapperStyle,
  RackDetailsModelStyle,
  RackDetailsStyle,
} from "./Dashboard.style";

const RockDetails = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [rackDetails, setRackDetails] = useState([]);

  useEffect(() => {
    const allRacks = async () => {
      try {
        const res = await axios.get(baseUrl + "/allRacks");
        setData(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    allRacks();
  }, []);

  const showRackDetail = async (record) => {
    try {
      const res = await axios.get(
        `${baseUrl}/getRackByRackName?rackname=${record}`
      );
      setRackDetails(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const showModal = (index) => {
    showRackDetail(index);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <RackDetailsStyle>
      <Container title="Rack Details" className="racks-list">
        {data?.map((item, index) => {
          return (
            <article
              key={index}
              className="rack-item"
              onClick={() => showModal(item)}
            >
              {item}
            </article>
          );
        })}
      </Container>

      <CustomModal
        open={isModalVisible}
        footer={null}
        title="Rack Detials"
        onCancel={handleCancel}
        className="rack-details-model"
      >
        <RackDetailsModelStyle>
          <article className="racks-details-wrapper">
            <article className="row">
              <h3>Rack Name </h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.rack_name}</h3>
            </article>
            <article className="row">
              <h3>Site Name</h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.site_name}</h3>
            </article>
            <article className="row">
              <h3>Serial Number </h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.rack_name}</h3>
            </article>
            <article className="row">
              <h3>Manufacturer Date</h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.manufacturer_date}</h3>
            </article>
            <article className="row">
              <h3>Creation Date</h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.creation_date}</h3>
            </article>
            <article className="row">
              <h3>Modification Date</h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.modification_date}</h3>
            </article>
            <article className="row">
              <h3>Status </h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.status}</h3>
            </article>
            <article className="row">
              <h3>RU</h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.ru}</h3>
            </article>
            <article className="row">
              <h3>Height</h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.height}</h3>
            </article>
            <article className="row">
              <h3>Width</h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.width}</h3>
            </article>
            <article className="row">
              <h3>Brand</h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.brand}</h3>
            </article>
            <article className="row">
              <h3>Rack Modal</h3>
              <h3> : </h3>
              <h3> {rackDetails[0]?.rack_model}</h3>
            </article>
          </article>

          <article className="button-wrapper">
            <button className="ok-btn" onClick={handleOk}>
              OK
            </button>
          </article>
        </RackDetailsModelStyle>
      </CustomModal>
    </RackDetailsStyle>
  );
};

const DevicesPerGlobal = () => {
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    const phyLeaflet = async () => {
      try {
        const res = await axios.get(baseUrl + "/phyLeaflet");
        setMapData(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    phyLeaflet();
  }, []);

  const mapRef = useRef();

  return (
    <DevicesPerGlobalStyle>
      <Container title="Devices per Global">
        <MapContainer
          minZoom={1.5}
          maxZoom={18}
          center={[60.505, 100.09]}
          zoom={0}
          ref={mapRef}
          style={{ borderRadius: "8px" }}
        >
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" />

          {mapData?.map((item, index) => (
            <div key={index}>
              <Marker position={[`${item.latitude}`, `${item.longitude}`]}>
                <Tooltip>
                  {item.site_name}
                  <br />
                  {item.city}
                </Tooltip>
              </Marker>
            </div>
          ))}
        </MapContainer>
      </Container>
    </DevicesPerGlobalStyle>
  );
};

const MenusWrapper = () => {
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);

  useEffect(() => {
    getRouting();
  }, []);

  const getRouting = async () => {
    try {
      const res = await axios.get(baseUrl + "/dashboardCards");
      setMenus(res.data);
    } catch (err) {
      console.log(err.response);
    }
  };

  const pages = (pageName) => {
    if (pageName === "SITES") {
      navigate("/uam/sites");
    } else if (pageName === "RACKS") {
      navigate("/uam/racks");
    } else if (pageName === "DEVICES") {
      navigate("/uam/devices");
    } else if (pageName === "MODULES") {
      navigate("/uam/module");
    } else if (pageName === "SS") {
      navigate("/uam/stackswitches");
    } else if (pageName === "SFPs") {
      navigate("/uam/sfps");
    } else if (pageName === "LICENSES") {
      navigate("/uam/license");
    } else if (pageName === "APs") {
      navigate("/uam/aps");
    }
  };

  const icon = (myimg) => {
    if (myimg === "SITES") {
      return <LocationIcon />;
    } else if (myimg === "RACKS") {
      return <RackIcon />;
    } else if (myimg === "DEVICES") {
      return <DeviceIcon />;
    } else if (myimg === "BOARDS") {
      return <BoardsIcon />;
    } else if (myimg === "MODULES") {
      return <BoardsIcon />;
    } else if (myimg === "SFPs") {
      return <SfpsIcon />;
    } else if (myimg === "LICENSES") {
      return <LicenseIcon />;
    } else if (myimg === "APs") {
      return <SwitchesIcon />;
    } else {
      return <LicenseIcon />;
    }
  };
  return (
    <MenusWrapperStyle>
      <article className="menus">
        {menus &&
          menus.map((item, index) => {
            return (
              <article
                key={index}
                onClick={() => pages(item.name)}
                className="tab"
              >
                <span className="icon">{icon(item.name)}</span>
                <article>
                  <p>{item.name}</p>
                  <h2>{item.value}</h2>
                </article>
              </article>
            );
          })}
      </article>
    </MenusWrapperStyle>
  );
};

function Dashboard() {
  const columns = [
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text, record) => (
        <p
          onClick={() => {
            navigate("/ipam/subnet/ip-details", {
              state: {
                subnet: text,
              },
            });
          }}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            fontWeight: "400",
            paddingLeft: "12px",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "IP % Space Used",
      dataIndex: "space_usage",
      key: "space_usage",
      render: (text) => (
        <div
          style={{
            marginTop: "-10px",
            paddingRight: "75px",
            paddingLeft: "15px",
          }}
        >
          {text <= 60 ? (
            <Progress
              strokeColor="#66B127"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
          {text > 60 && text <= 80 ? (
            <Progress
              strokeColor="#F57A40"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}

          {text > 80 && text <= 100 ? (
            <Progress
              strokeColor="#CC050C"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
        </div>
      ),
    },
  ];

  const cpuColumns = [
    {
      title: "Ip Address",
      dataIndex: "ip_address",
      key: "ip_address",
    },
    {
      title: "Device Name",
      dataIndex: "device_name",
      key: "device_name",
    },

    {
      title: "CPU Utilization",
      dataIndex: "cpu",
      key: "cpu",
      render: (text) => (
        <div
          onClick={() => {
            console.log(text);
          }}
          style={{
            // textAlign: "center",
            // marginLeft: "20px",
            marginTop: "-10px",
            paddingRight: "25px",
            paddingLeft: "15px",
          }}
        >
          {text <= 60 ? (
            <Progress
              strokeColor="#66B127"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
          {text > 60 && text <= 80 ? (
            <Progress
              strokeColor="#F57A40"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}

          {text > 80 && text <= 100 ? (
            <Progress
              strokeColor="#CC050C"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
        </div>
      ),
    },
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
    },
  ];

  const memoryColumns = [
    {
      title: "Ip Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          onClick={async () => {
            const res = await axios.post(
              baseUrl + "/getMonitoringDevicesCards ",
              { ip_address: text }
            );

            navigate("/monitoringsummary/main", {
              state: {
                ip_address: text,
                res: res.data,
              },
            });
          }}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            textAlign: "left",
            paddingLeft: "10px",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Device Name",
      dataIndex: "device_name",
      key: "device_name",
      render: (text, record) => (
        <p
          style={{
            textAlign: "left",
            paddingLeft: "10px",
          }}
        >
          {text}
        </p>
      ),
    },

    {
      title: "Memory Utilization",
      dataIndex: "memory",
      key: "memory",
      render: (text) => (
        <div
          onClick={() => {
            console.log(text);
          }}
          style={{
            paddingRight: "25px",
            paddingLeft: "15px",
          }}
        >
          {text <= 60 ? (
            <Progress
              strokeColor="#66B127"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
          {text > 60 && text <= 80 ? (
            <Progress
              strokeColor="#F57A40"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}

          {text > 80 && text <= 100 ? (
            <Progress
              strokeColor="#CC050C"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
        </div>
      ),
    },
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
    },
  ];

  const layout = [
    { i: "a", x: 0, y: 0, w: 3, h: 10 },
    { i: "b", x: 3, y: 0, w: 3, h: 10 },
    { i: "c", x: 6, y: 0, w: 3, h: 10 },
    { i: "d", x: 0, y: 10, w: 5, h: 15 },
    { i: "e", x: 5, y: 20, w: 4, h: 7.5 },
    { i: "f", x: 9, y: 30, w: 4, h: 7.5 },
    { i: "g", x: 0, y: 40, w: 5, h: 12, minW: 5, minH: 12 },
    { i: "h", x: 5, y: 40, w: 4, h: 12 },
  ];

  return (
    <DashboardStyle>
      <MenusWrapper />

      <article className="dashboard-content">
        <GridLayout
          className="layout"
          layout={layout}
          cols={9}
          rowHeight={30}
          width={1440}
        >
          <article key="a">
            <Container title="Count Per Vendor" className="content-wrapper">
              <HorizontalBarChart endPoint="getVendorsCount" />
            </Container>
          </article>
          <article key="b">
            <Container
              title="Top Vendor For Discovery"
              className="content-wrapper"
            >
              <PieChart endPoint="getTopVendorsForDiscovery" />
            </Container>
          </article>

          <article key="c">
            <Container title="TCP Open Ports" className="content-wrapper">
              <BarChartBold endPoint="topOpenPorts" />
            </Container>
          </article>

          <article key="d">
            <Container
              title="Top Subnets by % IP Address Used"
              className="content-wrapper"
            >
              <Table
                pagination="10"
                endPoint="topTenSubnetsPercentage"
                columns={columns}
              />
            </Container>
          </article>
          <article key="e">
            <Container
              title="Top Devices by CPU Utilization"
              className="content-wrapper"
            >
              <Table
                endPoint="getCpuDashboard"
                columns={cpuColumns}
                pagination={false}
              />
            </Container>
          </article>
          <article key="f">
            <Container
              title="Devices By Memory Utilization"
              className="content-wrapper"
            >
              <Table
                endPoint="getMemoryDashboard"
                columns={memoryColumns}
                pagination="5"
              />
            </Container>
          </article>
          <article key="g">
            <DevicesPerGlobal />
          </article>
          <article key="h">
            <RockDetails />
          </article>
        </GridLayout>
      </article>
    </DashboardStyle>
  );
}

export default Dashboard;
