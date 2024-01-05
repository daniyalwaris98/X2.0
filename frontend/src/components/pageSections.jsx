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
  dynamicWidth = true,
  scroll = true,
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
        scroll={scroll}
      />
    </DefaultCard>
  );
}
