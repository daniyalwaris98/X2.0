import React from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../../components/dialogs";
import Grid from "@mui/material/Grid";
import { SelectFormUnitWithHiddenValues } from "../../../../components/formUnits";
import { CompareDialogFooter } from "../../../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import { useCompareNcmConfigurationBackupsMutation } from "../../../../store/features/ncmModule/manageConfigurations/configurationBackups/apis";
import { selectTableData } from "../../../../store/features/ncmModule/manageConfigurations/configurationBackups/selectors";
import { useSelector } from "react-redux";
import useErrorHandling from "../../../../hooks/useErrorHandling";
import { getTitle } from "../../../../utils/helpers";
import { TYPE_SINGLE } from "../../../../hooks/useErrorHandling";
import { ELEMENT_NAME } from "./constants";
import { compareModalConstants } from "./constants";
import { Spin } from "antd";
import ReactHtmlParser from "react-html-parser";

const schema = yup.object().shape({
  [compareModalConstants.CONFIGURATION_TO_BE_COMPARED]: yup
    .string()
    .required(
      `${getTitle(
        compareModalConstants.CONFIGURATION_TO_BE_COMPARED
      )} is required`
    ),
  [compareModalConstants.COMPARE_TO]: yup
    .string()
    .required(`${getTitle(compareModalConstants.COMPARE_TO)} is required`),
});

const Index = ({ handleClose, open }) => {
  const theme = useTheme();

  // useForm hook
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });

  // apis
  const [
    compareBackups,
    {
      data: compareBackupsData,
      isSuccess: isCompareBackupsSuccess,
      isLoading: isCompareBackupsLoading,
      isError: isCompareBackupsError,
      error: compareBackupsError,
    },
  ] = useCompareNcmConfigurationBackupsMutation();

  // error handling custom hooks
  useErrorHandling({
    data: compareBackupsData,
    isSuccess: isCompareBackupsSuccess,
    isError: isCompareBackupsError,
    error: compareBackupsError,
    type: TYPE_SINGLE,
  });

  // getting data from the store
  const dataSource = useSelector(selectTableData);
  const derivedOptions = dataSource.map((item) => ({
    name: `${item.file_name}-${item.date}`,
    value: item.ncm_history_id,
  }));

  // on form submit
  const onSubmit = (data) => {
    compareBackups({
      ncm_history_id_1:
        data[compareModalConstants.CONFIGURATION_TO_BE_COMPARED],
      ncm_history_id_2: data[compareModalConstants.COMPARE_TO],
    });
  };

  return (
    <FormModal
      sx={{ zIndex: "999" }}
      title={`${"Compare"} ${ELEMENT_NAME}`}
      open={open}
    >
      <Spin spinning={isCompareBackupsLoading}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SelectFormUnitWithHiddenValues
                control={control}
                dataKey={compareModalConstants.CONFIGURATION_TO_BE_COMPARED}
                options={derivedOptions}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <SelectFormUnitWithHiddenValues
                control={control}
                dataKey={compareModalConstants.COMPARE_TO}
                options={derivedOptions}
                required
              />
            </Grid>
            <Grid item xs={12}>
              {/* {compareBackupsData ? ( */}
              <div
                style={{
                  margin: "8px",

                  borderRadius: "12px",
                  backgroundColor: "#fcfcfc",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                  }}
                >
                  {ReactHtmlParser(compareBackupsData)}
                </div>
              </div>
              {/* ) : null} */}
            </Grid>
            <Grid item xs={12}>
              <CompareDialogFooter handleClose={handleClose} />
            </Grid>
          </Grid>
        </form>
      </Spin>
    </FormModal>
  );
};

export default Index;
