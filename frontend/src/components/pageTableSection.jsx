import React from "react";
import DefaultCard from "./cards";
import PageHeader from "./pageHeader";
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
}) {
  const { height, width } = useWindowDimensions();

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  function onSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys);
  }

  function handleChange(pagination, filters, sorter, extra) {
    console.log("Various parameters", pagination, filters, sorter, extra);
  }
  return (
    <DefaultCard sx={{ width: `${width - 105}px` }}>
      <PageHeader
        pageName={PAGE_NAME}
        buttons={buttonsConfigurationList}
        selectedRowKeys={selectedRowKeys}
      />
      <DefaultTable
        onChange={handleChange}
        rowSelection={selectedRowKeys ? rowSelection : null}
        columns={displayColumns}
        dataSource={dataSource}
        rowKey={TABLE_DATA_UNIQUE_ID}
        displayColumns={displayColumns}
      />
    </DefaultCard>
  );
}
