import React, { useEffect, useState } from "react";
import { Select } from "antd";

import axios, { baseUrl } from "../../../utils/axios/index";
import { CustomModal, CustomInput } from "../../ReusableComponents";
import { PasswordGroupModalStyle } from "./PasswordGroupModal.style";
import { ResponseModel } from "../../ReusableComponents/ResponseModel/ResponseModel";
import { Button, Row, Col} from "antd";
import PasswordGroupModalV from "./PasswordGroupModelV"



function PasswordGroupModel(props) {
  const { isModalOpen, setIsModalOpen, editRecord } = props;
  const [option, setOption] = useState("SSH");
  const [loading, setLoading] = useState(false);
  const [isEdit, setEdit] = useState(false);

  const [adddRecord, setAdddRecord] = useState(null);

  const [edditRecord, setEdditRecord] = useState(null);

  const [isModalVisible, setIsModalVisible]= useState(false)

  const [passwordGroupInput, setPasswordGroupInput] = useState({
    passwordGroup: "",
    username: "",
    secretPassword: "",
    password: "",
  });

  useEffect(() => {
    if (editRecord) {
      setPasswordGroupInput({
        passwordGroup: editRecord.password_group,
        username: editRecord.username,
        secretPassword: editRecord.secret_password,
        password: editRecord.password,
      });
      setOption(editRecord.password_group_type);
      setEdit(true);
    }
  }, [editRecord]);

  useEffect(() => {
    if (isModalOpen === false) {
      setPasswordGroupInput({
        passwordGroup: "",
        username: "",
        secretPassword: "",
        password: "",
      });

      setEdit(false);
    }
  }, [isModalOpen]);

  const { passwordGroup, username, secretPassword, password } =
    passwordGroupInput;

  const handleInput = (e) => {
    setPasswordGroupInput({
      ...passwordGroupInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (option) => {
    setOption(option);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await axios
      .post(`${baseUrl}/${isEdit ? "editPasswordGroup" : "addPasswordGroup"}`, {
        password_group: passwordGroup,
        password_group_type: option,
        password: password,
        username: username,
        secret_password: secretPassword,
      })
      .then((res) => {
        if (res.status == 200) {
          ResponseModel(res?.data, "success");
          setLoading(false);
          setIsModalOpen(false);

          setPasswordGroupInput({
            passwordGroup: "",
            username: "",
            secretPassword: "",
            password: "",
          });
        } else {
          setLoading(false);
          ResponseModel(res?.response?.data, "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const showModall = () => {
    
    
    setEddittRecord(null);
    setAdddRecord(null);
    setIsModalVisible(true);
    console.log("working")
    console.log(isModalVisible)
  };

  /*const modalActions = () => {
   setIsModalVisible(true)
   console.log(isModalVisible)
   console.log("working")
  
  }*/


  return (
    <CustomModal style={{ color: "Black" }}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      footer={null}
      title={isEdit ? "Edit Password Group" : "Add Password Group"}
    >
      <PasswordGroupModalStyle onSubmit={handleSubmit}>

        <Row>
          <Col span={11}>
          <CustomInput
          title="Password Group"
          required
          className="form-content"
          name="passwordGroup"
          value={passwordGroup}
          onChange={handleInput}
          readOnly={isEdit}
        />
          
          </Col>
          <Col span={11} style={{marginLeft:"15px"}}>
          
        <CustomInput
          title="Password Group Type"
          required
          className="form-content"
        >
          <Select
            onChange={handleChange}
            value={option}
            options={[
              {
                value: "SSH",
                label: "SSH",
              },
              {
                value: "Telnet",
                label: "Telnet",
              },
            ]}
          />
        </CustomInput>
          
          </Col>
        </Row>
      <Row>
       <Col span={11}>
       {option == "SSH" ? (
          <CustomInput
            title="Username"
            required
            className="form-content"
            name="username"
            value={username}
            onChange={handleInput}
          />
        ) : (
          <CustomInput
            title="Secret Password"
            required
            className="form-content"
            name="secretPassword"
            value={secretPassword}
            onChange={handleInput}
          />
        )}
       </Col>
 <Col span={11} style={{marginLeft:"15px"}}>
 <CustomInput 
          title="Password"
          required
          className="form-content"
          name="password"
          value={password}
          onChange={handleInput}
        /> 
       </Col>

      </Row>

       

      
        
              
           
        <Row>
          <Col span={10} >
          <Button style={{ padding:"5px",color:"white", marginLeft:"9rem",width: "10rem",height:"2.5rem" , backgroundColor: "#66b127", borderRadius:"8px"}}
             
              className="add-btn"
              
               > Add </Button>
           
          </Col>



          

        </Row>
        <PasswordGroupModalV 
          isModalOpen={isModalVisible}
        setIsModalOpen={setIsModalVisible}
        editRecord={editRecord}
         />

      </PasswordGroupModalStyle>
    </CustomModal>
  );
}

export default PasswordGroupModel;
