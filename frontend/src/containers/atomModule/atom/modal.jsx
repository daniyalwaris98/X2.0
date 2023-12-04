import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../components/dialogs";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../components/formUnits";
import {
  SelectFormUnit,
  AddableSelectFormUnit,
} from "../../../components/formUnits";
import DefaultDialogFooter from "../../../components/dialogFooters";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useUpdateRecordMutation,
  useAddRecordMutation,
} from "../../../store/features/atomModule/atom/apis";
import {
  useFetchSiteNamesQuery,
  useFetchRackNamesQuery,
  useFetchVendorNamesQuery,
  useFetchFunctionNamesQuery,
  useFetchDeviceTypeNamesQuery,
  useFetchPasswordGroupNamesQuery,
} from "../../../store/features/dropDowns/apis";
import { useSelector } from "react-redux";
import {
  selectSiteNames,
  selectRackNames,
  selectVendorNames,
  selectFunctionNames,
  selectDeviceTypeNames,
  selectPasswordGroupNames,
} from "../../../store/features/dropDowns/selectors";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { formSetter, generateNumbersArray } from "../../../utils/helpers";
import { TYPE_SINGLE } from "../../../hooks/useErrorHandling";
import { PAGE_NAME } from "./constants";
import { indexColumnNameConstants } from "./constants";

const schema = yup.object().shape({
  [indexColumnNameConstants.IP_ADDRESS]: yup
    .string()
    .required("Ip address is required"),
});

const Index = ({
  handleClose,
  open,
  recordToEdit,
  handleOpenSiteModal,
  handleOpenRackModal,
  handleOpenPasswordGroupModal,
}) => {
  // states
  const [initialRender, setInitialRender] = useState(true);

  // useForm hook
  const { handleSubmit, control, setValue, watch, trigger } = useForm({
    resolver: yupResolver(schema),
  });

  // effects
  useEffect(() => {
    formSetter(recordToEdit, setValue);
  }, []);

  useEffect(() => {
    // skip the first render
    // if (initialRender) {
    //   setInitialRender(false);
    //   return;
    // }
    // (async () => {
    //   // setValue("rack_name", "");
    //   await trigger("rack_name");
    // })();
  }, [watch(indexColumnNameConstants.SITE_NAME)]);

  // fetching dropdowns data from backend using apis
  const { error: siteNamesError, isLoading: isSiteNamesLoading } =
    useFetchSiteNamesQuery();
  const { error: rackNamesError, isLoading: isRackNamesLoading } =
    useFetchRackNamesQuery(
      {
        site_name: watch(indexColumnNameConstants.SITE_NAME, ""),
      },
      { skip: watch(indexColumnNameConstants.SITE_NAME) === undefined }
    );

  const { error: vendorNamesError, isLoading: isVendorNamesLoading } =
    useFetchVendorNamesQuery();
  const { error: functionNamesError, isLoading: isFunctionNamesLoading } =
    useFetchFunctionNamesQuery();
  const { error: deviceTypeNamesError, isLoading: isDeviceTypeNamesLoading } =
    useFetchDeviceTypeNamesQuery();
  const {
    error: passwordGroupNamesError,
    isLoading: isPasswordGroupNamesLoading,
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
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "15px" }}>
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
            />
            <AddableSelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.RACK_NAME}
              options={rackNames}
              onAddClick={handleOpenRackModal}
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
            />
            <SelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.DEVICE_TYPE}
              options={deviceTypeNames}
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
            />
            <AddableSelectFormUnit
              control={control}
              dataKey={indexColumnNameConstants.PASSWORD_GROUP}
              options={passwordGroupNames}
              onAddClick={handleOpenPasswordGroupModal}
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
