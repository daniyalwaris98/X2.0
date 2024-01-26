import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../../store/features/ipamModule/subnetsDropDown/ipDetails/selectors";
import {
  useFetchRecordsLazyQuery,
  useGetIpDetailsBySubnetAddressMutation,
} from "../../../../store/features/ipamModule/subnetsDropDown/ipDetails/apis";
import { jsonToExcel } from "../../../../utils/helpers";
import { SUCCESSFUL_FILE_EXPORT_MESSAGE } from "../../../../utils/constants";
import useErrorHandling, {
  TYPE_FETCH,
} from "../../../../hooks/useErrorHandling";
import useSweetAlert from "../../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../../hooks/useColumnsGenerator";
import useButtonsConfiguration from "../../../../hooks/useButtonsConfiguration";
import DefaultSpinner from "../../../../components/spinners";
import DefaultPageTableSection from "../../../../components/pageSections";
import DefaultTableConfigurations from "../../../../components/tableConfigurations";
import IpHistoryModal from "../ipHistory/modal";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import {
  PAGE_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
  indexColumnNameConstants,
} from "./constants";
import { MODULE_PATH } from "../../index";
import { DROPDOWN_PATH } from "../../subnetsDropDown";
import { PAGE_PATH as PAGE_PATH_IP_HISTORY } from "../ipHistory/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectSelectedSubnet } from "../../../../store/features/ipamModule/subnetsDropDown/subnets/selectors";
import { setSelectedIpDetail } from "../../../../store/features/ipamModule/subnetsDropDown/ipDetails";
import { setSelectedSubnet } from "../../../../store/features/ipamModule/subnetsDropDown/subnets";
import { indexColumnNameConstants as subnetsColumnNameConstants } from "../subnets/constants";
import SubnetDetails from "./subnetDetails";

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // hooks
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
  const [ipAddressForIpHistory, setIpAddressForIpHistory] = useState(null);
  const [openIpHistoryModal, setOpenIpHistoryModal] = useState(false);
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // selectors
  const dataSource = useSelector(selectTableData);
  const selectedSubnet = useSelector(selectSelectedSubnet);

  // apis
  const [
    fetchRecords,
    {
      data: fetchRecordsData,
      isSuccess: isFetchRecordsSuccess,
      isLoading: isFetchRecordsLoading,
      isError: isFetchRecordsError,
      error: fetchRecordsError,
    },
  ] = useFetchRecordsLazyQuery();

  const [
    getIpDetailsBySubnetAddress,
    {
      data: getIpDetailsBySubnetAddressData,
      isSuccess: isGetIpDetailsBySubnetAddressSuccess,
      isLoading: isGetIpDetailsBySubnetAddressLoading,
      isError: isGetIpDetailsBySubnetAddressError,
      error: getIpDetailsBySubnetAddressError,
    },
  ] = useGetIpDetailsBySubnetAddressMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: getIpDetailsBySubnetAddressData,
    isSuccess: isGetIpDetailsBySubnetAddressSuccess,
    isError: isGetIpDetailsBySubnetAddressError,
    error: getIpDetailsBySubnetAddressError,
    type: TYPE_FETCH,
  });

  // effects
  useEffect(() => {
    if (selectedSubnet) {
      getIpDetailsBySubnetAddress({
        [subnetsColumnNameConstants.SUBNET_ADDRESS]:
          selectedSubnet[subnetsColumnNameConstants.SUBNET_ADDRESS],
      });
    } else {
      fetchRecords();
    }

    return () => {
      dispatch(setSelectedSubnet(null));
    };
  }, []);

  // handlers
  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert(SUCCESSFUL_FILE_EXPORT_MESSAGE);
  }

  function handleCloseIpHistoryModal() {
    setIpAddressForIpHistory(null);
    setOpenIpHistoryModal(false);
  }

  // function handleIpAddressClick(record) {
  //   setIpAddressForIpHistory(record[indexColumnNameConstants.IP_ADDRESS]);
  //   setOpenIpHistoryModal(true);
  // }

  function handleIpAddressClick(record) {
    dispatch(setSelectedIpDetail(record));
    navigate(`/${MODULE_PATH}/${DROPDOWN_PATH}/${PAGE_PATH_IP_HISTORY}`);
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <DefaultSpinner
      spinning={isFetchRecordsLoading || isGetIpDetailsBySubnetAddressLoading}
    >
      {openIpHistoryModal ? (
        <IpHistoryModal
          handleClose={handleCloseIpHistoryModal}
          open={openIpHistoryModal}
          ipAddress={ipAddressForIpHistory}
        />
      ) : null}

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

      {selectedSubnet ? <SubnetDetails /> : null}

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
