import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../store/features/atomModule/atoms/apis";
import {
  useFetchSiteNamesQuery,
  useFetchRackNamesQuery,
  useFetchVendorNamesQuery,
  useFetchFunctionNamesQuery,
  useFetchDeviceTypeNamesQuery,
  useFetchPasswordGroupNamesQuery,
} from "../../../store/features/dropDowns/apis";
import {
  selectSiteNames,
  selectRackNames,
  selectVendorNames,
  selectFunctionNames,
  selectDeviceTypeNames,
  selectPasswordGroupNames,
} from "../../../store/features/dropDowns/selectors";
import {
  formSetter,
  generateNumbersArray,
  getTitle,
} from "../../../utils/helpers";
import FormModal from "../../../components/dialogs";
import DefaultFormUnit from "../../../components/formUnits";
import {
  SelectFormUnit,
  AddableSelectFormUnit,
} from "../../../components/formUnits";
import DefaultDialogFooter from "../../../components/dialogFooters";
import useErrorHandling, { TYPE_FETCH } from "../../../hooks/useErrorHandling";
import { TYPE_SINGLE } from "../../../hooks/useErrorHandling";
import {
  ATOM_ID,
  ATOM_TRANSITION_ID,
  PAGE_NAME,
  indexColumnNameConstants,
} from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.IP_ADDRESS]: yup
    .string()
    .required(`${getTitle(indexColumnNameConstants.IP_ADDRESS)} is required`),
});

