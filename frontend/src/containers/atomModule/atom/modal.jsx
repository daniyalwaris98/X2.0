import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../components/formUnits";
import { SelectFormUnit } from "../../../components/formUnits";
import DefaultButton from "../../../components/buttons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme, styled } from "@mui/material/styles";
import {
  useUpdateTableSingleDataMutation,
  useAddTableSingleDataMutation,
} from "../../../store/features/atomModule/atom/apis";
import {
  useFetchSitesQuery,
  useFetchRacksQuery,
  useFetchVendorsQuery,
  useFetchFunctionsQuery,
  useFetchDeviceTypesQuery,
  useFetchPasswordGroupsQuery,
} from "../../../store/features/dropDowns/apis";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSites,
  selectRacks,
  selectVendors,
  selectFunctions,
  selectDeviceRus,
  selectDeviceTypes,
  selectPasswordGroups,
} from "../../../store/features/dropDowns/selectors";
import {
  handleSuccessAlert,
  handleInfoAlert,
  handleCallbackAlert,
  handleErrorAlert,
} from "../../../components/sweetAlertWrapper";

const schema = yup.object().shape({
  ip_address: yup.string().required("Ip address is required"),
  site_name: yup.string().required("Site name is required"),
  rack_name: yup.string().required("Rack name is required"),
  device_name: yup.string().required("Device name is required"),
  device_ru: yup.string().required("Device ru is required"),
  function: yup.string().required("Function is required"),
  device_type: yup.string().required("Device type is required"),
  vendor: yup.string().required("Vendor is required"),
  criticality: yup.string().required("Criticality is required"),
  password_group: yup.string().required("Password group is required"),
});

const Index = ({ handleClose, open, recordToEdit }) => {
  const theme = useTheme();
  // useForm hook
  const { handleSubmit, control, setValue, watch, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    formSetter(recordToEdit);
  }, []);

  // useEffect(() => {
  //   resetField("rack_name");
  // }, [watch("site_name")]);

  console.log("rack_name", watch("rack_name"));
  console.log("site_name", watch("site_name"));

  const formSetter = (data) => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key, data[key]);
      });
    }
  };

  // fetching dropdowns data from backend using apis
  const { error: sitesError, isLoading: isSitesLoading } = useFetchSitesQuery();
  const { error: racksError, isLoading: isRacksLoading } = useFetchRacksQuery(
    {
      site_name: watch("site_name", ""),
    },
    { skip: watch("site_name") === undefined }
  );

  const { error: vendorsError, isLoading: isVendorsLoading } =
    useFetchVendorsQuery();
  const { error: functionsError, isLoading: isFunctionsLoading } =
    useFetchFunctionsQuery();
  // const { error:deviceRuError, isLoading: isDeviceRusLoading } = useFetchDeviceRusQuery();
  const { error: deviceTypesError, isLoading: isDeviceTypesLoading } =
    useFetchDeviceTypesQuery();
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

  // effects
  useEffect(() => {
    if (isAddTableSingleDataError) {
      handleErrorAlert(addTableSingleDataError.data);
    } else if (isAddTableSingleDataSuccess) {
      handleSuccessAlert(addedTableSingleData.message);
    }
  }, [isAddTableSingleDataSuccess, isAddTableSingleDataError]);

  useEffect(() => {
    if (isUpdateTableSingleDataError) {
      handleErrorAlert(updateTableSingleDataError.data);
    } else if (isUpdateTableSingleDataSuccess) {
      handleSuccessAlert(updatedTableSingleData.message);
    }
  }, [isUpdateTableSingleDataSuccess, isUpdateTableSingleDataError]);

  // getting dropdowns data from the store
  const sites = useSelector(selectSites);
  const racks = useSelector(selectRacks);
  const vendors = useSelector(selectVendors);
  const functions = useSelector(selectFunctions);
  const deviceTypes = useSelector(selectDeviceTypes);
  const passwordGroups = useSelector(selectPasswordGroups);

  // function to reset a specific field
  const resetField = (fieldName) => {
    reset({ [fieldName]: "" });
  };

  const onSubmit = (data) => {
    console.log(data);
    if (recordToEdit) {
      if (recordToEdit.atom_id) {
        data.atom_id = recordToEdit.atom_id;
      } else if (recordToEdit.atom_transition_id) {
        data.atom_transition_id = recordToEdit.atom_transition_id;
      }
    }

    if (
      recordToEdit &&
      (recordToEdit.atom_id || recordToEdit.atom_transition_id)
    ) {
      updateTableSingleData(data);
    } else {
      addTableSingleData(data);
    }
    // handleClose();
  };

  const generateNumbersArray = (upToValue) => {
    return Array.from({ length: upToValue + 1 }, (_, index) => index);
  };

  return (
    <FormModal
      sx={{ zIndex: "999" }}
      title={`${recordToEdit ? "Edit" : "Add"} Atom`}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <DefaultFormUnit control={control} dataKey="ip_address" required />
            <SelectFormUnit
              control={control}
              dataKey="site_name"
              options={sites}
              required
            />
            <SelectFormUnit
              control={control}
              dataKey="rack_name"
              options={racks}
              required
            />
            <DefaultFormUnit control={control} dataKey="device_name" required />
            <SelectFormUnit
              control={control}
              dataKey="device_ru"
              options={generateNumbersArray(30)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DefaultFormUnit control={control} dataKey="department" />
            <DefaultFormUnit control={control} dataKey="domain" />
            <DefaultFormUnit control={control} dataKey="section" />
            <SelectFormUnit
              control={control}
              dataKey="function"
              options={functions}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DefaultFormUnit control={control} dataKey="virtual" />
            <SelectFormUnit
              control={control}
              dataKey="device_type"
              options={deviceTypes}
              required
            />
            <SelectFormUnit
              control={control}
              dataKey="vendor"
              options={vendors}
              required
            />
            <DefaultFormUnit control={control} dataKey="criticality" required />
            <SelectFormUnit
              control={control}
              dataKey="password_group"
              options={passwordGroups}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DefaultButton
                handleClick={handleClose}
                sx={{ backgroundColor: theme.palette.color.danger }}
              >
                Cancel
              </DefaultButton>
              &nbsp; &nbsp;
              <DefaultButton
                type="submit"
                sx={{ backgroundColor: theme.palette.color.primary }}
              >
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
