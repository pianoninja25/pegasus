import React, { useState } from 'react';
import { Button, Modal } from 'antd';


const ModalPopup = ({ isModalOpen, setIsModalOpen, datas }) => {

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (

    <>
      <Modal 
        title="Create Ticket" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        className='px-4'
      >
        <div>
          TEST
        </div>

      </Modal>
    </>
  );
};
export default ModalPopup;