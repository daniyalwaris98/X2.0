import React, { useRef, useState, useEffect } from "react";
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
import useButtonGenerator from "../../../../hooks/useButtonGenerator";
import { CaretRightOutlined, CaretLeftOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const Index = ({ ncmHistoryId }) => {
  // theme
  const theme = useTheme();

  // selectors
  const dataSource = useSelector(selectConfigurationBackupDetails);

  // states required in hooks
  const targetRef = useRef(null);
  const findInput = useRef(null);

  // hooks
  const { handleSuccessAlert, handleCallbackAlert } = useSweetAlert();
  const generateButton = useButtonGenerator();
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
  useErrorHandling({
    data: getBackupDetailsData,
    isSuccess: isGetBackupDetailsSuccess,
    isError: isGetBackupDetailsError,
    error: getBackupDetailsError,
    type: TYPE_SINGLE,
  });

  useErrorHandling({
    data: deleteRecordsData,
    isSuccess: isDeleteRecordsSuccess,
    isError: isDeleteRecordsError,
    error: deleteRecordsError,
    type: TYPE_BULK,
  });

  // effects
  useEffect(() => {
    getBackupDetails({ [TABLE_DATA_UNIQUE_ID]: ncmHistoryId });
  }, []);

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

  function handleFindNext() {
    const searchTerm = findInput.current.value;
    window.find(searchTerm, false, false, false, false, true, true);
  }

  function handleFindPrevious() {
    const searchTerm = findInput.current.value;
    window.find(searchTerm, false, true, false, false, true, true);
  }

  return (
    <Spin spinning={isGetBackupDetailsLoading || isDeleteRecordsLoading}>
      {dataSource ? (
        <DefaultCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <div style={{ marginBottom: "-12px", fontSize: "17px" }}>
              Backup Details
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {buttonsConfigurationList.map((item) => generateButton(item))}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "10px",
            }}
          >
            <div style={{ position: "fixed", right: "30px" }}>
              <div>
                <button
                  onClick={handleFindPrevious}
                  style={{
                    backgroundColor: "#3D9E47",
                    color: "white",
                    borderRadius: "100px 0 0 100px",
                    height: "30px",
                    outline: "none",
                    border: "none",
                    width: "35px",
                  }}
                >
                  <CaretLeftOutlined />
                </button>

                <input
                  style={{
                    border: "1px solid silver",
                    paddingLeft: "10px",
                    height: "26px",
                    outline: "none",
                  }}
                  type="text"
                  ref={findInput}
                  placeholder="Search"
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      handleFindNext();
                    }
                  }}
                />
                <button
                  onClick={handleFindNext}
                  style={{
                    backgroundColor: "#3D9E47",
                    color: "white",
                    borderRadius: "0 100px 100px 0",
                    height: "30px",
                    outline: "none",
                    border: "none",
                    width: "35px",
                  }}
                >
                  <CaretRightOutlined />
                </button>
              </div>
            </div>

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
