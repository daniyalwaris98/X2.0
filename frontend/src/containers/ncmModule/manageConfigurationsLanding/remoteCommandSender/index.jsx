import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useSendNcmRemoteCommandByNcmDeviceIdMutation } from "../../../../store/features/ncmModule/manageConfigurations/remoteCommandSender/apis";
import { useSelector } from "react-redux";
import { selectCommandOutput } from "../../../../store/features/ncmModule/manageConfigurations/remoteCommandSender/selectors";
import useErrorHandling, {
  TYPE_SINGLE,
} from "../../../../hooks/useErrorHandling";
import useButtonsConfiguration from "../../../../hooks/useButtonsConfiguration";
import { Spin } from "antd";
import { useLocation } from "react-router-dom";
import DefaultCard from "../../../../components/cards";
import useButtonGenerator from "../../../../hooks/useButtonGenerator";
//
import { useForm } from "react-hook-form";
import DefaultFormUnit from "../../../../components/formUnits";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getTitle } from "../../../../utils/helpers";
import { REMOTE_COMMAND } from "./constants";

const schema = yup.object().shape({
  // [REMOTE_COMMAND]: yup
  //   .string()
  //   .required(`${getTitle(REMOTE_COMMAND)} is required`),
});

const Index = () => {
  // theme
  const theme = useTheme();
  const location = useLocation();
  const receivedData = location.state;
  const generateButton = useButtonGenerator();

  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  // hooks
  const { buttonsConfigurationObject } = useButtonsConfiguration({
    default_submit: null,
  });

  // selectors
  const dataSource = useSelector(selectCommandOutput);

  // apis
  const [
    sendCommand,
    {
      data: sendCommandData,
      isSuccess: isSendCommandSuccess,
      isLoading: isSendCommandLoading,
      isError: isSendCommandError,
      error: sendCommandError,
    },
  ] = useSendNcmRemoteCommandByNcmDeviceIdMutation();

  // error handling custom hooks
  useErrorHandling({
    data: sendCommandData,
    isSuccess: isSendCommandSuccess,
    isError: isSendCommandError,
    error: sendCommandError,
    type: TYPE_SINGLE,
  });

  // on form submit
  const onSubmit = (data) => {
    sendCommand({
      ncm_device_id: receivedData?.ncm_device_id,
      cmd: data[REMOTE_COMMAND],
    });
  };

  return (
    <Spin spinning={isSendCommandLoading}>
      {/* <Spin spinning={false}> */}
      <DefaultCard sx={{ marginBottom: "10px" }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "100%" }}>
            <DefaultFormUnit
              control={control}
              dataKey={REMOTE_COMMAND}
              required
              label={false}
              sx={{
                margin: "5px 0px 0 10px",
              }}
            />
          </div>
          &nbsp; &nbsp;
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingRight: "10px",
            }}
          >
            {generateButton(buttonsConfigurationObject.default_submit)}
          </div>
        </form>
      </DefaultCard>
      <DefaultCard sx={{ padding: "10px" }}>
        <div>Output:</div>
        <div>{dataSource}</div>
      </DefaultCard>
    </Spin>
  );
};

export default Index;
