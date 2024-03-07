// import React, { useState, useEffect } from 'react';

// const SiteMap = ({ apiKey, markerData }) => {
//   const [map, setMap] = useState(null);
//   const [infoWindow, setInfoWindow] = useState(null);
//   const [selectedMarker, setSelectedMarker] = useState(null);

//   useEffect(() => {
//     const loadScript = () => {
//       const script = document.createElement('script');
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//       script.async = true;
//       script.onload = initMap;
//       script.onerror = handleScriptError; // Handle script loading errors
//       document.body.appendChild(script);
//     };

//     const initMap = () => {
//       try {
//         const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
//           center: { lat: 0, lng: 0 },
//           zoom: 14,
//         });
//         setMap(mapInstance);

//         const infoWindowInstance = new window.google.maps.InfoWindow();
//         setInfoWindow(infoWindowInstance);

//         addMarkers();
//       } catch (error) {
//         console.error('Error initializing map:', error);
//       }
//     };

//     const addMarkers = () => {
//       if (!map || !infoWindow) return;

//       markerData.forEach((marker, index) => {
//         const markerInstance = new window.google.maps.Marker({
//           position: marker.position,
//           map: map,
//           title: marker.name,
//         });

//         markerInstance.addListener('click', () => {
//           setSelectedMarker(marker);
//           infoWindow.setContent(marker.name);
//           infoWindow.open(map, markerInstance);
//         });
//       });
//     };

//     const handleScriptError = () => {
//       console.error('Error loading Google Maps script.');
//     };

//     loadScript();

//     return () => {
//       // Clean up resources if needed
//     };
//   }, [apiKey, markerData]);

//   return <div id="map" style={{ width: '100%', height: '400px' }} />;
// };

// export default SiteMap;

import React from "react";
import map from "../../../../resources/map.png";

function SiteMap() {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "start",
          gap:"5px"
        }}
      >
        <div
          style={{
            flexBasis: "45%",
            borderRadius: "8px",
            margin: "30px 0 0 0",
          
          }}
        >
          <img src={map} width={400} height={290} />
        </div>
        <label
          style={{
            color: "red",
            width: "2px",
            height: "250px",
            backgroundColor: "#D8D8D8",
            margin: "50px 0 0 0",
          }}
        ></label>
       <div style={{display:"flex", flexDirection:"column",gap:"20px", margin:"60px 0 0 0"}} >

<div style={{backgroundColor:"#F6F6F6", height:"80px ", width:"130px", borderRadius:"8px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}> 
<h5 style={{padding:"0px", margin:"0px"}}>Total Devices</h5>
<h1 style={{padding:"0px", margin:"0px"}}>25</h1>



</div> 
<div style={{backgroundColor:"#F6F6F6", height:"80px ", width:"130px", borderRadius:"8px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}> 


<h5 style={{padding:"0px", margin:"0px",color:"#434343"}}>Onboard Devices</h5>
<h1 style={{padding:"0px", margin:"0px",color:"#434343"}}>20</h1></div> 
</div> 
<div style={{display:"flex", flexDirection:"column",gap:"20px", margin:"60px 0 0 0"}}>

<div style={{backgroundColor:"#F6F6F6", height:"80px ", width:"130px", borderRadius:"8px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
<h5 style={{padding:"0px", margin:"0px",color:"#434343"}}>Physical Devices</h5>
<h1 style={{padding:"0px", margin:"0px",color:"#434343"}}>15</h1> </div> 
<div style={{backgroundColor:"#F6F6F6", height:"80px ", width:"130px", borderRadius:"8px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
<h5 style={{padding:"0px", margin:"0px",color:"#434343"}}>Virtual Count</h5>
<h1 style={{padding:"0px", margin:"0px",color:"#434343"}}>5</h1> </div> 
</div> 

      </div>
      
      
    </>
  );
}

export default SiteMap;
