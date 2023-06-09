import React, { useState, useRef } from "react";
import { Button, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { InputFieldIcon, InputField } from "./Input.Styled.js";
import { useEffect } from "react";
import "../App.css";
const ColumnHeader = ({
  dataIndex,
  title,
  setRowCount,
  setDataSource,
  excelData,
  columnFilters,
}) => {
  const [searchText, setSearchText] = useState(null);
  // const elementRef = useRef();
  // useEffect(() => {
  //   const a = elementRef.current.value;
  //   console.log(a); // logs <div>I'm an element</div>
  // }, []);

  // const handleColumnInput = (e) => {
  //   console.log("Test&&&&");
  //   console.log("Data Index", dataIndex, typeof dataIndex);
  //   console.log("Title", title, typeof title);
  //   // setSearchText(e.target.value);
  //   console.log("hello");
  //   // if (columnFilters !== "") {
  //   //   columnFilters[dataIndex];
  //   // } else
  //   if (dataIndex in columnFilters) {
  //     if (e.target.value.length > 0) {
  //       columnFilters[dataIndex] = e.target.value;
  //       console.log(columnFilters[dataIndex]);
  //     } else delete columnFilters[dataIndex];
  //   } else {
  //     columnFilters[dataIndex] = e.target.value;
  //   }
  //   let filteredSuggestions = excelData;
  //   console.log(e.target.value);
  //   console.log(dataIndex);
  //   console.log("col", columnFilters);
  //   // const abc = columnFilters;

  //   for (const [key, value] of Object.entries(columnFilters)) {
  //     filteredSuggestions = filteredSuggestions.filter(
  //       (d) =>
  //         JSON.stringify(d[key])
  //           .replace(" ", "")
  //           .toLowerCase()
  //           .indexOf(value.replace(" ", "").toLowerCase()) > -1
  //     );
  //   }
  //   // console.log(Object.entries(columnFilters));
  //   setRowCount(filteredSuggestions.length);
  //   setDataSource(filteredSuggestions);
  // };


  const handleColumnInput = (e) => {
    console.log("Test&&&&");
    console.log("Data Index", dataIndex, typeof dataIndex);
    console.log("Title", title, typeof title);
    console.log("hello");
  
    if (dataIndex in columnFilters) {
      if (e.target.value.length > 0) {
        columnFilters[dataIndex] = e.target.value;
        console.log(columnFilters[dataIndex]);
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
  
    // Clear the input field
    e.target.value = "";
  };
  
  




  return (
    <div style={{ margin: "0  auto" }}>
      <div
        style={{
          textAlign: "center",
        }}
      >
        {/* <div>{title}</div> */}
        <InputField
          // ref={elementRef}
          // className="custom-input"
          id="textFiledTest"
          placeholder={title}
          suffix={<SearchOutlined style={{ color: "rgba(0,0,0,0.5)" }} />}
          // prefix={<InputFieldIcon style={{ color: "rgba(0,0,0,0.5)" }} />}
          style={{
            height: "25px",
            borderRadius: "5px",
            marginTop: "5px",
            // overflow: "hidden",
            // outline: "none",
            // boxShadow: "none",
            // overflow: "none",

            // width: "70%",
            margin: "0 auto",
          }}
          // value={columnFilters[dataIndex]}
          // onKeyUp={debounce(handleColumnInput, 750)}
          // onChange={debounce(750, handleColumnInput)}
          onChange={handleColumnInput}
        />
      </div>
    </div>
  );
};

// export const filterEntered = (
//   dataIndex,
//   title,
//   setRowCount,
//   setDataSource,
//   excelData,
//   columnFilters,
// ) => {
//   let filteredSuggestions = excelData;
//   for (const [key, value] of Object.entries(columnFilters)) {
//     filteredSuggestions = filteredSuggestions.filter(
//       (d) =>
//         JSON.stringify(d[key])
//           .replace(" ", "")
//           .toLowerCase()
//           .indexOf(value.replace(" ", "").toLowerCase()) > -1
//     );
//   }
//   // console.log(Object.entries(columnFilters));
//   setRowCount(filteredSuggestions.length);
//   setDataSource(filteredSuggestions);
// };

export const columnSearch = (
  searchText,
  setSearchText,
  searchedColumn,
  setSearchedColumn
) => {
  //-------------------------------------------------------------------------------------------
  let searchInput = null;
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
    // filterDropdown: ({
    //   setSelectedKeys,
    //   selectedKeys,
    //   confirm,
    //   clearFilters,
    // }) => (
    //   <div style={{ padding: 8, marginTop: "-225px" }}>
    //     <Input
    //       ref={(node) => {
    //         searchInput = node;
    //       }}
    //       placeholder={`Search ${dataIndex}`}
    //       value={selectedKeys[0]}
    //       onChange={(e) =>
    //         setSelectedKeys(e.target.value ? [e.target.value] : [])
    //       }
    //       onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
    //       style={{ marginBottom: 8, display: "block" }}
    //     />
    //     <Space>
    //       <Button
    //         type="primary"
    //         onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
    //         icon={<SearchOutlined />}
    //         size="small"
    //         style={{ width: 90 }}
    //       >
    //         Search
    //       </Button>
    //       <Button
    //         onClick={() => handleReset(clearFilters)}
    //         size="small"
    //         style={{ width: 90 }}
    //       >
    //         Reset
    //       </Button>
    //       <Button
    //         type="link"
    //         size="small"
    //         onClick={() => {
    //           confirm({ closeDropdown: false });
    //           setSearchText(selectedKeys[0]);
    //           setSearchedColumn(dataIndex);
    //         }}
    //       >
    //         Filter
    //       </Button>
    //     </Space>
    //   </div>
    // ),

    // filterIcon: (filtered) => (
    //   <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    // ),

    // onFilter: (value, record) =>
    //   record[dataIndex]
    //     ? record[dataIndex]
    //         .toString()
    //         .toLowerCase()
    //         .includes(value.toLowerCase())
    //     : "",

    // onFilterDropdownVisibleChange: (visible) => {
    //   if (visible) {
    //     setTimeout(() => searchInput.select(), 100);
    //   }
    // },

    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  return getColumnSearchProps;
  //-------------------------------------------------------------------------------------------
};
