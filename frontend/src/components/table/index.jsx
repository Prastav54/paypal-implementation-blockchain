/* eslint-disable react/prop-types */
import { Table as AntdTable } from "antd";

export const Table = ({ columns, dataSource = [], rowKey }) => {
  return (
    <AntdTable
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      scroll={{
        x: true,
      }}
    />
  );
};
