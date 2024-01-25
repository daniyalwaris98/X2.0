import React from "react";
import { useSelector } from "react-redux";
import { selectDeviceCounts } from "../../../store/features/autoDiscoveryModule/discovery/selectors";
import DefaultDetailCards from "../../../components/detailCards";
import firewallIcon from "../../../resources/designRelatedSvgs/firewall.svg";
import deviceIcon from "../../../resources/designRelatedSvgs/otherDevices.svg";
import switchIcon from "../../../resources/designRelatedSvgs/switches.svg";

function Index(props) {
  const deviceCounts = useSelector(selectDeviceCounts);
  // const deviceCounts = {
  //   all_devices: 5,
  //   firewalls: 5,
  //   switches: 5,
  //   routers: 5,
  //   other_devices: 5,
  // };

  return (
    <>
      {deviceCounts ? (
        <DefaultDetailCards
          data={deviceCounts}
          icons={[deviceIcon, firewallIcon, switchIcon, switchIcon, deviceIcon]}
        />
      ) : null}
    </>
  );
}

export default Index;
