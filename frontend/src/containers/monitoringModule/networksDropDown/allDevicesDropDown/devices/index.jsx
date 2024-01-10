import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useFetchRecordsQuery } from "../../../../../store/features/monitoringModule/networksDropDown/allDevices/devices/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../../../store/features/monitoringModule/networksDropDown/allDevices/devices/selectors";
import { jsonToExcel } from "../../../../../utils/helpers";
import { Spin } from "antd";
import useErrorHandling from "../../../../../hooks/useErrorHandling";
import useSweetAlert from "../../../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import DefaultTableConfigurations from "../../../../../components/tableConfigurations";
import useButtonsConfiguration from "../../../../../hooks/useButtonsConfiguration";
import {
  PAGE_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";
import { TYPE_FETCH } from "../../../../../hooks/useErrorHandling";
import DefaultPageTableSection from "../../../../../components/pageSections";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedDevice } from "../../../../../store/features/monitoringModule/devices";
import { PAGE_PATH as PAGE_PATH_SUMMARY } from "../../../devicesLanding/summary/constants";
import { LANDING_PAGE_PATH } from "../../../devicesLanding";
import { MODULE_PATH } from "../../../index";

const Index = () => {
  // theme
  const theme = useTheme();
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
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // selectors
  const dataSource = [{ ip_address: "123" }];
  // const dataSource = useSelector(selectTableData);

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
  function handleIpAddressClick(record) {
    dispatch(setSelectedDevice(record));
    navigate(`/${MODULE_PATH}/${LANDING_PAGE_PATH}/${PAGE_PATH_SUMMARY}`);
  }

  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert("File exported successfully.");
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <Spin spinning={false}>
      {/* <Spin spinning={isFetchRecordsLoading}> */}
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
    </Spin>
  );
};

export default Index;