const Index = ({
  handleClose,
  open,
  recordToEdit,
  handleOpenSiteModal,
  handleOpenRackModal,
  handleOpenPasswordGroupModal,
}) => {
  // useForm hook
  const { handleSubmit, control, setValue, watch } = useForm({
    resolver: yupResolver(schema),
  });

  // effects
  useEffect(() => {
    formSetter(recordToEdit, setValue);
  }, []);

  // fetching dropdowns data from backend using apis
  const {
    data: fetchSiteNamesData,
    isSuccess: isFetchSiteNamesSuccess,
    isLoading: isFetchSiteNamesLoading,
    isError: isFetchSiteNamesError,
    error: fetchSiteNamesError,
  } = useFetchSiteNamesQuery();

  const {
    data: fetchRackNamesData,
    isSuccess: isFetchRackNamesSuccess,
    isLoading: isFetchRackNamesLoading,
    isError: isFetchRackNamesError,
    error: fetchRackNamesError,
  } = useFetchRackNamesQuery(
    {
      site_name: watch(indexColumnNameConstants.SITE_NAME, ""),
    },
    { skip: watch(indexColumnNameConstants.SITE_NAME) === undefined }
  );

  const {
    data: fetchVendorNamesData,
    isSuccess: isFetchVendorNamesSuccess,
    isLoading: isFetchVendorNamesLoading,
    isError: isFetchVendorNamesError,
    error: fetchVendorNamesError,
  } = useFetchVendorNamesQuery();

  const {
    data: fetchFunctionNamesData,
    isSuccess: isFetchFunctionNamesSuccess,
    isLoading: isFetchFunctionNamesLoading,
    isError: isFetchFunctionNamesError,
    error: fetchFunctionNamesError,
  } = useFetchFunctionNamesQuery();

  const {
    data: fetchDeviceTypeNamesData,
    isSuccess: isFetchDeviceTypeNamesSuccess,
    isLoading: isFetchDeviceTypeNamesLoading,
    isError: isFetchDeviceTypeNamesError,
    error: fetchDeviceTypeNamesError,
  } = useFetchDeviceTypeNamesQuery();

  const {
    data: fetchPasswordGroupNamesData,
    isSuccess: isFetchPasswordGroupNamesSuccess,
    isLoading: isFetchPasswordGroupNamesLoading,
    isError: isFetchPasswordGroupNamesError,
    error: fetchPasswordGroupNamesError,
  } = useFetchPasswordGroupNamesQuery();

  // post api for the form
  const [
    addRecord,
    {
      data: addRecordData,
      isSuccess: isAddRecordSuccess,
      isLoading: isAddRecordLoading,
      isError: isAddRecordError,
      error: addRecordError,
    },
  ] = useAddRecordMutation();

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

  // error handling custom hooks
  useErrorHandling({
    data: addRecordData,
    isSuccess: isAddRecordSuccess,
    isError: isAddRecordError,
    error: addRecordError,
    type: TYPE_SINGLE,
    callback: handleClose,
  });

  useErrorHandling({
    data: updateRecordData,
    isSuccess: isUpdateRecordSuccess,
    isError: isUpdateRecordError,
    error: updateRecordError,
    type: TYPE_SINGLE,
    callback: handleClose,
  });

  useErrorHandling({
    data: fetchSiteNamesData,
    isSuccess: isFetchSiteNamesSuccess,
    isError: isFetchSiteNamesError,
    error: fetchSiteNamesError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: fetchRackNamesData,
    isSuccess: isFetchRackNamesSuccess,
    isError: isFetchRackNamesError,
    error: fetchRackNamesError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: fetchVendorNamesData,
    isSuccess: isFetchVendorNamesSuccess,
    isError: isFetchVendorNamesError,
    error: fetchVendorNamesError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: fetchFunctionNamesData,
    isSuccess: isFetchFunctionNamesSuccess,
    isError: isFetchFunctionNamesError,
    error: fetchFunctionNamesError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: fetchDeviceTypeNamesData,
    isSuccess: isFetchDeviceTypeNamesSuccess,
    isError: isFetchDeviceTypeNamesError,
    error: fetchDeviceTypeNamesError,
    type: TYPE_FETCH,
  });

  useErrorHandling({
    data: fetchPasswordGroupNamesData,
    isSuccess: isFetchPasswordGroupNamesSuccess,
    isError: isFetchPasswordGroupNamesError,
    error: fetchPasswordGroupNamesError,
    type: TYPE_FETCH,
  });

  // getting dropdowns data from the store
  const siteNames = useSelector(selectSiteNames);
  const rackNames = useSelector(selectRackNames);
  const vendorNames = useSelector(selectVendorNames);
  const functionNames = useSelector(selectFunctionNames);
  const deviceTypeNames = useSelector(selectDeviceTypeNames);
  const passwordGroupNames = useSelector(selectPasswordGroupNames);

  // on form submit
  const onSubmit = (data) => {
    console.log(data);
    if (recordToEdit) {
      if (recordToEdit[ATOM_ID]) {
        data[ATOM_ID] = recordToEdit[ATOM_ID];
      } else if (recordToEdit[ATOM_TRANSITION_ID]) {
        data[ATOM_TRANSITION_ID] = recordToEdit[ATOM_TRANSITION_ID];
      }
    }

    if (
      recordToEdit &&
      (recordToEdit[ATOM_ID] || recordToEdit[ATOM_TRANSITION_ID])
    ) {
      updateRecord(data);
    } else {
      addRecord(data);
    }
  };

  return (
    <FormModal
      title={`${recordToEdit ? "Edit" : "Add"} ${PAGE_NAME}`}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.IP_ADDRESS}
              required
            />
            <AddableSelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.SITE_NAME}
              options={siteNames}
              onAddClick={handleOpenSiteModal}
              spinning={isFetchSiteNamesLoading}
            />
            <AddableSelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.RACK_NAME}
              options={rackNames}
              onAddClick={handleOpenRackModal}
              spinning={isFetchRackNamesLoading}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.SECTION}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DEPARTMENT}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DEVICE_RU}
              options={generateNumbersArray(30)}
            />
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.FUNCTION}
              options={functionNames}
              spinning={isFetchFunctionNamesLoading}
            />
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DEVICE_TYPE}
              options={deviceTypeNames}
              spinning={isFetchDeviceTypeNamesLoading}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DEVICE_NAME}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.VENDOR}
              options={vendorNames}
              spinning={isFetchVendorNamesLoading}
            />
            <AddableSelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PASSWORD_GROUP}
              options={passwordGroupNames}
              onAddClick={handleOpenPasswordGroupModal}
              spinning={isFetchPasswordGroupNamesLoading}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.CRITICALITY}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.VIRTUAL}
            />
            <DefaultFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DOMAIN}
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
