import * as XLSX from "xlsx";

export function getPathLastSegment() {
  const path = window.location.pathname;
  const segments = path.split("/");
  return segments[segments.length - 1];
}

export function getPathSecondSegment() {
  const path = window.location.pathname;
  const segments = path.split("/");
  return segments[1];
}

export function getTitle(dataKey) {
  return dataKey
    ?.split("_")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
}

export function convertToJson(headers, fileData) {
  let rows = [];
  fileData.forEach((row) => {
    const rowData = {};
    headers.forEach((element, index) => {
      if (row[index]) {
        rowData[element] = row[index];
      } else {
        rowData[element] = "";
      }
    });
    rows.push(rowData);
  });
  rows = rows.filter((value) => JSON.stringify(value) !== "{}");
  return rows;
}

// Function to handle file selection
export function handleFileChange(event, convertToJson, handlePostSeed) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = (e) => {
    const bstr = e.target.result;
    const workbook = XLSX.read(bstr, { type: "binary" });
    const workSheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[workSheetName];
    const fileData = XLSX.utils.sheet_to_json(workSheet, {
      header: 1,
      raw: false,
    });
    const headers = fileData[0];
    fileData.splice(0, 1);
    let data = convertToJson(headers, fileData);
    data = data.filter(
      (obj) => !Object.values(obj).every((value) => value === "")
    );
    handlePostSeed(data);
  };
}

export function columnGenerator(dataKeys, getColumnSearchProps, getTitle) {
  return dataKeys.map((dataKey) => {
    return {
      title: getTitle(dataKey),
      dataIndex: dataKey,
      key: dataKey,
      ellipsis: true,
      ...getColumnSearchProps(dataKey),
    };
  });
}

export function jsonToExcel(jsonData, fileName) {
  let wb = XLSX.utils.book_new();
  let binarySeedData = XLSX.utils.json_to_sheet(jsonData);
  XLSX.utils.book_append_sheet(wb, binarySeedData, fileName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export function formSetter(data, setValue) {
  if (data) {
    Object.keys(data).forEach((key) => {
      setValue(key, data[key]);
    });
  }
}

export function generateNumbersArray(upToValue) {
  return Array.from({ length: upToValue + 1 }, (_, index) => index);
}

export function generateObject(dataKeys) {
  return Object.fromEntries(dataKeys.map((key) => [key, ""]));
}

export function getTableScrollWidth(columns) {
  return columns.length * 220;
}

// const menuItems = [
//   { id: "Atom", name: "Atom", path: "/" },
//   {
//     id: "password",
//     name: "Password Group",
//     children: [
//       {
//         id: "web-development",
//         name: "Web Development",
//         path: "atom",
//       },
//       {
//         id: "mobile-app-development",
//         name: "Mobile App Development",
//         path: "/mobile-app-development",
//       },
//       {
//         id: "design",
//         name: "Design",
//         children: [
//           { id: "ui-ux-design", name: "UI/UX Design", path: "/ui-ux-design" },
//           {
//             id: "graphic-design",
//             name: "Graphic Design",
//             path: "atom",
//           },
//         ],
//       },
//     ],
//   },
//   { id: "about-us", name: "About Us", path: "atom" },
// ];

//   {
//     title: "Board",
//     dataIndex: "board",
//     key: "board",
//     render: (text, record) => {
//       const icon =
//         record.board === "true" ? (
//           <div
//             style={{
//               color: "#3D9E47",
//               background: "#F1F6EE",
//               width: "80%",
//               margin: "0 auto",
//               padding: "3px 2px",
//               borderRadius: "15px",
//               textAlign: "center",
//             }}
//           >
//             true
//           </div>
//         ) : (
//           <div
//             style={{
//               color: "#E34444",
//               background: "#FFECE9",
//               width: "80%",
//               margin: "0 auto",
//               padding: "3px 2px",
//               borderRadius: "15px",
//               textAlign: "center",
//             }}
//           >
//             false
//           </div>
//         );
//       return <span>{icon}</span>;
//     },
//   },
