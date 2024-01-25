import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedInterface } from "../../../store/features/monitoringModule/devicesLanding/interfaces/selectors";
import DefaultDetailCards from "../../../components/detailCards";
import firewallIcon from "../../../resources/designRelatedSvgs/firewall.svg";
import deviceIcon from "../../../resources/designRelatedSvgs/otherDevices.svg";
import switchIcon from "../../../resources/designRelatedSvgs/switches.svg";

function Index(props) {
  const selectedInterface = useSelector(selectSelectedInterface);

  return (
    <DefaultDetailCards
      data={{
        all_devices: 5,
        firewalls: 5,
        switches: 5,
        routers: 5,
        other_devices: 5,
      }}
      icons={[deviceIcon, firewallIcon, switchIcon, switchIcon, deviceIcon]}
    />
  );
}

export default Index;
