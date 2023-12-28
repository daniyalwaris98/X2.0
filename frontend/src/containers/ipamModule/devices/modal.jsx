import React, { useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import FormModal from "../../../components/dialogs";
import Grid from "@mui/material/Grid";
import {
  useGetAtomsToAddInIpamDevicesQuery,
  useAddAtomsInIpamDevicesMutation,
} from "../../../store/features/ipamModule/devices/apis";
import { useSelector } from "react-redux";
import { selectAtomsToAddInIpamDevicesData } from "../../../store/features/ipamModule/devices/selectors";
import { Spin } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import { TABLE_DATA_UNIQUE_ID } from "./constants";
import { TYPE_FETCH, TYPE_BULK } from "../../../hooks/useErrorHandling";
import DefaultPageTableSection from "../../../components/pageSections";
import { PAGE_NAME } from "../../atomModule/atoms/constants";

const Index = ({ handleClose, open }) => {
  const theme = useTheme();

  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { columnDefinitions } = useIndexTableColumnDefinitions({});
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_add: {
      handleClick: handleAdd,
      namePostfix: PAGE_NAME,
      visible: selectedRowKeys.length > 0,
    },
  });

  // states
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // apis
  const {
    data: getAtomsToAddInIpamDevicesData,
    isSuccess: isGetAtomsToAddInIpamDevicesSuccess,
    isLoading: isGetAtomsToAddInIpamDevicesLoading,
    isError: isGetAtomsToAddInIpamDevicesError,
    error: getAtomsToAddInIpamDevicesError,
  } = useGetAtomsToAddInIpamDevicesQuery();

  const [
    addAtomsInIpam,
    {
      data: addAtomsInIpamDevicesData,
      isSuccess: isAddAtomsInIpamDevicesSuccess,
      isLoading: isAddAtomsInIpamDevicesLoading,
      isError: isAddAtomsInIpamDevicesError,
      error: addAtomsInIpamDevicesError,
    },
  ] = useAddAtomsInIpamDevicesMutation();

  // error handling custom hooks
  useErrorHandling({
    data: getAtomsToAddInIpamDevicesData,
    isSuccess: isGetAtomsToAddInIpamDevicesSuccess,
    isError: isGetAtomsToAddInIpamDevicesError,
    error: getAtomsToAddInIpamDevicesError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: addAtomsInIpamDevicesData,
    isSuccess: isAddAtomsInIpamDevicesSuccess,
    isError: isAddAtomsInIpamDevicesError,
    error: addAtomsInIpamDevicesError,
    type: TYPE_BULK,
    callback: handleClose,
  });

  // getting dropdowns data from the store
  const atomsToAddInIpamDevicesData = useSelector(
    selectAtomsToAddInIpamDevicesData
  );

  // handlers
  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  function handleAdd() {
    addAtomsInIpam(selectedRowKeys);
  }

  return (
    <FormModal
      sx={{ zIndex: "999" }}
      title={`${"Add"} ${PAGE_NAME}`}
      open={open}
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

      <DefaultPageTableSection
        PAGE_NAME={PAGE_NAME}
        TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
        buttonsConfigurationList={buttonsConfigurationList}
        displayColumns={displayColumns}
        dataSource={atomsToAddInIpamDevicesData}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </FormModal>
  );
};

export default Index;
