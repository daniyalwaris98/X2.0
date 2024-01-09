import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultDialog from "../../../../components/dialogs";
import { CancelDialogFooter } from "../../../../components/dialogFooters";
import Grid from "@mui/material/Grid";
import { useGetIpHistoryByIpAddressQuery } from "../../../../store/features/ipamModule/subnetsDropDown/ipHistory/apis";
import { useSelector } from "react-redux";
import { selectIpHistoryByIpAddress } from "../../../../store/features/ipamModule/subnetsDropDown/ipHistory/selectors";
import { Spin } from "antd";
import useErrorHandling from "../../../../hooks/useErrorHandling";
import useColumnsGenerator from "../../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import DefaultTableConfigurations from "../../../../components/tableConfigurations";
import useButtonsConfiguration from "../../../../hooks/useButtonsConfiguration";
import { PAGE_NAME, TABLE_DATA_UNIQUE_ID } from "./constants";
import { TYPE_FETCH } from "../../../../hooks/useErrorHandling";
import DefaultPageTableSection from "../../../../components/pageSections";
import { indexColumnNameConstants } from "../ipDetails/constants";
import { getTitle } from "../../../../utils/helpers";

const Index = ({ handleClose, open, ipAddress }) => {
  const theme = useTheme();

  // hooks
  const { columnDefinitions } = useIndexTableColumnDefinitions({});
  const generatedColumns = useColumnsGenerator({ columnDefinitions });
  const { buttonsConfigurationList } = useButtonsConfiguration({
    configure_table: { handleClick: handleTableConfigurationsOpen },
  });

  // states
  const [tableConfigurationsOpen, setTableConfigurationsOpen] = useState(false);
  const [columns, setColumns] = useState(generatedColumns);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState(generatedColumns);

  // apis
  const {
    data: getIpHistoryByIpAddressData,
    isSuccess: isGetIpHistoryByIpAddressSuccess,
    isLoading: isGetIpHistoryByIpAddressLoading,
    isError: isGetIpHistoryByIpAddressError,
    error: getIpHistoryByIpAddressError,
  } = useGetIpHistoryByIpAddressQuery({
    [indexColumnNameConstants.IP_ADDRESS]: ipAddress,
  });

  // error handling custom hooks
  useErrorHandling({
    data: getIpHistoryByIpAddressData,
    isSuccess: isGetIpHistoryByIpAddressSuccess,
    isError: isGetIpHistoryByIpAddressError,
    error: getIpHistoryByIpAddressError,
    type: TYPE_FETCH,
  });

  // getting dropdowns data from the store
  const dataSource = useSelector(selectIpHistoryByIpAddress);

  // handlers
  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <DefaultDialog
      sx={{ content: { padding: 0 } }}
      title={`${PAGE_NAME} by ${getTitle(
        indexColumnNameConstants.IP_ADDRESS
      )} => ${ipAddress}`}
      open={open}
    >
      <Grid container>
        <Grid item xs={12}>
          <Spin spinning={isGetIpHistoryByIpAddressLoading}>
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
              dynamicWidth={false}
            />
          </Spin>
        </Grid>
        <Grid item xs={12}>
          <CancelDialogFooter handleClose={handleClose} />
        </Grid>
      </Grid>
    </DefaultDialog>
  );
};

export default Index;
