import React from "react";
import DefaultCard from "./cards";
import DefaultPageHeader from "./pageHeaders";
import DefaultTable from "./tables";
import useWindowDimensions from "../hooks/useWindowDimensions";

export default function DefaultPageTableSection({
  PAGE_NAME,
  TABLE_DATA_UNIQUE_ID,
  buttonsConfigurationList,
  displayColumns,
  dataSource,
  selectedRowKeys = null,
  setSelectedRowKeys = null,
  getCheckboxProps = null,
  rowClickable = false,
  selectedRowKey = null,
  setSelectedRowKey = null,
  dynamicWidth = true,
  scroll = true,
  defaultPageSize = 10,
}) {
  const { height, width } = useWindowDimensions();
  const sx = dynamicWidth ? { width: `${width - 105}px` } : {};

  return (
    <DefaultCard sx={sx}>
      <DefaultPageHeader
        pageName={PAGE_NAME}
        buttons={buttonsConfigurationList}
        selectedRowKeys={selectedRowKeys}
      />
      <DefaultTable
        rowKey={TABLE_DATA_UNIQUE_ID}
        dataSource={dataSource}
        displayColumns={displayColumns}
        getCheckboxProps={getCheckboxProps}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        rowClickable={rowClickable}
        selectedRowKey={selectedRowKey}
        setSelectedRowKey={setSelectedRowKey}
        dynamicWidth={dynamicWidth}
        scroll={scroll}
        defaultPageSize={defaultPageSize}
      />
    </DefaultCard>
  );
}
