'use client'

import { Form, Input, InputNumber, message, Modal } from 'antd';
import { useEffect } from 'react';
import { updateTenant } from '../function';

const ModalTenant = ({ isModalOpen, setIsModalOpen, loading, setLoading, setRefresh, onFinish, selectedRecord = undefined }) => {
  const [form] = Form.useForm();
  const isForEdit = Boolean(selectedRecord?.username);

  const onFinishEdit = async (values) => {
    setLoading(true);
    const result = await updateTenant(values);
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
    username: selectedRecord?.username || '',
    name: selectedRecord?.name || '',
    email: selectedRecord?.email || '',
    pass_id: selectedRecord?.pass_id || '',
    auth_id: selectedRecord?.auth_id || '',
    radius_meter: selectedRecord?.radius_meter || '',
    prefix: selectedRecord?.prefix || '',
  };

  useEffect(() => {
    if (isModalOpen && selectedRecord) {
      form.setFieldsValue(initialValues);
    }
  }, [isModalOpen, selectedRecord, form]);

  return (
    <div>
      <Modal
        title={isForEdit ? 'Update Tenant' : 'Create Tenant'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose={true}
        okText={isForEdit ? 'Update Tenant' : 'Create Tenant'}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form
          form={form}
          name={isForEdit ? 'update_tenant' : 'create_tenant'}
          onFinish={isForEdit ? onFinishEdit : onFinish}
          layout="horizontal"
          labelCol={{ span: 8 }}
        >

          {/* Username Field */}
          <Form.Item
            label="Tenant Name"
            name="username"
            rules={isForEdit ? [] : [
              { required: true, message: "Tenant Name is required" },
              { pattern: /^[^\s]*$/, message: "Tenant name cannot contain spaces" }
            ]}
          >
            <Input
              placeholder="Enter username"
              disabled={isForEdit} 
            />
          </Form.Item>


          {/* Name Field */}
          <Form.Item
            label="Company Name"
            name="name"
            rules={[{ required: true, message: "Company name is required" }]}
          >
            <Input
              placeholder="Enter company name"
            />
          </Form.Item>


          {/* Email Field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>


          {/* Token Field */}
          <Form.Item
            label="Pass ID"
            name="pass_id"
            rules={[{ required: true, message: "Pass id is required" }]}
          >
            <Input placeholder="Enter pass id" />
          </Form.Item>

          {/* Auth ID Field */}
          <Form.Item
            label="Auth ID"
            name="auth_id"
            rules={[{ required: true, message: "Auth id is required" }]}
          >
            <Input placeholder="Enter authentication id" />
          </Form.Item>

          {/* Scan Radius Field */}
          <Form.Item
            label="Radius Meter"
            name="radius_meter"
            rules={[
              { required: true, message: "Scan radius is required" },
              { type: 'number', min: 100, message: "Scan radius must be at least 100 meter" }
            ]}
          >
            <InputNumber
              placeholder="Enter scan radius"
              style={{ width: '100%' }}  // Ensure the input takes full width of the container
            />
          </Form.Item>

          {/* Prefix Field */}
          <Form.Item
            label="Prefix"
            name="prefix"
            rules={isForEdit ? [] : [{ required: true, message: "Prefix is required" }]}
          >
            <Input 
              placeholder="Prefix" 
              disabled={Boolean(selectedRecord?.prefix)}
              maxLength={3}
              className="uppercase"
            />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default ModalTenant;
