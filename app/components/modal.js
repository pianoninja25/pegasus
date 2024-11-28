import React, { useState } from 'react';
import { Button, Modal } from 'antd';


const ModalPopup = ({ isModalOpen, setIsModalOpen, datas }) => {

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (

    <>
      <Modal 
        title="Order Detail" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        className='px-4'
      >

        <table className='w-full my-8 table-fixed font-quicksand'>
          <tbody>
            {Object.entries(datas).map(([key, value]) => (
              <tr key={key}>
                <td className="w-2/5 px-2 py-1 text-xs text-right border border-slate-300 bg-slate-200">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </td>
                <td className="w-3/5 px-2 py-1 text-xs text-ellipsis whitespace-nowrap border border-slate-300 bg-slate-50 overflow-hidden">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </Modal>
    </>
  );
};
export default ModalPopup;