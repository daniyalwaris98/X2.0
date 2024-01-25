import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../../store/features/ipamModule/subnetsDropDown/ipDetails/selectors";
import { useFetchRecordsQuery } from "../../../../store/features/ipamModule/subnetsDropDown/ipDetails/apis";
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

const Index = () => {
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

  // apis
  const {
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isLoading: isFetchRecordsLoading,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
  } = useFetchRecordsQuery();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  // handlers
  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert(SUCCESSFUL_FILE_EXPORT_MESSAGE);
  }

  function handleCloseIpHistoryModal() {
    setIpAddressForIpHistory(null);
    setOpenIpHistoryModal(false);
  }

  function handleIpAddressClick(record) {
    setIpAddressForIpHistory(record[indexColumnNameConstants.IP_ADDRESS]);
    setOpenIpHistoryModal(true);
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <DefaultSpinner spinning={isFetchRecordsLoading}>
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
