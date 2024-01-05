import React from "react";
import DefaultCard from "./cards";
import DefaultPageHeader from "./pageHeaders";
import DefaultTable, { TableWithoutScroll } from "./tables";
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
        getCheckboxProps={getCheckboxProps}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </DefaultCard>
  );
}

export function PageTableSectionWithoutWidth({
  PAGE_NAME,
  TABLE_DATA_UNIQUE_ID,
  buttonsConfigurationList,
  displayColumns,
  dataSource,
  selectedRowKeys = null,
  setSelectedRowKeys = null,
  getCheckboxProps = null,
}) {
  return (
    <DefaultCard>
      <DefaultPageHeader
        pageName={PAGE_NAME}
        buttons={buttonsConfigurationList}
      />
      <DefaultTable
        rowKey={TABLE_DATA_UNIQUE_ID}
        dataSource={dataSource}
        displayColumns={displayColumns}
        getCheckboxProps={getCheckboxProps}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </DefaultCard>
  );
}

export function PageTableSectionWithoutScrollAndWidth({
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
}) {
  return (
    <DefaultCard>
      <DefaultPageHeader
        pageName={PAGE_NAME}
        buttons={buttonsConfigurationList}
      />
      <TableWithoutScroll
        rowKey={TABLE_DATA_UNIQUE_ID}
        dataSource={dataSource}
        displayColumns={displayColumns}
        getCheckboxProps={getCheckboxProps}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        rowClickable={rowClickable}
        selectedRowKey={selectedRowKey}
        setSelectedRowKey={setSelectedRowKey}
      />
    </DefaultCard>
  );
}
