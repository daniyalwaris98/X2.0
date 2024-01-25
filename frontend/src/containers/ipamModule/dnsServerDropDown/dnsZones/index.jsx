import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../../store/features/ipamModule/dnsServerDropDown/dnsZones/selectors";
import { selectSelectedDnsServer } from "../../../../store/features/ipamModule/dnsServerDropDown/dnsServers/selectors";
import {
  useFetchZonesLazyQuery,
  useGetIpamDnsZonesByServerIdMutation,
} from "../../../../store/features/ipamModule/dnsServerDropDown/dnsZones/apis";
import { setSelectedDnsZone } from "../../../../store/features/ipamModule/dnsServerDropDown/dnsZones";
import { setSelectedDnsServer } from "../../../../store/features/ipamModule/dnsServerDropDown/dnsServers";
import { jsonToExcel } from "../../../../utils/helpers";
import { SUCCESSFUL_FILE_EXPORT_MESSAGE } from "../../../../utils/constants";
import useErrorHandling, {
  TYPE_FETCH,
} from "../../../../hooks/useErrorHandling";
import useSweetAlert from "../../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../../hooks/useColumnsGenerator";
import useButtonsConfiguration from "../../../../hooks/useButtonsConfiguration";
import DefaultPageTableSection from "../../../../components/pageSections";
import DefaultTableConfigurations from "../../../../components/tableConfigurations";
import DefaultSpinner from "../../../../components/spinners";
import { MODULE_PATH } from "../../index";
import { DROPDOWN_PATH } from "../../dnsServerDropDown";
import DnsServerDetails from "./dnsServerDetails";
import { PAGE_PATH as PAGE_PATH_DNS_Records } from "../dnsRecords/constants";
import { TABLE_DATA_UNIQUE_ID as DNS_SERVER_ID } from "../dnsServers/constants";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import {
  PAGE_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";

const Index = () => {
  // hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleSuccessAlert } = useSweetAlert();
  const { columnDefinitions } = useIndexTableColumnDefinitions({
    handleIpAddressClick,
  });
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_export: { handleClick: handleDefaultExport },
  });

  // states
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // selectors
  const dataSource = useSelector(selectTableData);
  const selectedDnsServer = useSelector(selectSelectedDnsServer);

  // apis
  const [
    fetchZones,
    {
      data: fetchZonesData,
      isSuccess: isFetchZonesSuccess,
      isLoading: isFetchZonesLoading,
      isError: isFetchZonesError,
      error: fetchZonesError,
    },
  ] = useFetchZonesLazyQuery();

  const [
    getDnsZonesByServerId,
    {
      data: getDnsZonesByServerIdData,
      isSuccess: isGetDnsZonesByServerIdSuccess,
      isLoading: isGetDnsZonesByServerIdLoading,
      isError: isGetDnsZonesByServerIdError,
      error: getDnsZonesByServerIdError,
    },
  ] = useGetIpamDnsZonesByServerIdMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchZonesData,
    isSuccess: isFetchZonesSuccess,
    isError: isFetchZonesError,
    error: fetchZonesError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: getDnsZonesByServerIdData,
    isSuccess: isGetDnsZonesByServerIdSuccess,
    isError: isGetDnsZonesByServerIdError,
    error: getDnsZonesByServerIdError,
    type: TYPE_FETCH,
  });

  // effects
  useEffect(() => {
    if (selectedDnsServer) {
      getDnsZonesByServerId({
        [DNS_SERVER_ID]: selectedDnsServer[DNS_SERVER_ID],
      });
    } else {
      fetchZones();
    }

    return () => {
      dispatch(setSelectedDnsServer(null));
    };
  }, []);

  // handlers
  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert(SUCCESSFUL_FILE_EXPORT_MESSAGE);
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  function handleIpAddressClick(record) {
    dispatch(setSelectedDnsZone(record));
    navigate(`/${MODULE_PATH}/${DROPDOWN_PATH}/${PAGE_PATH_DNS_Records}`);
  }

  return (
    <DefaultSpinner
      spinning={isFetchZonesLoading || isGetDnsZonesByServerIdLoading}
    >
      {tableConfigurationsOpen ? (
        <DefaultTableConfigurations
          columns={columns}
          availableColumns={availableColumns}
          setAvailableColumns={setAvailableColumns}
          displayColumns={displayColumns}
          setDisplayColumns={setDisplayColumns}
          setColumns={setColumns}
          open={tableConfigurationsOpen}
          setOpen={setTableConfigurationsOpen}
        />
      ) : null}

      {selectedDnsServer ? <DnsServerDetails /> : null}

      <DefaultPageTableSection
        PAGE_NAME={PAGE_NAME}
        TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
        buttonsConfigurationList={buttonsConfigurationList}
        displayColumns={displayColumns}
        dataSource={dataSource}
      />
    </DefaultSpinner>
  );
};

export default Index;
