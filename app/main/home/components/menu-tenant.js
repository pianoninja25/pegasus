import React, { useState } from "react";
import { message } from "antd";
import TableComponent from "./table";
import ModalTenant from "./modal-tenant";
import { createTenant } from "../function";

const MenuTenant = ({ datas, session, setRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true);
    const result = await createTenant(values); 
    if (typeof result === 'string') {
      message.error(result);
    } else if (result?.status === 201) {
      message.success(`${result.data.username} created successfully!`);
      setRefresh(Math.random());
      setIsModalOpen(false);
    } else {
      message.error("An unexpected error occurred.");
    }
    setLoading(false);
  };


  return (
    <div className="p-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-1 text-sm shadow-sm rounded-md bg-amtorange text-white hover:scale-105 hover:shadow-lg transition-all duration-700"
      >
        Add Tenant +
      </button>

      <TableComponent 
        datas={datas.tenants} 
        type="tenant" 
        {...{session, loading, setLoading, setRefresh, onFinish}}
      />

      <ModalTenant {...{isModalOpen, setIsModalOpen, loading, setLoading, setRefresh, onFinish}} />
    </div>
  );
};

export default MenuTenant;
