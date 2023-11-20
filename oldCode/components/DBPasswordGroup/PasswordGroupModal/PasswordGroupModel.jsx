import React, { useEffect, useState } from "react";
import { Select } from "antd";

import axios, { baseUrl } from "../../../utils/axios/index";
import { CustomModal, CustomInput } from "../../ReusableComponents";
import { PasswordGroupModalStyle } from "./PasswordGroupModal.style";
import { ResponseModel } from "../../ReusableComponents/ResponseModel/ResponseModel";
import { Button, Row, Col} from "antd";
import PasswordGroupModalV from "./PasswordGroupModelV";
import PasswordGroupModalVV from "./PasswordGroupModelVV";


function PasswordGroupModel(props) {
  const { isModalOpen, setIsModalOpen, editRecord } = props;
  const [option, setOption] = useState("SSH");
  const [loading, setLoading] = useState(false);
  const [isEdit, setEdit] = useState(false);

  const [adddRecord, setAdddRecord] = useState(null);

  const [edditRecord, setEdditRecord] = useState(null);

  const [isModalVisible, setIsModalVisible]= useState(false)

  const [addddRecord, setAddddRecord] = useState(null)
  const[edittRecord, setEdittRecord] = useState(null)
  const [isModalVisiblee, setIsModalVisiblee] = useState(false)


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
    
    
    setEdditRecord(null);
    setAdddRecord(null);
    setIsModalVisible(true);
    console.log("working")
    console.log(isModalVisible)
  };

  const showModalll = ()=>{
    setEdittRecord(null);
    setAddddRecord(null);
    setIsModalVisiblee(true);
    console.log("working")
    console.log(isModalVisible)
  }

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
          <Col span={10} >
          <Button style={{ padding:"5px",color:"white", width: "10rem",height:"2.5rem" , backgroundColor: "#66b127", borderRadius:"8px"}}
             
              className="add-btn"
              
              onClick= {showModall} >Version 1 / Version 2</Button>
           
          </Col>

          <Col span={10} >
          <Button  style={{ padding:"5px",color:"white", width: "10rem",height:"2.5rem" , backgroundColor: "#66b127", borderRadius:"8px"}}
             
             className="add-btn"
             
             onClick= {showModalll} >Version 3</Button>
          </Col>

          <Col span={8} >
          <Button  style={{marginTop:"1rem", padding:"5px",color:"white", width: "10rem",height:"2.5rem" , backgroundColor: "#66b127", borderRadius:"8px"}}
             
             className="add-btn"
             
             onClick= {showModalll} >WMI</Button>
          </Col>


          

        </Row>
        <PasswordGroupModalV 
          isModalOpen={isModalVisible}
        setIsModalOpen={setIsModalVisible}
        editRecord={editRecord}
         />

         <PasswordGroupModalVV
          isModalOpen={isModalVisiblee}
          setIsModalOpen={setIsModalVisiblee}
          editRecord={edittRecord}
         />
        
      </PasswordGroupModalStyle>
    </CustomModal>
  );
}

export default PasswordGroupModel;
