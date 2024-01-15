import React, { useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  useDeleteRecordsMutation,
  useGetNcmConfigurationBackupDetailsByNcmHistoryIdMutation,
} from "../../../../store/features/ncmModule/manageConfigurations/configurationBackups/apis";
import { useSelector } from "react-redux";
import { selectConfigurationBackupDetails } from "../../../../store/features/ncmModule/manageConfigurations/configurationBackups/selectors";
import { jsonToExcel } from "../../../../utils/helpers";
import { Spin } from "antd";
import useErrorHandling from "../../../../hooks/useErrorHandling";
import useSweetAlert from "../../../../hooks/useSweetAlert";
import useButtonsConfiguration from "../../../../hooks/useButtonsConfiguration";
import { FILE_NAME_EXPORT_ALL_DATA, TABLE_DATA_UNIQUE_ID } from "./constants";
import { TYPE_SINGLE, TYPE_BULK } from "../../../../hooks/useErrorHandling";
import DefaultCard from "../../../../components/cards";
import Highlighter from "react-highlight-words";
import DefaultPageHeader from "../../../../components/pageHeaders";
import { FloatingHighlighterSearch } from "../../../../components/search";

const Index = ({ ncmHistoryId }) => {
  // theme
  const theme = useTheme();

  // selectors
  const dataSource = useSelector(selectConfigurationBackupDetails);

  // states required in hooks
  const targetRef = useRef(null);

  // hooks
  const { handleSuccessAlert, handleCallbackAlert } = useSweetAlert();
  const { buttonsConfigurationList } = useButtonsConfiguration({
    default_export: { handleClick: handleDefaultExport },
    default_delete: { handleClick: handleDelete },
  });

  // apis
  const [
    getBackupDetails,
    {
      data: getBackupDetailsData,
      isSuccess: isGetBackupDetailsSuccess,
      isLoading: isGetBackupDetailsLoading,
      isError: isGetBackupDetailsError,
      error: getBackupDetailsError,
    },
  ] = useGetNcmConfigurationBackupDetailsByNcmHistoryIdMutation();

  const [
    deleteRecords,
    {
      data: deleteRecordsData,
      isSuccess: isDeleteRecordsSuccess,
      isLoading: isDeleteRecordsLoading,
      isError: isDeleteRecordsError,
      error: deleteRecordsError,
    },
  ] = useDeleteRecordsMutation();

  // error handling custom hooks
  // useErrorHandling({
  //   data: getBackupDetailsData,
  //   isSuccess: isGetBackupDetailsSuccess,
  //   isError: isGetBackupDetailsError,
  //   error: getBackupDetailsError,
  //   type: TYPE_SINGLE,
  // });

  useErrorHandling({
    data: deleteRecordsData,
    isSuccess: isDeleteRecordsSuccess,
    isError: isDeleteRecordsError,
    error: deleteRecordsError,
    type: TYPE_BULK,
  });

  // effects
  useEffect(() => {
    if (ncmHistoryId) {
      getBackupDetails({ [TABLE_DATA_UNIQUE_ID]: ncmHistoryId });
    }
  }, [ncmHistoryId]);

  // handlers
  function deleteData(allowed) {
    if (allowed) {
      deleteRecords([ncmHistoryId]);
    }
  }

  function handleDelete() {
    handleCallbackAlert(
      "Are you sure you want delete this record?",
      deleteData
    );
  }

  function handleDefaultExport() {
    jsonToExcel(dataSource, FILE_NAME_EXPORT_ALL_DATA);
    handleSuccessAlert("File exported successfully.");
  }

  return (
    <Spin spinning={isGetBackupDetailsLoading || isDeleteRecordsLoading}>
      {dataSource ? (
        <DefaultCard sx={{ paddingBottom: "50px" }}>
          <DefaultPageHeader
            pageName="Backup Details"
            buttons={buttonsConfigurationList}
          />
          <FloatingHighlighterSearch />

          <div
            style={{
              backgroundColor: "white",
              padding: "10px",
            }}
          >
            <span style={{ color: "grey" }}>Output:</span>

            <code class="line-numbers">
              <pre style={{ padding: "8px" }}>
                <Highlighter
                  highlightClassName="rc-highlight"
                  searchWords={[`${targetRef}`]}
                  autoEscape={true}
                  activeStyle={{ color: "red" }}
                  textToHighlight={dataSource}
                />
              </pre>
            </code>
          </div>
        </DefaultCard>
      ) : null}
    </Spin>
  );
};

export default Index;
