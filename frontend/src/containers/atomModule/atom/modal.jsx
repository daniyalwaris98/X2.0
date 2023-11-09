import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormModal from "../../../components/dialog";
import Grid from "@mui/material/Grid";
import DefaultFormUnit from "../../../components/formUnits";
import { SelectFormUnit } from "../../../components/formUnits";
import DefaultButton from "../../../components/buttons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme, styled } from "@mui/material/styles";

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
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormModal title="Add Atom" open={open}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <DefaultFormUnit control={control} dataKey="ip_address" required />
            <SelectFormUnit control={control} dataKey="site_name" required />
            <DefaultFormUnit control={control} dataKey="rack_name" required />
            <DefaultFormUnit control={control} dataKey="device_name" required />
            <DefaultFormUnit control={control} dataKey="device_ru" required />
            <DefaultFormUnit control={control} dataKey="department" />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <DefaultFormUnit control={control} dataKey="section" />
            <DefaultFormUnit control={control} dataKey="function" required />
            <DefaultFormUnit control={control} dataKey="virtual" />
            <DefaultFormUnit control={control} dataKey="device_type" required />
            <DefaultFormUnit
              control={control}
              dataKey="password_group"
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
