import * as XLSX from "xlsx";

export const getTitle = (dataKey) => {
  return dataKey
    ?.split("_")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
};

export const convertToJson = (headers, fileData) => {
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
};

// Function to handle file selection
export const handleFileChange = (event, convertToJson, handlePostSeed) => {
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
    handlePostSeed(data);
  };
};

export const columnGenerator = (dataKeys, getColumnSearchProps, getTitle) => {
  return dataKeys.map((dataKey) => {
    return {
      title: getTitle(dataKey),
      dataIndex: dataKey,
      key: dataKey,
      ...getColumnSearchProps(dataKey),
    };
  });
};

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
