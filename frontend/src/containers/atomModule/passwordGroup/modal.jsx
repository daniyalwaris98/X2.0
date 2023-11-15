import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../components/formUnits";
import { SelectFormUnit } from "../../../components/formUnits";
import DefaultButton from "../../../components/buttons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import {
  useUpdateTableSingleDataMutation,
  useAddTableSingleDataMutation,
} from "../../../store/features/atomModule/passwordGroup/apis";
import { useFetchPasswordGroupsQuery } from "../../../store/features/dropDowns/apis";
import { useSelector } from "react-redux";
import { selectPasswordGroups } from "../../../store/features/dropDowns/selectors";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { formSetter, generateNumbersArray } from "../../../utils/helpers";

const schema = yup.object().shape({
  password_group: yup.string().required("Password Group is required"),
  user_name: yup.string().required("User name is required"),
  password: yup.string().required("Password is required"),
});

const Index = ({ handleClose, open, recordToEdit }) => {
  const theme = useTheme();

  // states

  // useForm hook
  const { handleSubmit, control, setValue, watch, trigger } = useForm({
    resolver: yupResolver(schema),
  });

  // effects
  useEffect(() => {
    formSetter(recordToEdit, setValue);
  }, []);

  // fetching dropdowns data from backend using apis
  const { error: passwordGroupsError, isLoading: isPasswordGroupsLoading } =
    useFetchPasswordGroupsQuery();

  // post api for the form
  const [
    addTableSingleData,
    {
      data: addedTableSingleData,
      isSuccess: isAddTableSingleDataSuccess,
      isLoading: isAddTableSingleDataLoading,
      isError: isAddTableSingleDataError,
      error: addTableSingleDataError,
    },
  ] = useAddTableSingleDataMutation();

  const [
    updateTableSingleData,
    {
      data: updatedTableSingleData,
      isSuccess: isUpdateTableSingleDataSuccess,
      isLoading: isUpdateTableSingleDataLoading,
      isError: isUpdateTableSingleDataError,
      error: updateTableSingleDataError,
    },
  ] = useUpdateTableSingleDataMutation();

  // error handling custom hooks
  useErrorHandling({
    data: updatedTableSingleData,
    isSuccess: isUpdateTableSingleDataSuccess,
    isError: isUpdateTableSingleDataError,
    error: updateTableSingleDataError,
    type: "single",
  });

  useErrorHandling({
    data: addedTableSingleData,
    isSuccess: isAddTableSingleDataSuccess,
    isError: isAddTableSingleDataError,
    error: addTableSingleDataError,
    type: "single",
  });

  // getting dropdowns data from the store
  const passwordGroups = useSelector(selectPasswordGroups);

  // on form submit
  const onSubmit = (data) => {
    if (recordToEdit) {
      data.password_group_id = recordToEdit.password_group_id;
      updateTableSingleData(data);
    } else {
      addTableSingleData(data);
    }
  };

  return (
    <FormModal
      sx={{ zIndex: "999" }}
      title={`${recordToEdit ? "Edit" : "Add"} Password Group`}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px" }}>
        <Grid container>
          <Grid item xs={12}>
            <SelectFormUnit
              control={control}
              dataKey="password_group"
              options={passwordGroups}
              required
            />
            <DefaultFormUnit control={control} dataKey="user_name" required />
            <DefaultFormUnit control={control} dataKey="password" required />
          </Grid>
          <Grid item xs={12}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DefaultButton
                handleClick={handleClose}
                sx={{ backgroundColor: theme.palette.color.danger }}
              >
                <></>
                Cancel
              </DefaultButton>
              &nbsp; &nbsp;
              <DefaultButton
                type="submit"
                sx={{ backgroundColor: theme.palette.color.primary }}
              >
                <></>
                Submit
              </DefaultButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </FormModal>
  );
};

export default Index;
