import { Input } from 'antd';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';

const Filter = ({ handleSearchChange, statusFilter, setStatusFilter, statusCounts }) => {
  return (
    <div className='mb-4'>
      <div className="flex gap-2 items-center px-5 sm:px-0 pb-3 sm:max-w-[17.5rem]">
        <Input
          placeholder="Search by Order ID / Customer Name"
          className="h-fit text-sm sm:text-xs rounded-md shadow-sm border border-transparent sm:border-slate-200"
          onChange={handleSearchChange}
          allowClear
          prefix={
            <SearchOutlined
              style={{
                color: '#f58220',
                marginRight: '8px',
              }}
            />
          }
        />
      </div>
      <div className="flex flex-wrap gap-2 px-6 sm:px-0 pb-4">
        <button 
          onClick={() => setStatusFilter('All')} 
          className={`p-1 px-2 text-xs shadow-sm rounded-sm sm:rounded-lg text-white hover:bg-amtorange ${statusFilter == 'All' ? 'bg-amtorange/80' : 'bg-slate-300'}`}
        >
          All ({statusCounts?.All || 0})
        </button>
        <button 
          onClick={() => setStatusFilter('Complete')} 
          className={`p-1 px-2 text-xs shadow-sm rounded-sm sm:rounded-lg text-white hover:bg-amtorange ${statusFilter == 'Complete' ? 'bg-amtorange/80' : 'bg-slate-300'}`}
        >
          Complete ({statusCounts?.Complete || 0})
        </button>
        <button 
          onClick={() => setStatusFilter('Progress')} 
          className={`p-1 px-2 text-xs shadow-sm rounded-sm sm:rounded-lg text-white hover:bg-amtorange ${statusFilter == 'Progress' ? 'bg-amtorange/80' : 'bg-slate-300'}`}
        >
          Progress ({statusCounts?.Progress || 0})
        </button>
        <button 
          onClick={() => setStatusFilter('Awaiting')} 
          className={`p-1 px-2 text-xs shadow-sm rounded-sm sm:rounded-lg text-white hover:bg-amtorange ${statusFilter == 'Awaiting' ? 'bg-amtorange/80' : 'bg-slate-300'}`}
        >
          Awaiting ({statusCounts?.Awaiting || 0})
        </button>
        <button 
          onClick={() => setStatusFilter('Cancel')} 
          className={`p-1 px-2 text-xs shadow-sm rounded-sm sm:rounded-lg text-white hover:bg-amtorange ${statusFilter == 'Cancel' ? 'bg-amtorange/80' : 'bg-slate-300'}`}
        >
          Cancel ({statusCounts?.Cancel || 0})
        </button>
      </div>
    </div>
  );
};

export default Filter;
