import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../common/Loader';
import Modal from '../../common/Loader/Modal';
import { createWaqf } from '../../redux/slice/waqfSlice';
import { RootState } from '../../redux/store/Store';

const AddWaqf = () => {
  const [waqfData, setWaqfData] = useState({
    title: '',
    description: '',
    image: null as File | null,
    imam: '',
    paymentType: '',
    targetAmout: '',
    phoneNumber: '',
    startDate: '',
    endDate: '',
  });

  const token: string | null = useSelector((state: RootState) => state.auth.accessToken);

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const dispatch = useDispatch();
  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setWaqfData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWaqfData((prevData) => ({ ...prevData, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('title', waqfData.title);
      formData.append('description', waqfData.description);
      formData.append('imams_name', waqfData.imam);
      formData.append('payment_type',"CARD");
      formData.append('target_amount', waqfData.targetAmout);
      formData.append('start_date', "");
      formData.append('end_date', "");
      if (waqfData.image) {
        formData.append('upload_image', waqfData.image);
      }
      if (!waqfData.title || !waqfData.description) {
        setModalContent("Please fill in all required fields.");
        setShowModal(true);
        return;
      }
      console.log(formData, "mama")
      await dispatch(createWaqf({ waqfData: formData, token })).unwrap();
      setLoading(true);
      setModalContent('Waqf added successfully!');
      setShowModal(true);
    } catch (error: any) {
      setModalContent(error?.message || 'An error occurred while adding the Waqf.');
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  return (
    <>
          {loading && <Loader />}
      <Breadcrumb pageName="Add  Waqf" />

      <div className="flex justify-center items-center w-[100%]">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark w-[100%]">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Add Waqf
              </h3>
            </div>
            <form action="#" onSubmit={handleOnSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={waqfData.title}
                      onChange={handleOnChange}
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Description
                    </label>
                    <input
                      name="description"
                      value={waqfData.description}
                      onChange={handleOnChange}
                      type="text"
                      placeholder="Enter description"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Profile Picture
                  </label>
                  <div className="flex">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full"
                    />
                    {preview && (
                      <div className="">
                        <img
                          src={preview}
                          alt="Profile Preview"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                      Choose Payment
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        value={selectedOption}
                        onChange={(e) => {
                          setSelectedOption(e.target.value);
                          changeTextColor();
                        }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                          isOptionSelected ? 'text-black dark:text-white' : ''
                        }`}
                      >
                      
                        <option
                          value="MOMO"
                          className="text-body dark:text-bodydark"
                        >
                          BANK
                        </option>
                        <option
                          value="BANK"
                          className="text-body dark:text-bodydark"
                        >
                          MOMO
                        </option>
                        <option
                          value="CARD"
                          className="text-body dark:text-bodydark"
                        >
                          CARD
                        </option>
                      </select>

                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                              fill=""
                            ></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Target Amount <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="targetAmout"
                      name="targetAmout"
                      value={waqfData.targetAmout}
                      onChange={handleOnChange}
                      placeholder="Enter default targetAmout"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    value={waqfData.phoneNumber}
                    onChange={handleOnChange}
                    type="text"
                    placeholder="Enter your phone number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* <SelectGroupOne options={paymentOptions}/> */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={waqfData.startDate}
                      onChange={handleOnChange}
                      placeholder="start date"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      End Date
                    </label>
                    <input
                      name="endDate"
                      value={waqfData.endDate}
                      onChange={handleOnChange}
                      type="date"
                      placeholder="End Date"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${
                    loading ? 'cursor-not-allowed opacity-70' : ''
                  }`}
                >
                  {loading ? <div className="h-7 w-7 animate-spin rounded-full border-4 border-solid border-stroke border-t-transparent"></div>: 'AddWaqf'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Waqf"
        content={modalContent}
      />
    </>
  );
};

export default AddWaqf;
