import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import axios, { baseUrl } from "../../../../utils/axios";

const Mynew = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Data, setData] = useState(null);

  const showModal = (index) => {
    setIsModalVisible(true);
    setData(index);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    const allRacks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/allRacks");
        console.log("allRacks", res);
        // setData(res.data);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    allRacks();
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        height: "65px",
        borderBottom: "1px solid",
        backgroundColor: "#66B127",
        width: "85px",
        color: "#fff",
        borderRadius: "8px",
        paddingTop: "18px",
        margin: "2px",
      }}
      onClick={() => showModal(index)}
    >
      <p>{props.name}</p>
    </div>
  );
};

export default Mynew;
