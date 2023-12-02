import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Modal from "./modal";
import {
  useFetchRecordsQuery,
  useAddRecordsMutation,
  useDeleteRecordsMutation,
  useOnBoardRecordsMutation,
} from "../../../store/features/atomModule/atom/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/atomModule/atom/selectors";
import {
  jsonToExcel,
  convertToJson,
  handleFileChange,
  generateObject,
} from "../../../utils/helpers";
import { Spin } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
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
import DefaultPageTableSection from "../../../components/pageSections";

const Index = () => {
  // theme
  const theme = useTheme();

  // states required in hooks
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // apis required in hooks
  const {
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isLoading: isFetchRecordsLoading,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
  } = useFetchRecordsQuery();

  // hooks
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
      default_delete: {
        handleClick: handleDelete,
        visible: selectedRowKeys.length > 0,
      },
      default_onboard: {
        handleClick: handleOnBoard,
        visible: shouldOnboardBeVisible(),
      },
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

  const [
    onBoardRecords,
    {
      data: OnBoardRecordsData,
      isSuccess: isOnBoardRecordsSuccess,
      isLoading: isOnBoardRecordsLoading,
      isError: isOnBoardRecordsError,
      error: OnBoardRecordsError,
    },
  ] = useOnBoardRecordsMutation();

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

  useErrorHandling({
    data: OnBoardRecordsData,
    isSuccess: isOnBoardRecordsSuccess,
    isError: isOnBoardRecordsError,
    error: OnBoardRecordsError,
    type: TYPE_BULK,
  });

  // effects
  useEffect(() => {
    setSelectedRowKeys((prev) =>
      prev.filter((item) => !deleteRecordsData?.data.includes(item))
    );
  }, [isDeleteRecordsSuccess]);

  // handlers
  function shouldOnboardBeVisible() {
    if (selectedRowKeys.length > 0) {
      return selectedRowKeys.some((key) => {
        let atom = fetchRecordsData.find((item) => item.atom_table_id === key);
        return atom && atom.atom_id;
      });
    }
    return false;
  }

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
        "Are you sure you want to delete these records?",
        deleteData
      );
    } else {
      handleInfoAlert("No record has been selected to delete!");
    }
  }

  function onBoardData(allowed) {
    if (allowed) {
      const onBoardData = selectedRowKeys.map((rowKey) => {
        const dataObject = dataSource.find(
          (row) => row.atom_table_id === rowKey
        );

        if (dataObject.atom_id) {
          return dataObject.ip_address;
        }

        return null;
      });

      const filteredOnBoardDataData = onBoardData.filter(
        (data) => data !== null
      );

      if (filteredOnBoardDataData.length > 0) {
        onBoardRecords(filteredOnBoardDataData);
      }
    } else {
      setSelectedRowKeys([]);
    }
  }

  function handleOnBoard() {
    if (selectedRowKeys.length > 0) {
      handleCallbackAlert(
        "Only the complete atoms will be onBoarded. Are you sure you want to proceed?",
        onBoardData
      );
    } else {
      handleInfoAlert("No record has been selected to onBoard!");
    }
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

  return (
    <Spin
      spinning={
        isFetchRecordsLoading ||
        isAddRecordsLoading ||
        isDeleteRecordsLoading ||
        isOnBoardRecordsLoading
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

        <DefaultPageTableSection
          PAGE_NAME={PAGE_NAME}
          TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
          buttonsConfigurationList={buttonsConfigurationList}
          selectedRowKeys={selectedRowKeys}
          displayColumns={displayColumns}
          dataSource={dataSource}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </div>
    </Spin>
  );
};

export default Index;
