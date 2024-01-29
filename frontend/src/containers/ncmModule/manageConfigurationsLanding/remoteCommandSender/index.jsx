import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedDevice } from "../../../../store/features/ncmModule/manageConfigurations/selectors";
import { selectCommandOutput } from "../../../../store/features/ncmModule/manageConfigurations/remoteCommandSender/selectors";
import { useSendNcmRemoteCommandByNcmDeviceIdMutation } from "../../../../store/features/ncmModule/manageConfigurations/remoteCommandSender/apis";
import useErrorHandling, {
  TYPE_SINGLE,
} from "../../../../hooks/useErrorHandling";
import DefaultCard from "../../../../components/cards";
import DefaultSpinner from "../../../../components/spinners";
import { indexColumnNameConstants as manageConfigurationsIndexColumnNameConstants } from "../../manageConfigurations/constants";
import { REMOTE_COMMAND } from "./constants";
import RemoteCommandBar from "./remoteCommandBar";

const Index = () => {
  // selectors
  const dataSource = useSelector(selectCommandOutput);
  const selectedDevice = useSelector(selectSelectedDevice);

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
      [manageConfigurationsIndexColumnNameConstants.NCM_DEVICE_ID]:
        selectedDevice[
          manageConfigurationsIndexColumnNameConstants.NCM_DEVICE_ID
        ],
      cmd: data[REMOTE_COMMAND],
    });
  };

  return (
    <DefaultSpinner spinning={isSendCommandLoading}>
      <RemoteCommandBar onSubmit={onSubmit} />
      <DefaultCard sx={{ padding: "10px" }}>
        <div>Output:</div>
        <div>{dataSource}</div>
      </DefaultCard>
    </DefaultSpinner>
  );
};

export default Index;
