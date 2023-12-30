import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultDialog from "../../../../components/dialogs";
import { CancelDialogFooter } from "../../../../components/dialogFooters";
import Grid from "@mui/material/Grid";
import { useGetIpDetailsBySubnetAddressQuery } from "../../../../store/features/ipamModule/subnetsDropDown/ipDetails/apis";
import { useSelector } from "react-redux";
import { selectIpDetailsBySubnetAddress } from "../../../../store/features/ipamModule/subnetsDropDown/ipDetails/selectors";
import { Spin } from "antd";
import useErrorHandling from "../../../../hooks/useErrorHandling";
import useColumnsGenerator from "../../../../hooks/useColumnsGenerator";
import { useIndexTableColumnDefinitions } from "./columnDefinitions";
import DefaultTableConfigurations from "../../../../components/tableConfigurations";
import useButtonsConfiguration from "../../../../hooks/useButtonsConfiguration";
import { PAGE_NAME, TABLE_DATA_UNIQUE_ID } from "./constants";
import { TYPE_FETCH } from "../../../../hooks/useErrorHandling";
import { PageTableSectionWithoutWidth } from "../../../../components/pageSections";
import { indexColumnNameConstants } from "../subnets/constants";
import { getTitle } from "../../../../utils/helpers";

const Index = ({
  handleClose,
  handleIpHistoryModalOpen,
  open,
  subnetAddress,
}) => {
  const theme = useTheme();

  // hooks
  const { columnDefinitions } = useIndexTableColumnDefinitions({
    handleIpHistoryModalOpen,
  });
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
    data: getIpDetailsBySubnetAddressData,
    isSuccess: isGetIpDetailsBySubnetAddressSuccess,
    isLoading: isGetIpDetailsBySubnetAddressLoading,
    isError: isGetIpDetailsBySubnetAddressError,
    error: getIpDetailsBySubnetAddressError,
  } = useGetIpDetailsBySubnetAddressQuery({
    [indexColumnNameConstants.SUBNET_ADDRESS]: subnetAddress,
  });

  // error handling custom hooks
  useErrorHandling({
    data: getIpDetailsBySubnetAddressData,
    isSuccess: isGetIpDetailsBySubnetAddressSuccess,
    isError: isGetIpDetailsBySubnetAddressError,
    error: getIpDetailsBySubnetAddressError,
    type: TYPE_FETCH,
  });

  // getting dropdowns data from the store
  const dataSource = useSelector(selectIpDetailsBySubnetAddress);

  // handlers
  function handleTableConfigurationsOpen() {
    setTableConfigurationsOpen(true);
  }

  return (
    <DefaultDialog
      sx={{ content: { padding: 0 } }}
      title={`${PAGE_NAME} by ${getTitle(
        indexColumnNameConstants.SUBNET_ADDRESS
      )} => ${subnetAddress}`}
      open={open}
    >
      <Grid container>
        <Grid item xs={12}>
          <Spin spinning={isGetIpDetailsBySubnetAddressLoading}>
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

            <PageTableSectionWithoutWidth
              PAGE_NAME={PAGE_NAME}
              TABLE_DATA_UNIQUE_ID={TABLE_DATA_UNIQUE_ID}
              buttonsConfigurationList={buttonsConfigurationList}
              displayColumns={displayColumns}
              dataSource={dataSource}
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
