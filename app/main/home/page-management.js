'use client'

import { IoBusiness } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Menu } from 'antd';
import MenuTenant from './components/menu-tenant';
import MenuUser from './components/menu-user';


const items = [
  {
    label: 'Tenant Management',
    key: 'tenant',
    icon: <IoBusiness />,
    roleRequired: ['superadmin'],
  },
  {
    label: 'User Management',
    key: 'user',
    icon: <FaUser />,
    roleRequired: ['superadmin', 'admin'],
  },
];

const PageManagement = ({ session, datas, setRefresh, currentPage, setCurrentPage }) => {

  const onClick = (e) => {
    setCurrentPage(e.key);
  };

  // Filter items based on the user's role, removing roleRequired from each item
  const filteredItems = items
    .filter(item => item.roleRequired.includes(session.role) || !item.roleRequired) // Check role access
    .map(({ roleRequired, ...rest }) => rest); // Remove `roleRequired` before passing to the Menu

  const renderComponent = () => {
    switch (currentPage) {
      case 'tenant':
        return (
          <MenuTenant 
            datas={datas} 
            session={session}
            setRefresh={setRefresh} 
          />
        );
      case 'user':
        return (
          <MenuUser 
            datas={datas} 
            session={session}
            setRefresh={setRefresh} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='pt-16 px-4'>
      <Menu onClick={onClick} selectedKeys={[currentPage]} mode="horizontal" items={filteredItems} />
      {renderComponent()}
    </div>
  );
};

export default PageManagement;
