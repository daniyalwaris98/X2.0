import React from 'react'
import RcmAlarms from '../../../../components/charts/RcmAlarms'
import RcmAlarmDeviceTable from '../components/RcmAlarmDeviceTable'
function RecentRcmAlarmsChart() {
  return (
    <div style={{display:"flex", justifyContent:"space-between"}}>
      <div  style={{padding:"5px 10px 0px 0px", display:"flex",justifyContent:"center",flexBasis:"50%"}}>
      <RcmAlarms/>
      </div>
      
    <div style={{padding:"5px 10px 0px 0px", display:"flex",justifyContent:"center",flexBasis:"30%"}}>
    <RcmAlarmDeviceTable/>
    </div>

    </div>
  )
}

export default RecentRcmAlarmsChart