import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  useFetchRecordsLazyQuery,
  useGetIpHistoryByIpAddressMutation,
} from "../../../../store/features/ipamModule/subnetsDropDown/ipHistory/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../../store/features/ipamModule/subnetsDropDown/ipHistory/selectors";
import { jsonToExcel } from "../../../../utils/helpers";
import { Spin } from "antd";
import useErrorHandling from "../../../../hooks/useErrorHandling";
import useSweetAlert from "../../../../hooks/useSweetAlert";
import useColumnsGenerator from "../../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import DefaultTableConfigurations from "../../../../components/tableConfigurations";
import useButtonsConfiguration from "../../../../hooks/useButtonsConfiguration";
import {
  PAGE_NAME,
  FILE_NAME_EXPORT_ALL_DATA,
  TABLE_DATA_UNIQUE_ID,
} from "./constants";
import { TYPE_FETCH } from "../../../../hooks/useErrorHandling";
import DefaultPageTableSection from "../../../../components/pageSections";
import { useDispatch } from "react-redux";
import { selectSelectedIpDetail } from "../../../../store/features/ipamModule/subnetsDropDown/ipDetails/selectors";
import { setSelectedIpDetail } from "../../../../store/features/ipamModule/subnetsDropDown/ipDetails";
import { indexColumnNameConstants as ipDetailsColumnNameConstants } from "../ipDetails/constants";
import IpDetailDetails from "./ipDetailDetails";

const Index = () => {
  // theme
  const theme = useTheme();
  const dispatch = useDispatch();

  // hooks
  const { handleSuccessAlert } = useSweetAlert();
  const { columnDefinitions } = useIndexTableColumnDefinitions({});
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
  const selectedIpDetail = useSelector(selectSelectedIpDetail);

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
    getIpHistoryByIpAddress,
    {
      data: getIpHistoryByIpAddressData,
      isSuccess: isGetIpHistoryByIpAddressSuccess,
      isLoading: isGetIpHistoryByIpAddressLoading,
      isError: isGetIpHistoryByIpAddressError,
      error: getIpHistoryByIpAddressError,
    },
  ] = useGetIpHistoryByIpAddressMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: getIpHistoryByIpAddressData,
    isSuccess: isGetIpHistoryByIpAddressSuccess,
    isError: isGetIpHistoryByIpAddressError,
    error: getIpHistoryByIpAddressError,
    type: TYPE_FETCH,
  });

  // effects
  useEffect(() => {
    if (selectedIpDetail) {
      getIpHistoryByIpAddress({
        [ipDetailsColumnNameConstants.IP_ADDRESS]:
          selectedIpDetail[ipDetailsColumnNameConstants.IP_ADDRESS],
      });
    } else {
      fetchRecords();
    }

    return () => {
      dispatch(setSelectedIpDetail(null));
    };
  }, []);

  // handlers
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

      {selectedIpDetail ? <IpDetailDetails /> : null}

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
