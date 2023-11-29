import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import DefaultTable from "../../../components/tables";
import Modal from "./modal";
import {
  useFetchRecordsQuery,
  useAddRecordsMutation,
  useDeleteRecordsMutation,
} from "../../../store/features/atomModule/atom/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/atomModule/atom/selectors";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import {
  jsonToExcel,
  convertToJson,
  handleFileChange,
  generateObject,
  getTableScrollWidth,
} from "../../../utils/helpers";
import { Spin } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import PageHeader from "../../../components/pageHeader";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import useSweetAlert from "../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import {
  PAGE_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  FILE_NAME_EXPORT_COMPLETE_DATA,
  FILE_NAME_EXPORT_INCOMPLETE_DATA,
  FILE_NAME_EXPORT_TEMPLATE,
  TABLE_DATA_UNIQUE_ID,
  ATOM_ID,
  ATOM_TRANSITION_ID,
} from "./constants";
import { TYPE_FETCH, TYPE_BULK } from "../../../hooks/useErrorHandling";
import SiteModal from "../../uamModule/sites/modal";
import RackModal from "../../uamModule/racks/modal";
import PasswordGroupModal from "../passwordGroup/modal";

const Index = () => {
  // theme
  const theme = useTheme();

  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { height, width } = useWindowDimensions();
  const { handleSuccessAlert, handleInfoAlert, handleCallbackAlert } =
    useSweetAlert();
  const { columnDefinitions, dataKeys } = useIndexTableColumnDefinitions({
    handleEdit,
  });
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { dropdownButtonOptionsConstants, buttonsConfigurationList } =
    useButtonsConfiguration({
      configure_table: { handleClick: handleTableConfigurationsOpen },
      atom_export: { handleClick: handleExport },
      default_delete: { handleClick: handleDelete, selectedRowKeys },
      default_onboard: { handleClick: handleOnboard, selectedRowKeys },
      atom_add: { handleClick: handleAdd, namePostfix: PAGE_NAME },
      default_import: { handleClick: handleInputClick },
    });

  // refs
  const fileInputRef = useRef(null);

  // states
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [siteModalOpen, setSiteModalOpen] = useState(false);
  const [rackModalOpen, setRackModalOpen] = useState(false);
  const [passwordGroupModalOpen, setPasswordGroupModalOpen] = useState(false);
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

  const [
    addRecords,
    {
      data: addRecordsData,
      isSuccess: isAddRecordsSuccess,
      isLoading: isAddRecordsLoading,
      isError: isAddRecordsError,
      error: addRecordsError,
    },
  ] = useAddRecordsMutation();

  const [
    deleteRecords,
    {
      data: deleteRecordsData,
      isSuccess: isDeleteRecordsSuccess,
      isLoading: isDeleteRecordsLoading,
      isError: isDeleteRecordsError,
      error: deleteRecordsError,
    },
  ] = useDeleteRecordsMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: addRecordsData,
    isSuccess: isAddRecordsSuccess,
    isError: isAddRecordsError,
    error: addRecordsError,
    type: TYPE_BULK,
  });

  useErrorHandling({
    data: deleteRecordsData,
    isSuccess: isDeleteRecordsSuccess,
    isError: isDeleteRecordsError,
    error: deleteRecordsError,
    type: TYPE_BULK,
  });

  // effects
  useEffect(() => {
    setSelectedRowKeys([]);
  }, [isDeleteRecordsSuccess, isDeleteRecordsError]);

  // handlers
  function handlePostSeed(data) {
    addRecords(data);
  }

  function deleteData(allowed) {
    if (allowed) {
      const deleteData = selectedRowKeys.map((rowKey) => {
        const dataObject = dataSource.find(
          (row) => row.atom_table_id === rowKey
        );

        if (dataObject) {
          const { atom_id, atom_transition_id } = dataObject;

          return {
            atom_id: atom_id || null,
            atom_transition_id: atom_transition_id || null,
          };
        }

        return null;
      });

      const filteredDeleteData = deleteData.filter((data) => data !== null);

      if (filteredDeleteData.length > 0) {
        deleteRecords(filteredDeleteData);
      }
    } else {
      setSelectedRowKeys([]);
    }
  }

  function handleDelete() {
    if (selectedRowKeys.length > 0) {
      handleCallbackAlert(
        "Are you sure you want delete these records?",
        deleteData
      );
    } else {
      handleInfoAlert("No record has been selected to delete!");
    }
  }

  function handleOnboard() {
    handleInfoAlert("Onboard Clicked!");
  }

  function handleInputClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleAdd(optionType) {
    const { ADD_MANUALLY, FROM_DISCOVERY } =
      dropdownButtonOptionsConstants.atom_add;
    if (optionType === ADD_MANUALLY) {
      setOpen(true);
    } else if (optionType === FROM_DISCOVERY) {
    }
  }

  function handleClose() {
    setRecordToEdit(null);
    setOpen(false);
  }

  function handleOpenSiteModal() {
    setSiteModalOpen(true);
  }

  function handleCloseSiteModal() {
    setSiteModalOpen(false);
  }

  function handleOpenRackModal() {
    setRackModalOpen(true);
  }

  function handleCloseRackModal() {
    setRackModalOpen(false);
  }

  function handleOpenPasswordGroupModal() {
    setPasswordGroupModalOpen(true);
  }

  function handleClosePasswordGroupModal() {
    setPasswordGroupModalOpen(false);
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  function handleChange(pagination, filters, sorter, extra) {
    console.log("Various parameters", pagination, filters, sorter, extra);
  }

  function handleExport(optionType) {
    const { ALL_DATA, TEMPLATE, COMPLETE, INCOMPLETE } =
      dropdownButtonOptionsConstants.atom_export;
    if (optionType === ALL_DATA) {
      jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    } else if (optionType === TEMPLATE) {
      jsonToExcel([generateObject(dataKeys)], FILE_NAME_EXPORT_TEMPLATE);
    } else if (optionType === COMPLETE) {
      jsonToExcel(
        dataSource.filter((item) => item.hasOwnProperty(ATOM_ID)),
        FILE_NAME_EXPORT_COMPLETE_DATA
      );
    } else if (optionType === INCOMPLETE) {
      jsonToExcel(
        dataSource.filter((item) => item.hasOwnProperty(ATOM_TRANSITION_ID)),
        FILE_NAME_EXPORT_INCOMPLETE_DATA
      );
    }
    handleSuccessAlert("File exported successfully.");
  }

  function handleEdit(record) {
    setRecordToEdit(record);
    setOpen(true);
  }

  // row selection
  function onSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Spin
      spinning={
        isFetchRecordsLoading || isAddRecordsLoading || isDeleteRecordsLoading
      }
    >
      <div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e, convertToJson, handlePostSeed)}
        />
        {open ? (
          <Modal
            open={open}
            handleClose={handleClose}
            recordToEdit={recordToEdit}
            handleOpenSiteModal={handleOpenSiteModal}
            handleOpenRackModal={handleOpenRackModal}
            handleOpenPasswordGroupModal={handleOpenPasswordGroupModal}
          />
        ) : null}

        {siteModalOpen ? (
          <SiteModal
            handleClose={handleCloseSiteModal}
            open={siteModalOpen}
            recordToEdit={null}
          />
        ) : null}

        {rackModalOpen ? (
          <RackModal
            handleClose={handleCloseRackModal}
            open={rackModalOpen}
            recordToEdit={null}
          />
        ) : null}

        {passwordGroupModalOpen ? (
          <PasswordGroupModal
            handleClose={handleClosePasswordGroupModal}
            open={passwordGroupModalOpen}
            recordToEdit={null}
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

        <DefaultCard sx={{ width: `${width - 105}px` }}>
          <PageHeader
            pageName={PAGE_NAME}
            buttons={buttonsConfigurationList}
            selectedRowKeys={selectedRowKeys}
          />
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
            size="small"
            scroll={{ x: getTableScrollWidth(displayColumns) }}
            onChange={handleChange}
            rowSelection={rowSelection}
            columns={displayColumns}
            dataSource={dataSource}
            rowKey={TABLE_DATA_UNIQUE_ID}
            style={{ whiteSpace: "pre" }}
            pagination={{
              defaultPageSize: 9,
              pageSizeOptions: [9, 50, 100, 500, 1000],
            }}
          />
        </DefaultCard>
      </div>
    </Spin>
  );
};

export default Index;
