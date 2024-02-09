import React from 'react';

function HeatMap() {
  const data = [
    ["#59A861", "#59A861", "#E7900C", "#8F37FF","#59A861", "#E7900C", "#59A861"],
    ["#8F37FF", "#59A861", "#8F37FF", "#E7900C","#E7900C", "#DBDBDB", "#E7900C"],

    ["#59A861", "#DBDBDB", "#59A861", "#8F37FF","#59A861", "#59A861", "#59A861"],

    ["#8F37FF", "#59A861", "#E7900C", "#DF4300","#E7900C", "#DF4300", "#E7900C"],

   

   
  ];

  return (
    <>
      {data.map((row, rowIndex) => (
        <article key={rowIndex} style={{ display: "flex", gap: "20px", flexBasis: "50%", padding: "10px 40px" }}>
          {row.map((color, colIndex) => (
            <div key={colIndex} style={{ width: "63px", height: "60px", backgroundColor: color, borderRadius: "2px" }}></div>
          ))}
        </article>
      ))}
    </>
  );
}

export default HeatMap;
