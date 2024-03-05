import React from "react";

function HeatMap({ data }) {
  const rows = Math.ceil(data.length / 7);

  const createRows = () => {
    const rowsArray = [];
    for (let i = 0; i < rows; i++) {
      const rowData = data.slice(i * 7, (i + 1) * 7);
      rowsArray.push(
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "start",
            margin: "20px 0 20px 50px",
          }}
        >
          {rowData.map((item, index) => (
            <div
              key={index}
              style={{
                width: "63px",
                height: "60px",
                backgroundColor: item.fill,
                borderRadius: "7px",
                marginRight: "20px",
              }}
            ></div>
          ))}
        </div>
      );
    }
    return rowsArray;
  };

  return (
    <div>
      {createRows()}
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          margin: "20px 0 20px 50px",
        }}
      >
        <div
          style={{
            width: "63px",
            height: "60px",
            backgroundColor: "green",
            borderRadius: "7px",
            marginRight: "20px",
          }}
        ></div>
        <div
          style={{
            width: "63px",
            height: "60px",
            backgroundColor: "red",
            borderRadius: "7px",
            marginRight: "10px",
          }}
        ></div>
        <div
          style={{
            width: "63px",
            height: "60px",
            backgroundColor: "yellow",
            borderRadius: "7px",
            marginRight: "20px",
          }}
        ></div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          gap: "20px",
          margin: "0 0 20px 70px",
        }}
      >
       
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems:"center",
            gap: "20px",
          }}
        >
          <label
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#66B127",
              color: "#434343",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
   
            }}
          ></label>

          <label
           
          >
            Clear
          </label>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems:"center",

            gap: "20px",
          }}
        >
          <label
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#AA3938",
              marginRight: "0px",
              color: "#434343",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></label>

          <label
           
          >
            Device 
          </label>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems:"center",

            gap: "20px",
          }}
        >
          <label
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#E2B200",
              marginRight: "10px",
              color: "#434343",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></label>

          <label
           
          >
            Attention 
          </label>
        </div>

    

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems:"center",
            gap: "20px",
          }}
        >
          <label
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#FF9A40",
              margin: "0 7px 0 10px",
              color: "#434343",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></label>

          <label
            
          >
            Critical 
          </label>
        </div>

       

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems:"center",
            gap: "20px",
          }}
        >
          <label
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#DBDBDB",
              margin: "0 7px 0 10px",
              color: "#434343",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></label>

          <label
            
          >
            Not Mentioned  
          </label>
        </div>
     
      </div>
    </div>
  );
}

export default HeatMap;
