import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/uamModule/sites/selectors";
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
} from "../../../store/features/uamModule/sites/apis";
import { jsonToExcel } from "../../../utils/helpers";
import {
  DELETE_PROMPT,
  DELETE_SELECTION_PROMPT,
  SUCCESSFUL_FILE_EXPORT_MESSAGE,
} from "../../../utils/constants";
import { useAuthorization } from "../../../hooks/useAuth";
import useErrorHandling, {
  TYPE_FETCH,
  TYPE_BULK,
} from "../../../hooks/useErrorHandling";
import useSweetAlert from "../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import DefaultPageTableSection from "../../../components/pageSections";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import DefaultSpinner from "../../../components/spinners";
import Modal from "./modal";
import {
  PAGE_NAME,
  PAGE_PATH,
  ELEMENT_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
  indexColumnNameConstants,
  DEFAULT_SITE,
} from "./constants";
import { MODULE_PATH } from "..";
import DataCenterStatusChart from "./chartsComponents/DataCenterStatusChart";
import { Row, Col } from "antd";
import TopSites from "./chartsComponents/TopSites";

const Index = () => {
  // hooks
  const { getUserInfoFromAccessToken, isPageEditable } = useAuthorization();

  // user information
  const userInfo = getUserInfoFromAccessToken();
  const roleConfigurations = userInfo?.configuration;

  // states
  const [pageEditable, setPageEditable] = useState(
    isPageEditable(roleConfigurations, MODULE_PATH, PAGE_PATH)
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // hooks
  const { handleSuccessAlert, handleInfoAlert, handleCallbackAlert } =
    useSweetAlert();
  const { columnDefinitions } = useIndexTableColumnDefinitions({
    pageEditable,
    handleEdit,
  });
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_export: { handleClick: handleDefaultExport },
    default_delete: {
      handleClick: handleDelete,
      visible: selectedRowKeys.length > 0 && pageEditable,
    },
    default_add: {
      handleClick: handleDefaultAdd,
      namePostfix: ELEMENT_NAME,
      visible: pageEditable,
    },
  });

  // states
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);
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
    data: deleteRecordsData,
    isSuccess: isDeleteRecordsSuccess,
    isError: isDeleteRecordsError,
    error: deleteRecordsError,
    type: TYPE_BULK,
    callback: handleEmptySelectedRowKeys,
  });

  // handlers
  function handleEmptySelectedRowKeys() {
    setSelectedRowKeys([]);
  }

  function deleteData(allowed) {
    if (allowed) {
      deleteRecords(selectedRowKeys);
    } else {
      setSelectedRowKeys([]);
    }
  }

  function handleDelete() {
    if (selectedRowKeys.length > 0) {
      handleCallbackAlert(DELETE_PROMPT, deleteData);
    } else {
      handleInfoAlert(DELETE_SELECTION_PROMPT);
    }
  }

  function handleEdit(record) {
    setRecordToEdit(record);
    setOpen(true);
  }

  function handleDefaultAdd() {
    setOpen(true);
  }

  function handleClose() {
    setRecordToEdit(null);
    setOpen(false);
  }

  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert(SUCCESSFUL_FILE_EXPORT_MESSAGE);
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  function getCheckboxProps(record) {
    return {
      disabled: record[indexColumnNameConstants.SITE_NAME] === DEFAULT_SITE,
    };
  }

  return (
    <DefaultSpinner spinning={isFetchRecordsLoading || isDeleteRecordsLoading}>
      <Row
        gutter={[32, 32]}
        justify="space-between"
        style={{ padding: "0 0 20px 0" }}
      >
        <Col span={8}>
          <div className="container">
            <h6 className="heading">Data Center Status</h6>
            {/* <DataCenterStatusChart /> */}
          </div>
        </Col>

        <Col span={16}>
          <div className="container">
            <h6 className="heading">Top Sites</h6>
            <TopSites />

          </div>
        </Col>
      </Row>

      {open ? (
        <Modal
          handleClose={handleClose}
          open={open}
          recordToEdit={recordToEdit}
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
        getCheckboxProps={getCheckboxProps}
        selectedRowKeys={pageEditable ? selectedRowKeys : null}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </DefaultSpinner>
  );
};

export default Index;
