import React, { useState, ReactNode } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { Link } from 'react-router-dom';
import DropdownDefault from '../components/Dropdowns/DropdownDefault';
import AddMenuItemsDropdown from '../components/Dropdowns/AddMenuItemsDropDownDefault';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark ">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


          {/* <!-- ===== Header End ===== --> */}


          <div className='flex items-center justify-end shadow-2 h-[80px]'>
          <Link
              to="/addmosque"
              className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center text-xs font-semibold text-white hover:bg-opacity-90 lg:px-8 xl:px-10 m-4"
            >
            
               add mosque
            </Link>
            
            <Link
              to="/addImam"
              className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center text-xs font-semibold text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ml-4"
            >
              
              add Imam
            </Link>

            <div
              
              className="inline-flex items-center justify-center  w-1 py-4 px-10 text-center text-xs font-semibold text-white hover:bg-opacity-90 lg:px-8 xl:px-10 "
            >
            {/* <DefaultLayout children={undefined} /> */}
            <AddMenuItemsDropdown/>
               
            </div>
          </div>

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
