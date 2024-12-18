import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/Store';
import { getAllwaqfData } from '../../redux/slice/waqfSlice';

const itemsPerPage = 4;
const baseURL = "http://13.244.112.116:8000";
const MAX_LENGTH = 10;

const WaqfTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const waqfs = useSelector((state: RootState) => state.waqf.waqfs);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  console.log(waqfs,"s")

  useEffect(() => {
    if (token) {
      setLoading(true);
      dispatch(getAllwaqfData(token))
        .unwrap()
        .then(() => setLoading(false))
        .catch((error: string) => {
          setLoading(false);
          setErrorMessage('Failed to fetch waqf data. Please try again later.');
          console.log(error,"error fetched  ")
        });
    }
  }, [token, dispatch]);

  const filteredData = waqfs.filter((waqf) =>
    waqf.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentwaqfs = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="border border-stroke bg-white shadow-default p-6 rounded-md dark:border-strokedark dark:bg-boxdark">

      <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
        <h4 className="text-xl font-semibold text-black dark:text-white">Nearby Mosques</h4>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border  border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-3 py-2 rounded-md focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-5  border-stroke py-4.5 px-4 dark:border-strokedark rounded-t  bg-gray-2 dark:bg-meta-4">
        <div className="text-center text-sm font-semibold uppercase">Waqf Name</div>
        <div className="text-center text-sm font-semibold uppercase">Description</div>
        <div className="text-center text-sm font-semibold uppercase">Target</div>
        <div className="text-center text-sm font-semibold uppercase">Amount</div>
        <div className="text-center text-sm font-semibold uppercase">Actions</div>
      </div>

      {currentwaqfs.map((waqf, index) => (
        <div className="grid grid-cols-5 border-t border-stroke dark:border-strokedark py-4" key={index}>
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              {waqf.upload_image ? (
                <img src={`${baseURL}${waqf.upload_image}`} alt="waqf" className="w-10 h-10 rounded-md" />
              ) : (
                <div className="w-10 h-10 bg-teal-800 text-white text-xs flex items-center justify-center rounded-md">
                  No Image
                </div>
              )}
              <span className="text-sm text-black dark:text-white">{waqf.title}</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-black dark:text-white">
              {waqf.description
                ? waqf.description.length > MAX_LENGTH
                  ? `${waqf.description.slice(0, MAX_LENGTH)}...`
                  : waqf.description
                : 'No description available'}
            </p>
          </div>

          <div className="text-center text-sm text-black dark:text-white">
            {waqf.target_amount || "NO WAQF"}
          </div>

          <div className="text-center text-sm text-black dark:text-white">
            {waqf.target_amount || "NO WAQF"}
          </div>

          <div className="flex justify-center space-x-2">
            <button className="w-8 h-8 bg-blue-500 text-white rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M17 2L22 7L11 18L6 18L6 13L17 2Z"></path>
                <line x1="3" y1="21" x2="21" y2="21"></line>
              </svg>
            </button>
            <button className="w-8 h-8 bg-red-500 text-white rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6L19 19C19 20.1 18.1 21 17 21L7 21C5.9 21 5 20.1 5 19L5 6"></path>
                <path d="M10 11L10 17"></path>
                <path d="M14 11L14 17"></path>
                <path d="M9 3L15 3"></path>
                <path d="M12 3L12 6"></path>
              </svg>
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div className="text-sm">Page {currentPage} of {totalPages}</div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WaqfTable;
