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
}) {
  const { height, width } = useWindowDimensions();

  return (
    <DefaultCard sx={{ width: `${width - 105}px` }}>
      <DefaultPageHeader
        pageName={PAGE_NAME}
        buttons={buttonsConfigurationList}
        selectedRowKeys={selectedRowKeys}
      />
      <DefaultTable
        rowKey={TABLE_DATA_UNIQUE_ID}
        dataSource={dataSource}
        displayColumns={displayColumns}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        getCheckboxProps={getCheckboxProps}
      />
    </DefaultCard>
  );
}
