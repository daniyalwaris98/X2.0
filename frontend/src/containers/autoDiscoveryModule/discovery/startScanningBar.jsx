import React from "react";
import DefaultCard from "../../../components/cards";
import DefaultFormUnit from "../../../components/formUnits";
import useButtonGenerator from "../../../hooks/useButtonGenerator";
import { useForm } from "react-hook-form";
import useButtonsConfiguration from "../../../hooks/useButtonsConfiguration";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { selectCommandOutput } from "../../../store/features/ncmModule/manageConfigurations/remoteCommandSender/selectors";

const schema = yup.object().shape({
  // [REMOTE_COMMAND]: yup
  //   .string()
  //   .required(`${getTitle(REMOTE_COMMAND)} is required`),
});

function Index(props) {
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

  // on form submit
  const onSubmit = (data) => {
    // sendCommand({
    //   ncm_device_id: selectedDevice?.ncm_device_id,
    //   cmd: data[REMOTE_COMMAND],
    // });
  };

  return (
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
            dataKey={"subnets"}
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
  );
}

export default Index;
