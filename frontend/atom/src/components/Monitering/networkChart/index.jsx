// import "./styles.css";
import React, { useEffect, useState } from "react";
import Graph from "react-graph-vis";
import axios,{baseUrl} from "../../../utils/axios";
import con from "./img/cross.png";
import Hub from "./img/monetxweb.svg";
import device from "./img/deviceweb.svg";
import router from "./img/routerweb.svg";


import routerActive from "./img/routeractive.svg";
import switchActive from "./img/switchactive.svg";
import deviceActive from "./img/deviceactive.svg";
import routerInActive from "./img/routerinactive.svg";
import switchInActive from "./img/switchinactive.svg";
import deviceInActive from "./img/deviceinactive.svg";
import { useNavigate } from "react-router-dom";


import switchweb from "./img/switchweb.svg";
import "./main.css";
import { SpinLoading } from "../../AllStyling/All.styled";

function RelationGraph1() {
  const navigate = useNavigate();

  const [network, setNetwork] = useState(null);
  const [mainTableLoading,setMainTableLoading]=useState(false);
  const [graph, setGraph] = useState(null
  //   {
  //   nodes: [
  //     {
  //       id: 1,
  //       label: "Node 1",
  //       title: ""
  //     },
  //     { id: 2, label: "Node 2", title: "" },
  //     { id: 3, label: "Node 3", title: "" },
  //     { id: 4, label: "Node 4", title: "" },
  //     { id: 5, label: "Node 5", title: "" }
  //   ],
  //   edges: [
  //     { from: 1, to: 2 },
  //     { from: 1, to: 3 },
  //     { from: 2, to: 4 },
  //     { from: 2, to: 5 }
  //   ]
  // }
  );
  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getNewDCStatus");
        console.log("res getNewDCStatus", res.data);


        const result = [];

        res.data.nodes.forEach((item) => {
          
     
console.log("image",item.image);
       
          let images;
          if (item.image === "./img/Router.svg" || item.image === "./img/Device.svg" || item.image === "./img/Firewall.svg" ||
          item.image === "./img/VM.svg" || item.image === "./img/PRINTER.svg" || item.image === "./img/SWITCH.svg" ||
          item.image === "./img/Switch.svg") {
      
        if (item.image === "./img/Router.svg") {
          if (item.image === "./img/Router.svg" && item.status === "Active") {
            images = routerActive;
          }
          if (item.image === "./img/Router.svg" && item.status !== "Active") {
            images = routerInActive;
          }
        }  else if (item.image === "./img/Firewall.svg") {
          if (item.image === "./img/Firewall.svg" && item.status === "Active") {
            images = deviceActive;
          }
          if (item.image === "./img/Firewall.svg" && item.status !== "Active") {
            images = deviceInActive;
          }
        } else if (item.image === "./img/Load Balancer.svg") {
          if (item.image === "./img/Load Balancer.svg" && item.status === "Active") {
            images = deviceActive;
          }
          if (item.image === "./img/Load Balancer.svg" && item.status !== "Active") {
            images = deviceInActive;
          }
        } else if (item.image === "./img/VM.svg") {
          if (item.image === "./img/VM.svg" && item.status === "Active") {
            images = deviceActive;
          }
          if (item.image === "./img/VM.svg" && item.status !== "Active") {
            images = deviceInActive;
          }
        } else if (item.image === "./img/ESXI HOST.svg") {
          if (item.image === "./img/ESXI HOST.svg" && item.status === "Active") {
            images = deviceActive;
          }
          if (item.image === "./img/ESXI HOST.svg" && item.status !== "Active") {
            images = deviceInActive;
          }
        } else if (item.image === "./img/PRINTER.svg") {
          if (item.image === "./img/PRINTER.svg" && item.status === "Active") {
            images = deviceActive;
          }
          if (item.image === "./img/PRINTER.svg" && item.status !== "Active") {
            images = deviceInActive;
          }
        } else if (item.image === "./img/SWITCH.svg" || item.image === "./img/Switch.svg") {
          if (item.image === "./img/SWITCH.svg" || item.image === "./img/Switch.svg" && item.status === "Active") {
            images = switchActive;
          }
          if (item.image === "./img/SWITCH.svg" || item.image === "./img/Switch.svg" && item.status !== "Active") {
            images = switchInActive;
          }
        }
        else if (item.image === "./img/Device.svg") {
          if (item.image === "./img/Device.svg" && item.status === "Active") {
            images = deviceActive;
          }
          if (item.image === "./img/Device.svg" && item.status !== "Active") {
            images = deviceInActive;
          }
        }
      } else {
        if (item.status === "Active") {
          images = deviceActive;
        } else {
          images = deviceInActive;
        }
      }
      

      
if(item.label==="MonetX"){
  images=Hub;
}

const obj =   {
            // function: item.function,
            id: item.id, 
            image: images, 
            label: item.label, 
            status: item.status, 
            title: item.title,
            shape: 'image'
          };

          result.push(obj);
        });

                  const AllData={
                   edges: res.data.edges,
                   nodes:result
                  }
        console.log(AllData);


//         const updatedNodes = res.data.nodes.map(node => ({
//           ...node,
//           image: device, // Update image URL here
//         }));
// console.log(updatedNodes)
        setGraph(AllData);

        setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, []);
  // const options = {
  //   layout: {
  //     hierarchical: {
  //       levelSeparation: 100,
  //       nodeSpacing: 100,
  //       // direction: 'UD', // uncomment this line if you want the tree to be top-down
  //       // sortMethod: 'directed', // this will place node 1 at the top of the tree
  //     },
  //   },
  //   nodes: {
  //     shape: "dot",
  //     // shapeProperties: {
  //     //   borderRadius: 50,
  //     // },
  
  //     // shape: 'icon',
  //     //   size: 250,
  //     borderWidth: 3,
  //     image: {
  //       unselected: con,
  //       selected: con,
  //     },
  //     color: {
  //       border: "#222222",
  //       background: "#666666",
  //     },
  //     font: {
  //       color: "#000",
  //     },
  //   },
  //   edges: {
  //     width: 3,
  //     // length: 950,
  //     dashes: [2, 2, 2, 2],
  //   //   round: true,
  //     font: {
  //       size: 14,
  //       align: 'middle',
  //     },
  //   //   color: "#FF0000", // default edge color
  //   //   inherit: "color", // use color function to determine edge color
  //   //   color: function (edge) {
  //   //     return edge.title === "node 5 tootip text" ? "#00FF00" : null;
  //   //   },
  //   arrowStrikethrough: false,
  //   color: {
  //     color: '#6ab127',
  //     highlight: '#27AE60',
  //     hover: '#aaa',
  //   },
  //   // length: 150,
  //   // shadow: false,
  //   },
  //   interaction: {
  //     dragNodes: false,
  //     zoomView: false,
  //     // minZoom: 0.5,
  //     // maxZoom: 2.0,
  //   },
  //   // physics: {
  //   //   enabled: false,
  //   // },
  //   // Set the minZoom and maxZoom options
  //   // minZoom: 0.5,
  //   // maxZoom: 2.0,
  // };



    // const options = {
    //   layout: {
    //     hierarchical: true
    //   },
    //   edges: {
    //     color: "#000000",
    //     width: 3,
    //   },
    //   nodes: {
    //       font: {
    //         color: '#000', // set the text color to white

    //       },
    //     },
    //         color: {
    //   color: '#6ab127',
    //   highlight: '#27AE60',
    //   hover: '#aaa',
    // },
    //   // height: "500px"
    // };
    const options = {
      // layout: {
      //   hierarchical: false
      // },
      layout: {
        improvedLayout: true,
       
          // hierarchical: true
        
      },
      edges: {
        color: "#1D1D1D",
        width:3,
        smooth: {
          type: 'straight'
        }
      },
      interaction: {
        // hover: true,
        // navigationButtons: true,
        tooltipDelay: 0
      },
      nodes: {
        shape: "image",
        image: Hub,
        length: 400,
        // borderWidth: 0,
        // borderWidthSelected: 0,
        // color: "#6ab127",
        // shape: "circle",
      
        // size: 1,
        shadow: {
          enabled: true,
          color: "rgba(0,0,0,0.5)",
          // size: 10,
          // x: 5,
          // y: 5
        },
        // font: {
        //   color: "#fff",
        //   size: 13,
        //   // bold: {
        //   //   mod: "bold"
        //   // }
        // }
      },
      physics: {
        enabled: true,
        hierarchicalRepulsion: {
            centralGravity: 0.0,
            springLength: 200,
            springConstant: 0.01,
            nodeDistance: 200,
            damping: 0.09
        },
        solver: 'hierarchicalRepulsion'
      }
    };

  const events = {
    hoverNode: (e) => {
      const data = graph.nodes.map((el) => {
        if (el.id === e.node) return { ...el, label: "sample node name" };
        else return el;
      });

      const temp = { ...graph };
      temp.nodes = data;
      setGraph(temp);
    },
    select: function (event) {
      var { nodes, edges } = event;
      console.log("Selected nodes:");
//       console.log(nodes);
//       const ipAddressString = nodes.join('');

// console.log(ipAddressString);




console.log(event);
console.log(event.nodes);
const myValue = event.nodes[0];
console.log(myValue)


console.log(event.nodes.length);

if(event.nodes.length===0 || myValue==1){
console.log("Do Nothing")
}else{
  const setClick= async()=>{

    const res = await axios.post(
      baseUrl + "/getMonitoringDevicesCards ",
      { ip_address: myValue }
    );
  
    console.log("getMonitoringDevicesCards", res);
  
    navigate("/monitoringsummary/main", {
      state: {
        ip_address: myValue,
        res: res.data,
      },
    });
  }
  setClick();
}




      console.log("Selected edges:");
      console.log(edges);
    },
    showPopup: (id) => {
      // node id
      // const data = graph.nodes.map((el) => {
      //   if (el.id === id) {
      //     el.label = `sample node name`;
      //   }
      //   return el;
      // });
      // setGraph({ ...graph, nodes: data });
    }
  };

  return (

    <SpinLoading spinning={mainTableLoading} style={{marginTop:"100px"}}>

    {graph!==null&&
    <Graph
      graph={graph}
      options={options}
      events={events}
      style={{ height: "350px" }}
      getNetwork={(network) => {
        console.log(network);
        setNetwork(network);
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />}
    </SpinLoading>
  );
}

export default function App() {
  return (
    <div className="App">

        <RelationGraph1 />
     
      
    </div>
  );
}
