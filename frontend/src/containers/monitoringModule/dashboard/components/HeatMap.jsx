import React from 'react';

function HeatMap({ data }) {
  const rows = Math.ceil(data.length / 7);

  const createRows = () => {
    const rowsArray = [];
    for (let i = 0; i < rows; i++) {
      const rowData = data.slice(i * 7, (i + 1) * 7);
      rowsArray.push(
        <div key={i} style={{ display: "flex", justifyContent: "start", margin: "20px 0 20px 50px" }}>
          {rowData.map((item, index) => (
            <div key={index} style={{ width: "63px", height: "60px", backgroundColor: item.fill, borderRadius: "7px", marginRight: "20px" }}></div>
          ))}
        </div>
      );
    }
    return rowsArray;
  };

  return (
    <div>
      {createRows()}
      <div style={{ display: "flex", justifyContent: "start", margin: "20px 0 20px 50px" }}>
        <div style={{ width: "63px", height: "60px", backgroundColor: "green", borderRadius: "7px", marginRight: "20px" }}></div>
        <div style={{ width: "63px", height: "60px", backgroundColor: "red", borderRadius: "7px", marginRight: "20px" }}></div>
        <div style={{ width: "63px", height: "60px", backgroundColor: "yellow", borderRadius: "7px", marginRight: "20px" }}></div>
      </div>
      <div style={{ display: "start", justifyContent: "center",gap:"20px", margin: "0 0 20px 120px" }}>
        <label style={{  borderRadius: "50%", width: "10px", height: "10px", marginRight: "20px",color:"#434343",fontWeight:"500" }}>Clear</label>
        <label style={{  borderRadius: "50%", width: "10px", height: "10px", marginRight: "20px",color:"#434343",fontWeight:"500" }}>Device Down</label>
        <label style={{ borderRadius: "50%", width: "10px", height: "10px", marginRight: "20px" ,color:"#434343",fontWeight:"500"}}>Attention</label>
        <label style={{ borderRadius: "50%", width: "10px", height: "10px", marginRight: "20px" ,color:"#434343",fontWeight:"500"}}>Critical</label>
        <label style={{  borderRadius: "50%", width: "10px", height: "10px", marginRight: "20px",color:"#434343",fontWeight:"500" }}>Not Monitored</label>





        
      </div>
    </div>
  );
}

export default HeatMap;
