'use client';
import React, { useState } from 'react';
import { Table, Input } from 'antd';
import { Resizable } from 'react-resizable';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { FaDownload } from 'react-icons/fa';





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

  const [filterTable, setFilterTable] = useState(null);

  const search = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setFilterTable(null);
      return;
    }

    const filteredData = datas.filter((item) => {
      const matchesTopLevel = Object.keys(item).some((key) =>
        String(item[key]).toLowerCase().includes(value)
      );

      let matchesPayload = false;
      try {
        if (item.payload) {
          const payload = JSON.parse(item.payload);
          matchesPayload = payload?.relatedParty?.[0]?.name?.toLowerCase().includes(value);
        }
      } catch (error) {
        console.error("Error parsing payload:", error);
      }

      return matchesTopLevel || matchesPayload;
    });

    setFilterTable(filteredData);
  };

  const [columns, setColumns] = useState([
    {
      title: 'Order Number',
      dataIndex: 'order_number',
      width: 200,
      ellipsis: true,
      align: 'center',
      fixed: 'left',
      render: (text) => <a className="font-bold text-sky-600">{text}</a>,
    },
    {
      title: 'Type',
      dataIndex: 'order_type',
      width: 140,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 180,
      ellipsis: true,
      align: 'center',
      render: (status) => {
        let statusClass = 'text-gray-700 bg-gray-100';
    
        switch (status) {
          case 'Cancel':
            statusClass = 'text-gray-700 bg-gray-100';
            break;
          case 'Awaiting Schedule':
            statusClass = 'text-yellow-700 bg-yellow-100';
            break;
          case 'Scheduled':
            statusClass = 'text-orange-700 bg-orange-100';
            break;
          case 'Awaiting Installation':
            statusClass = 'text-red-700 bg-red-100'
            break;
          case 'Complete':
            statusClass = 'text-green-700 bg-green-100';
            break;
          case 'In Progress':
            statusClass = 'text-blue-700 bg-blue-100';
            break;
          default:
            statusClass = 'text-gray-700 bg-gray-100';
            break;
        }
    
        return (
          <span className={`w-80 px-2 py-0.5 pb-1 text-xs rounded-lg ${statusClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      title: 'Create Date',
      dataIndex: 'order_created_date',
      width: 160,
      align: 'center',
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Request Completion',
      dataIndex: 'order_scheduled_date',
      width: 160,
      ellipsis: true,
      align: 'center',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Order Complete',
      dataIndex: 'order_completed_date',
      width: 160,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        const formattedDate = moment(text);
        return formattedDate.isValid() ? formattedDate.format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    {
      title: 'Sales Name',
      dataIndex: 'salesName',
      width: 150,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      width: 150,
      ellipsis: true,
      align: 'center',
    },
    // {
    //   title: 'Homepass ID',
    //   dataIndex: 'homepass_id',
    //   width: 120,
    //   ellipsis: true,
    //   align: 'center',
    // },
    // {
    //   title: 'Site Name',
    //   dataIndex: 'sitename',
    //   width: 150,
    //   ellipsis: true,
    // },
    {
      title: 'Customer Name',
      dataIndex: 'name',
      width: 200,
      ellipsis: true,
      // render: (text) => {
      //   try {
      //     const payload = JSON.parse(text);
      //     return payload?.relatedParty?.[0]?.name || 'Unknown';
      //   } catch (error) {
      //     console.error('Failed to parse payload:', error);
      //     return 'Invalid Payload';
      //   }
      // },
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
        dataSource={filterTable === null ? datas : filterTable}
        rowKey="order_number"
      />
    </div>
  );
};

export default Tables;
