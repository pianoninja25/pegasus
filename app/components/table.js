'use client';
import React, { useState } from 'react';
import { Table, Select, Input } from 'antd';
import { Resizable } from 'react-resizable';
import { CSVLink } from 'react-csv';
import { MdSimCardDownload } from "react-icons/md";


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

const TableList = ({ datas, user }) => {
  const [selectedFilter, setSelectedFilter] = useState('site_id');
  const [searchValue, setSearchValue] = useState('');


  const handleFilterChange = (value) => {
    setSelectedFilter(value);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredData = datas?.filter(item => {
    const matchesFilter = selectedFilter 
      ? (item[selectedFilter]?.toString().toLowerCase().includes(searchValue.toLowerCase())) 
      : true;
    const matchesSearch = 
      item.site_id.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.region.toLowerCase().includes(searchValue.toLowerCase())  
      // item.customer_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      // item.account_number.toLowerCase().includes(searchValue.toLowerCase()) ||
      // item.kota.toLowerCase().includes(searchValue.toLowerCase()) ||
      // item.company.toLowerCase().includes(searchValue.toLowerCase()) ||
      // item.note_status.toLowerCase().includes(searchValue.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const [columns, setColumns] = useState([
    {
      title: 'Site ID',
      dataIndex: 'site_id',
      width: 130,
      ellipsis: true,
      align: 'center',
      fixed: 'left',
      render: (text, record) => (
        <a className='font-bold text-sky-600'>{text}</a>
      ),
    },
    {
      title: 'Region',
      dataIndex: 'region',
      width: 130,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'City',
      dataIndex: 'city',
      width: 130,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'District',
      dataIndex: 'district',
      width: 130,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Sub District',
      dataIndex: 'sub_district',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      width: 220,
      ellipsis: true,
    },
    {
      title: 'OLT',
      dataIndex: 'olt',
      width: 140,
      ellipsis: true,
    },
    {
      title: 'Project',
      dataIndex: 'project',
      width: 120,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Homepass',
      dataIndex: 'homepass',
      width: 120,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Site Type',
      dataIndex: 'site_type',
      width: 120,
      ellipsis: true,
      align: 'center',
    }
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
    <>
      <div className='relative'>
        <Select 
          placeholder="Select filter" 
          onChange={handleFilterChange} 
          style={{ width: 150, marginBottom: 14, marginRight: 20 }}
          value={selectedFilter}
        >
          <Select.Option value="site_id">Site ID</Select.Option>
          <Select.Option value="region">Region</Select.Option>
          {/* <Select.Option value="account_number">Customer ID</Select.Option>
          <Select.Option value="kota">City</Select.Option>
          <Select.Option value="company">Vendor</Select.Option>
          <Select.Option value="note_status">Current Status</Select.Option> */}
        </Select>
        
        <Input 
          placeholder="Search..." 
          onChange={handleSearchChange} 
          style={{ marginBottom: 14, width: 200 }} 
        />


        {filteredData && 
          <CSVLink 
            data={filteredData}
            filename={`${user} Site - ${moment().format('YYYYMMDD HHmmss')}.csv`}
            className="absolute left-[24rem] top-0.5 p-1 rounded-full shadow-sm bg-amtblue/20 hover:bg-amtblue"
          >
            <MdSimCardDownload size={18} color="white" />
          </CSVLink>
        }
      </div>



      <div className='z-[999] text-xs text-red-600'>
        <Table
          bordered
          components={{
            header: {
              cell: ResizableTitle,
            },
          }}
          columns={mergedColumns}
          dataSource={filteredData}
          rowKey="site_id"
        />

      </div>
    </>
  );
};

export default TableList;
