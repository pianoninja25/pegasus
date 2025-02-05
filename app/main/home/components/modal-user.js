'use client'

import { Form, Input, message, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { updateUser } from '../function';

const ModalUser = ({ datas, session, loading, setLoading, setRefresh, onFinish, isModalOpen, setIsModalOpen, selectedRecord = undefined }) => {
  const [form] = Form.useForm();
  const isForEdit = Boolean(selectedRecord?.username);
  const [tenantName, setTenantName] = useState(session?.tenant);
  const isRoot = session?.role === 'superadmin';

  // console.log(isRoot, session?.role)

  useEffect(() => {
    if (selectedRecord) {
      setTenantName(selectedRecord?.tenant);
    }
  }, [selectedRecord]);

  const handleTenantChange = (value) => {
    setTenantName(value);
    form.setFieldsValue({ role: 'user' });
  };

  const onFinishEdit = async (values) => {
    setLoading(true);
    const result = await updateUser(values);
    if (typeof result === 'string') {
      message.error(result);
    } else if (result?.status === 200) {
      message.success(result.data.message);
      setRefresh(Math.random());
      setIsModalOpen(false);
    } else {
      message.error("An unexpected error occurred.");
    }
    setLoading(false);
  };

  // Set initial values for the form based on selectedRecord (if any)
  const initialValues = {
    tenant: selectedRecord?.tenant || '',
    username: selectedRecord?.username || '',
    name: selectedRecord?.name || '',
    password: selectedRecord?.password || '',
    role: selectedRecord?.role || ''
  };

  useEffect(() => {
    if (isModalOpen && selectedRecord) {
      form.setFieldsValue(initialValues);
    }
  }, [isModalOpen, selectedRecord, form]);

  return (
    <div>
      <Modal
        title={isForEdit ? 'Update User' : 'Create User'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose={true}
        okText={isForEdit ? 'Update User' : 'Create User'}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form
          form={form}
          name={isForEdit ? 'update_user' : 'create_user'}
          onFinish={isForEdit ? onFinishEdit : onFinish}
          layout="horizontal"
          labelCol={{ span: 8 }}
        >

          {/* Tenant selection */}
          <Form.Item
            label="Tenant"
            name="tenant"
            rules={[{ required: true, message: "Tenant is required" }]}
            initialValue={tenantName}
            
          >
            <Select
              value={isRoot ? undefined : 'user'}
              disabled={isForEdit} 
              onChange={handleTenantChange}
              showSearch
            >
              {isRoot && (
                datas?.tenants?.map(i => (
                  <Select.Option value={i.username} key={i.username}>{i.username}</Select.Option>
                ))
              )}
              {!isRoot && <Select.Option value="user">User</Select.Option>}
            </Select>
          </Form.Item>

          {/* Username Field */}
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Username is required" },
              { pattern: /^[^\s]*$/, message: "Username cannot contain spaces" }
            ]}
          >
            <Input 
              placeholder="Enter username" 
              addonBefore={!isForEdit && `${tenantName?.toLowerCase()}.`} 
              disabled={isForEdit} 
            />
          </Form.Item>

          {/* Name Field */}
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Full Name is required" },
            ]}
          >
            <Input placeholder="Enter fullname" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 8, message: "Password must be at least 8 characters" },
              { pattern: /[0-9]/, message: "Password must contain at least one number" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          {/* Role selection */}
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Role is required" }]}
            initialValue='user'
          >
            <Select
              value={isRoot ? undefined : 'user'}
              disabled={!isRoot}
            >
              {isRoot && (
                <>
                  <Select.Option value="user">User</Select.Option>
                  <Select.Option value="admin">Admin</Select.Option>
                  {tenantName === 'Unifiber' && (
                    <Select.Option value="superadmin">Super Admin</Select.Option>
                  )}
                </>
              )}
              {!isRoot && (
                <>
                  <Select.Option value="user">User</Select.Option>
                  <Select.Option value="admin">Admin</Select.Option>
                </>
              )}
            </Select>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default ModalUser;
