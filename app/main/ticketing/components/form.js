'use client';

import { Modal, Input, Select, Form, Button, message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const { TextArea } = Input;

const FormTicket = ({ user, setRefresh, loading, setLoading, isDesktop }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();



  async function getData(payload) {
    try {
      setLoading(true)
      const response = await axios.post('/api/ticket_creation', {
        username: user,
        password: 'test',
        // payload: {
        //   customerId: 'A12345',
        //   subject: 'POP',
        //   tier1: 'Access Issue',
        //   tier2: 'DW Cable',
        //   description: 'asd'
        // }
        payload: payload
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    } finally {
      setLoading(false)
    }
  }

  const handleOk = async () => {
    try {
      setLoading(true);
      const formData = await form.validateFields();
      const payload = {
        customerId: formData.customerId,
        subject: formData.subject,
        tier1: formData.tier1,
        tier2: formData.tier2,
        description: formData.description,
      };
      const ticketData = await getData(payload)
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
