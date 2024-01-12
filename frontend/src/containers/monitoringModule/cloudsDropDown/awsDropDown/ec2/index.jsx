import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  useFetchRecordsQuery,
  useChangeEC2StatusMutation,
} from "../../../../../store/features/monitoringModule/cloudsDropDown/awsDropDown/ec2/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../../../store/features/monitoringModule/cloudsDropDown/awsDropDown/ec2/selectors";
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
  EC2_STATUS,
} from "./constants";
import { TYPE_FETCH } from "../../../../../hooks/useErrorHandling";
import DefaultPageTableSection from "../../../../../components/pageSections";

const Index = () => {
  // theme
  const theme = useTheme();

  // hooks
  const { handleSuccessAlert } = useSweetAlert();
  const { columnDefinitions } = useIndexTableColumnDefinitions({
    handleMonitoringSwitchChange,
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
  const dataSource = [{}];
  // const dataSource = useSelector(selectTableData);

  // apis
  const {
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isLoading: isFetchRecordsLoading,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
  } = useFetchRecordsQuery();

  const [
    changeEC2Status,
    {
      data: changeEC2StatusData,
      isSuccess: isChangeEC2StatusSuccess,
      isLoading: isChangeEC2StatusLoading,
      isError: isChangeEC2StatusError,
      error: changeEC2StatusError,
    },
  ] = useChangeEC2StatusMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: changeEC2StatusData,
    isSuccess: isChangeEC2StatusSuccess,
    isError: isChangeEC2StatusError,
    error: changeEC2StatusError,
    type: TYPE_FETCH,
  });

  // handlers
  function handleMonitoringSwitchChange(checked, record) {
    changeEC2Status({
      [TABLE_DATA_UNIQUE_ID]: record[TABLE_DATA_UNIQUE_ID],
      [EC2_STATUS]: checked,
    });
  }

  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert("File exported successfully.");
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <Spin spinning={isFetchRecordsLoading}>
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
