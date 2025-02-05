import React, { useState } from "react";
import { Form, Input, Button, Modal, message, Select } from "antd";
import axios from "axios";
import TableComponent from "./table";

const UserMenu = ({ datas, session, refresh, setRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenantName, setTenantName] = useState(session.tenant);
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();

  const isRoot = session?.role === 'superadmin';


  // Handle form submission
  const onFinish = async (values) => {
    const { username, fullname, password, role } = values;

    try {
      setLoading(true)
      const response = await axios.post("/api/users/create", {
        "type": 'users',
        "username": `${tenantName?.toLowerCase()}.${username}`,
        "fullname": fullname,
        "password": password,
        "tenant": tenantName,
        "role": role
      });

      if (response.status === 201) {
        // Successfully created user
        message.success(`${tenantName?.toLowerCase()}.${username} created successfully!`);
        setIsModalOpen(false);
        setRefresh(Math.random())
      }
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response && error.response.data) {
        message.error(error.response.data.error || "Failed to create user.");
      } else {
        message.error("An error occurred while creating the user.");
      }
    } finally {
      setLoading(false)
    }
  };

  const handleTenantChange = (value) => {
    setTenantName(value);
    form.setFieldsValue({ role: 'user' });
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-1 text-sm shadow-sm rounded-md bg-amtorange text-white hover:scale-105 hover:shadow-lg transition-all duration-700"
      >
        Add User +
      </button>




      <Modal
        title="Create User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose={true}
        width={420}
        okText="Create User"
        onOk={() => form.submit()}
        confirmLoading={loading}
        
      >
        {/* Ant Design Form */}
        <Form
          form={form}
          name="create_user"
          onFinish={onFinish}
          layout="horizontal"
          className="pt-4 pb-2 pr-6"
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
              disabled={!isRoot}
              onChange={handleTenantChange}
              showSearch
            >
              {isRoot && (
                datas.tenants?.map(i => (
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
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder="Enter username" addonBefore={`${tenantName?.toLowerCase()}.`}  />
          </Form.Item>

          {/* Name Field */}
          <Form.Item
            label="Full Name"
            name="fullname"
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
              {!isRoot && <Select.Option value="user">User</Select.Option>}
            </Select>
          </Form.Item>
          
        </Form>
      </Modal>

      <TableComponent 
        datas={datas.users}
        type="user" 
        {...{session, refresh, setRefresh}}
      />
    </div>
  );
};

export default UserMenu;
