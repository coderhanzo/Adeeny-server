import React, { useEffect } from 'react';
import CardDataStats from '../../components/CardDataStats';
import TableOne from '../../components/Tables/TableOne';
import { getAllMosqueData } from '../../redux/slice/mosqueSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/Store';
import { useSelector } from 'react-redux';

interface DashboardProps {
  token: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {

  const mosques = useSelector((state: RootState) => state.mosque.mosques);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (token) {
      // Uncomment the next line if you plan to manage loading state
      // setLoading(true);
      dispatch(getAllMosqueData(token))
        .unwrap()
        .catch((error) => {
          console.error('Failed to fetch mosque data:', error);
          // Handle error appropriately (e.g., set an error state)
        });
    }
  }, [token, dispatch]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Transactions" total="GH80" rate=""  levelUp>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Failed transactions" total="1" rate="" levelUp>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-primary dark:fill-white">
            <path fill="none" d="M0 0h24v24H0z" />
            <path fill="" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.707 13.707l-1.414 1.414L12 13.414l-2.293 2.293-1.414-1.414L10.586 12 8.293 9.707l1.414-1.414L12 10.586l2.293-2.293 1.414 1.414L13.414 12l2.293 2.293z" />
          </svg>
        </CardDataStats>
        <CardDataStats title={"Total Mosques"}  rate=""  total={mosques.length.toString()}  levelUp>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            width="24"
            height="24"
            className="fill-primary dark:fill-white"
          >
            <path
              d="M12 2c-1.11 0-2 .89-2 2s.89 2 2 2 2-.89 2-2-.89-2-2-2zm-8 8h2v-1c0-1.11-.89-2-2-2s-2 .89-2 2v1h2zm16 0h2v-1c0-1.11-.89-2-2-2s-2 .89-2 2v1h2zm-8 1c-3.31 0-6 2.69-6 6v5h12v-5c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4v3h-8v-3c0-2.21 1.79-4 4-4zM3 11v7h18v-7H3z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Total Waqf" total="GH
        30.456" rate=""  levelDown>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="fill-primary dark:fill-white"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm16 10v-2h-2v2h2zm-3 0v-2h-8v2h8zm3-8V6h-2v2h2zm-2-2h-8V6h8v2zm-11 2H4v2h2v-2zm1 0v2h8v-2h-8zm-2 2v2H4v-2h2zm-2 2h2v2H4v-2zm8 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
          </svg>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default Dashboard;