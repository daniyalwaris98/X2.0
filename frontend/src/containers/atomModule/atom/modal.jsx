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
import { useAddTableSingleDataMutation } from "../../../store/features/atomModule/atom/apis";
import {
  useFetchSitesQuery,
  useFetchRacksQuery,
  useFetchVendorsQuery,
  useFetchFunctionsQuery,
  //useFetchDeviceRusQuery,
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

const schema = yup.object().shape({
  ip_address: yup.string().required("Ip address is required"),
  site_name: yup.string().required("Site name is required"),
  rack_name: yup.string().required("Rack name is required"),
  device_name: yup.string().required("Device name is required"),
  device_ru: yup.string().required("Device ru is required"),
  function: yup.string().required("function is required"),
  device_type: yup.string().required("device type is required"),
  password_group: yup.string().required("password group is required"),
});

const Index = ({ handleClose, open }) => {
  const theme = useTheme();
  // useForm hook
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  // useStates
  const [selectedSite, setSelectedSite] = useState("");

  // fetching dropdowns data from backend using apis
  const {
    data: sitesData,
    error: sitesError,
    isLoading: isSitesLoading,
  } = useFetchSitesQuery();
  const { error: racksError, isLoading: isRacksLoading } = useFetchRacksQuery(
    {
      site_name: selectedSite,
    },
    { skip: selectedSite === "" }
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
  const [addTableSingleData, { isLoading, isError }] =
    useAddTableSingleDataMutation();

  // getting dropdowns data from the store
  const sites = useSelector(selectSites);
  const racks = useSelector(selectRacks);
  const vendors = useSelector(selectVendors);
  const functions = useSelector(selectFunctions);
  const deviceRus = useSelector(selectDeviceRus);
  const deviceTypes = useSelector(selectDeviceTypes);
  const passwordGroups = useSelector(selectPasswordGroups);

  useEffect(() => {
    if (sitesData && sitesData.length > 0) {
      setValue("site_name", sitesData[0]);
      setSelectedSite(sitesData[0]); // Assuming sitesData is an array
    }
  }, [sitesData]);

  const onSubmit = (data) => {
    console.log(data);
    addTableSingleData(data);
  };

  const handleOnSitesChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedSite(selectedValue);
    console.log("mySelect", e.target.value);
  };

  return (
    <FormModal title="Add Atom" open={open}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <DefaultFormUnit control={control} dataKey="ip_address" required />
            <SelectFormUnit
              control={control}
              dataKey="site_name"
              options={sites}
              required
              onChange={handleOnSitesChange}
            />
            <SelectFormUnit
              control={control}
              dataKey="rack_name"
              options={racks}
              required
            />
            <DefaultFormUnit control={control} dataKey="device_name" required />
            {/* <SelectFormUnit
              control={control}
              dataKey="device_ru"
              options={deviceRus}
              required
            /> */}
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
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "7px 25px",
                  border: `1px solid ${theme.palette.color.checkboxBorder}`,
                  backgroundColor: theme.palette.color.main,
                  color: theme.palette.textColor.default,
                  "&:hover": {
                    backgroundColor: theme.palette.color.main,
                  },
                }}
                handleClick={handleClose}
              >
                <span sx={{ fontSize: "16px", textTransform: "capitalize" }}>
                  Cancel
                </span>
              </DefaultButton>
              &nbsp; &nbsp;
              <DefaultButton
                type="submit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "7px 25px",
                  backgroundColor: theme.palette.color.primary,
                  color: theme.palette.textColor.main,
                  "&:hover": {
                    backgroundColor: theme.palette.color.primary,
                  },
                }}
              >
                <span sx={{ fontSize: "16px", textTransform: "capitalize" }}>
                  Submit
                </span>
              </DefaultButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </FormModal>
  );
};

export default Index;
