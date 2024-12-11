'use client';

import { Modal, Input, Select, Form, Button, message } from 'antd';
import React, { useState, useEffect } from 'react';

const { TextArea } = Input;

const FormTicket = ({ user, setRefresh, loading, setLoading, isDesktop }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();


  const getToken = async (username, password) => {
    const response = await fetch('http://localhost:8002/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to get token');
    }
  
    const tokenData = await response.json();
    return tokenData.access_token; // Assuming the token is in `tokenData.token`
  };

  const createTicket = async (token, formData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8002/create_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to create ticket');
    }
  
    const ticketData = await response.json();
    return ticketData;
  };
  
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form Data:', values);
      
      setLoading(true);
      const username = user;
      const password = 'ioh456#';
      const token = await getToken(username, password);

      const ticketData = await createTicket(token, values);
      message.success(`Ticket ID: ${ticketData.result.amt_ticket_id}`);
      setRefresh(ticketData)
  
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
      message.error('Ticket Creation Failed! Please try again.');
    } 
    finally {
      setLoading(false);
    }
  };
 
  // const handleOk = async () => {
  //   try {
  //     const values = await form.validateFields();
  //     console.log('Form Data:', values);
      
  //     setLoading(true);
  
  //   } catch (info) {
  //     console.error('Validation Failed:', info);
  //   }
  // };

  // const handleOk = () => {
  //   form
  //     .validateFields()
  //     .then(values => {
  //       console.log('Form Data:', values);
  //       form.resetFields();

  //       setIsModalOpen(false);
  //     })
  //     .catch(info => {
  //       console.error('Validation Failed:', info);
  //     });
  // };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({ tier1: 'Access Issue' });
    }
  }, [isModalOpen]);

  return (
    <div className='fixed bottom-24 right-10 sm:top-20 sm:right-14 sm:mt-4 !font-quicksand cursor-pointer'>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`shadow-md rounded-full backdrop-blur-sm text-white border-1 border-white bg-amtorange/80 hover:bg-amtorange
          ${isDesktop ? 'px-4 py-1 text-xs' 
          : 'flex justify-center items-center w-10 h-10 p-1 text-2xl border-2'}`}
      >
        {`${isDesktop ? '+ Create Ticket' : '+'} `}
      </div>

      <Modal
        title="Create Ticket"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} loading={loading} >
            Create
          </Button>,
        ]}
        className='top-[8vh] px-4'
      >
        <Form form={form} layout="vertical" className='space-y-4 m-0 p-0 my-8' onFinish={handleOk}>          

          <Form.Item
            label="Customer ID"
            name="customerId"
            rules={[{ required: true, message: 'Please enter customer id!' }]}
          >
            <Input placeholder="Enter Customer ID" />
          </Form.Item>


          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: 'Please enter the subject!' }]}
            >
              <Input placeholder="Enter Subject" />
          </Form.Item>
            
          <Form.Item
            label="Tier 1"
            name="tier1"
            className='m-0 text-xs space-x-0 space-y-0 gap-0'
            >
            <Input className='m-0 px-2 bg-slate-100' disabled />
          </Form.Item>

          <Form.Item
            label="Tier 2"
            name="tier2"
            rules={[{ required: true, message: 'Please select tier 2!' }]}
            >
            {/* <p className='p-1 font-bold'>Tier 2</p> */}
            <Select placeholder="Select Tier 2">
              <Select.Option value="Distribution">Distribution</Select.Option>
              <Select.Option value="DW Cable">DW Cable</Select.Option>
              <Select.Option value="FAT">FAT</Select.Option>
              <Select.Option value="FDT">FDT</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter a description!' }]}
          >
            <TextArea rows={4} placeholder="Enter Description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormTicket;
