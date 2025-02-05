import React, { useState } from 'react';
import { Modal, Space, Table, Tag, message, notification } from 'antd';
import moment from 'moment';
import axios from 'axios';
import ModalUser from './modal-user';
import ModalTenant from './modal-tenant';
const { Column } = Table;


const TableComponent = ({ datas, type, session, setRefresh, loading, setLoading, onFinish }) => {
  const [isModalTenantOpen, setIsModalTenantOpen] = useState(false)
  const [isModalUserOpen, setIsModalUserOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null);


  const handleReset = (record) => {
    setSelectedRecord(record);
    type === 'tenant' ? setIsModalTenantOpen(true) : setIsModalUserOpen(true);
  };

  // const handleDelete = (record) => {
  //   notification.warning({
  //     message: `Delete action for ${record.username}`,
  //     description: `Deleting the record for ${record.username}.`,
  //   });
  // };


  const handleDelete = async (type, username) => {
    try {
      const response = await axios.delete(`/api/users/delete?type=${type}&username=${username}`);
      if (response.status === 200) {
        message.success(`${username} deleted!`);
        setRefresh(Math.random())
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data?.message);
        console.error('Error deleting data:', error.response.data);
        return error.response.data;
      } else if (error.request) {
        console.error('No response received:', error.request);
        return { message: 'No response from server' };
      } else {
        console.error('Error setting up request:', error.message);
        return { message: 'An error occurred' };
      }
    }
  };

  return (
    <>
    <Table dataSource={datas} rowKey="username"> 
    {/* pagination={{ pageSize: 20 }} */}
      <Column title="Username" dataIndex="username" key="username" align="center" />
      {type === 'tenant' && (
        <>
          <Column title="Company Name" dataIndex="name" key="name" width={220} ellipsis />
          <Column title="Email" dataIndex="email" key="email" width={150} ellipsis />
          <Column title="Pass ID" dataIndex="pass_id" key="pass_id" align="center" width={100} ellipsis />
          <Column title="Auth ID" dataIndex="auth_id" key="auth_id" align="center" width={100} ellipsis />
          <Column title="Radius Meter" dataIndex="radius_meter" key="radius_meter" align="center" width={120} />
          <Column title="Prefix" dataIndex="prefix" key="prefix" align="center" width={120} />
        </>
      )} 
      {type === 'user' && (
        <>
          <Column title="Account Name" dataIndex="name" key="name" />
          <Column title="Tenant" dataIndex="tenant" key="tenant" align="center" />
          <Column
            title="Role"
            dataIndex="role"
            key="role"
            align="center"
            render={(role) => {
              return (
                <span 
                  className={`
                    ${role === 'superadmin' ? 'bg-red-100 text-red-600' : 
                      role === 'admin' ? 'bg-amber-100 text-yellow-600' : 
                      'bg-green-100 text-green-700'} px-2 pb-1 pt-0.5 rounded-lg
                  `}
                >
                  {role}
                </span>
              ) 
            }}
          />
        </>
      )}
      
      <Column 
        title="Create Date" 
        dataIndex="create_date" 
        key="create_date" 
        align="center" 
        render={(text) => text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : '-'}
      />
      <Column
        title="Action"
        key="action"
        align="center"
        render={(_, record) => (
          <Space size="middle">
            
            <button 
              onClick={() => handleReset(record)} className='text-blue-500'
            >
              Edit
            </button>
            <button
              onClick={() => {
                Modal.confirm({
                  title: `Delete ${record.username}?`,
                  content: `Are you sure you want to delete ${record.username}?`,
                  okText: 'Yes',
                  cancelText: 'No',
                  onOk: () => handleDelete(type, record.username), 
                });
              }}
              className={`text-red-500 ${(_.role === session?.role && _.role !== undefined) || _.username === 'Unifiber' ? 'cursor-not-allowed opacity-20' : ''}`}
              disabled={(_.role === session?.role && _.role !== undefined) || _.username === 'Unifiber'}
            >
              Delete
            </button>
          </Space>
        )}
      />


      
      
    </Table>
    
      <ModalTenant 
        isModalOpen={isModalTenantOpen} 
        setIsModalOpen={setIsModalTenantOpen}
        {...{loading, setLoading, setRefresh, onFinish, selectedRecord}} 
      />

      <ModalUser 
        isModalOpen={isModalUserOpen} 
        setIsModalOpen={setIsModalUserOpen}
        {...{datas, session, loading, setLoading, setRefresh, onFinish, selectedRecord}} 
      />
      
    </>
  );
};

export default TableComponent;
