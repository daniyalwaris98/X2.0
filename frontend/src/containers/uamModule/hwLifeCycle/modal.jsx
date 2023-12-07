import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../components/formUnits";
import DefaultDialogFooter from "../../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import { useUpdateRecordMutation } from "../../../store/features/uamModule/hwLifeCycle/apis";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { formSetter } from "../../../utils/helpers";
import { PAGE_NAME, indexColumnNameConstants } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.PN_CODE]: yup
    .string()
    .required("PN Code is required"),
});

const Index = ({ handleClose, open, recordToEdit }) => {
  const theme = useTheme();

  // useForm hook
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  // effects
  useEffect(() => {
    formSetter(recordToEdit, setValue);
  }, []);

  const [
    updateRecord,
    {
      data: updateRecordData,
      isSuccess: isUpdateRecordSuccess,
      isLoading: isUpdateRecordLoading,
      isError: isUpdateRecordError,
      error: updateRecordError,
    },
  ] = useUpdateRecordMutation();

  useErrorHandling({
    data: updateRecordData,
    isSuccess: isUpdateRecordSuccess,
    isError: isUpdateRecordError,
    error: updateRecordError,
    type: "single",
  });

  // on form submit
  const onSubmit = (data) => {
    if (recordToEdit) {
      data.sntc_id = recordToEdit.sntc_id;
      updateRecord(data);
    }
  };

  return (
    <FormModal
      sx={{ zIndex: "999" }}
      title={`${recordToEdit ? "Edit" : "Add"} ${PAGE_NAME}`}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PN_CODE}
              required
            />

            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.HW_EOL_DATE}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.HW_EOS_DATE}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.SW_EOS_DATE}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.SW_EOL_DATE}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.MANUFACTURE_DATE}
            />
          </Grid>

          <Grid item xs={12}>
            <DefaultDialogFooter handleClose={handleClose} />
          </Grid>
        </Grid>
      </form>
    </FormModal>
  );
};

export default Index;
