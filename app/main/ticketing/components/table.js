'use client';
import React, { useState } from 'react';
import { Table, Input } from 'antd';
import { Resizable } from 'react-resizable';
import moment from 'moment';



const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={<span className="react-resizable-handle" onClick={(e) => e.stopPropagation()} />}
      onResize={onResize}
      draggableOpts={{
        enableUserSelectHack: false,
      }}
    >
      <th {...restProps} />
    </Resizable>
  );
};


const Tables = ({ datas }) => {

  const [columns, setColumns] = useState([
    {
      title: 'Ticket Number',
      dataIndex: 'amt_ticket_id',
      width: 200,
      ellipsis: true,
      align: 'center',
      fixed: 'left',
      render: (text) => <a className="font-bold text-sky-600">{text}</a>,
    },
    {
      title: 'Status',
      dataIndex: 'ticket_status',
      width: 120,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Create Date',
      dataIndex: 'created_at',
      width: 150,
      align: 'center',
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Argo Start',
      dataIndex: 'argo_start',
      width: 150,
      ellipsis: true,
      align: 'center',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      width: 120,
      ellipsis: true,
    },    
    {
      title: 'Customer ID',
      dataIndex: 'customer_id',
      width: 120,
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Rootcause',
      dataIndex: 'rca',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Closed Date',
      dataIndex: 'closed_at',
      width: 150,
      align: 'center',
      ellipsis: true,
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
    },
  ]);

  const handleResize = (index) => (_, { size }) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      width: size.width > 100 ? size.width : 100,
    };
    setColumns(newColumns);
  };

  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  return (
    <div className="relative">
      <Table
        bordered
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        columns={mergedColumns}
        dataSource={datas}
        rowKey="amt_ticket_id"
      />
    </div>
  );
};

export default Tables;
