import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/monitoringModule/devices/selectors";
import { setSelectedDevice } from "../../../store/features/monitoringModule/devices";
import { useFetchMonitoringCredentialsNamesQuery } from "../../../store/features/dropDowns/apis";
import {
  useFetchRecordsQuery,
  useStartMonitoringLazyQuery,
} from "../../../store/features/monitoringModule/devices/apis";
import { jsonToExcel } from "../../../utils/helpers";
import { SUCCESSFUL_FILE_EXPORT_MESSAGE } from "../../../utils/constants";
import { useAuthorization } from "../../../hooks/useAuth";
import useErrorHandling, {
  TYPE_BULK_MONITORING,
  TYPE_FETCH,
} from "../../../hooks/useErrorHandling";
import useSweetAlert from "../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../hooks/useColumnsGenerator";
import DefaultPageTableSection from "../../../components/pageSections";
import DefaultTableConfigurations from "../../../components/tableConfigurations";
import DefaultSpinner from "../../../components/spinners";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import { PAGE_PATH as PAGE_PATH_SUMMARY } from "../devicesLanding/summary/constants";
import { LANDING_PAGE_PATH } from "../devicesLanding";
import AddModal from "./addModal";
import UpdateModal from "./updateModal";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import {
  PAGE_NAME,
  ELEMENT_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
  PAGE_PATH,
} from "./constants";
import { MODULE_PATH } from "..";
import { MAIN_LAYOUT_PATH } from "../../../layouts/mainLayout";
import { Row, Col } from "antd";
import ResponseTimeChart from "./Component/ResponseTimeChart";

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

  // hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleSuccessAlert } = useSweetAlert();
  const { columnDefinitions } = useIndexTableColumnDefinitions({
    pageEditable,
    handleEdit,
    handleIpAddressClick,
  });
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
    default_export: { handleClick: handleDefaultExport },
    start_monitoring: {
      handleClick: handleStartMonitoring,
      visible: pageEditable,
    },
    default_add: {
      handleClick: handleAdd,
      namePostfix: ELEMENT_NAME,
      visible: pageEditable,
    },
  });

  // states
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
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
    startMonitoring,
    {
      data: startMonitoringData,
      isSuccess: isStartMonitoringSuccess,
      isLoading: isStartMonitoringLoading,
      isError: isStartMonitoringError,
      error: startMonitoringError,
    },
  ] = useStartMonitoringLazyQuery();

  const {
    data: monitoringCredentialsNamesData,
    isSuccess: isMonitoringCredentialsNamesSuccess,
    isLoading: isMonitoringCredentialsNamesLoading,
    isError: isMonitoringCredentialsNamesError,
    error: monitoringCredentialsNamesError,
  } = useFetchMonitoringCredentialsNamesQuery();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: startMonitoringData,
    isSuccess: isStartMonitoringSuccess,
    isError: isStartMonitoringError,
    error: startMonitoringError,
    type: TYPE_BULK_MONITORING,
  });

  useErrorHandling({
    data: monitoringCredentialsNamesData,
    isSuccess: isMonitoringCredentialsNamesSuccess,
    isError: isMonitoringCredentialsNamesError,
    error: monitoringCredentialsNamesError,
    type: TYPE_FETCH,
  });

  // handlers
  function handleIpAddressClick(record) {
    dispatch(setSelectedDevice(record));
    navigate(
      `/${MAIN_LAYOUT_PATH}/${MODULE_PATH}/${LANDING_PAGE_PATH}/${PAGE_PATH_SUMMARY}`
    );
  }

  function handleEdit(record) {
    setRecordToEdit(record);
    setOpenUpdateModal(true);
  }

  function handleAdd() {
    setOpenAddModal(true);
  }

  function handleStartMonitoring() {
    startMonitoring();
  }

  function handleCloseAdd() {
    setOpenAddModal(false);
  }

  function handleCloseUpdate() {
    setOpenUpdateModal(false);
  }

  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert(SUCCESSFUL_FILE_EXPORT_MESSAGE);
  }

  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <DefaultSpinner
      spinning={
        isFetchRecordsLoading ||
        isMonitoringCredentialsNamesLoading ||
        isMonitoringCredentialsNamesLoading ||
        isStartMonitoringLoading
      }
    >
      <Row
        gutter={[32, 32]}
        justify="space-between"
        style={{ padding: "0 0 20px 0" }}
      >
        <Col span={24}>
          <div className="container">
            <h6 className="heading"></h6>
            <ResponseTimeChart />
          </div>
        </Col>
      </Row>

      {openAddModal ? (
        <AddModal handleClose={handleCloseAdd} open={openAddModal} />
      ) : null}

      {openUpdateModal ? (
        <UpdateModal
          handleClose={handleCloseUpdate}
          open={openUpdateModal}
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
      />
    </DefaultSpinner>
  );
};

export default Index;
