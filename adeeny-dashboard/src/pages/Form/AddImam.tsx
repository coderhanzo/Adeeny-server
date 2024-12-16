import { useState } from 'react';
import { addUser, createUser } from '../../redux/slice/authSlice';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../../common/Loader';
import Modal from '../../common/Loader/Modal';
import { ActivityIndicator } from 'react-native';

const AddImam = () => {
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'IMAM',
    profilePic: null as File | null,
    message: '',
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setModalContent('Only JPG and PNG files are allowed.');
        setShowModal(true);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setModalContent('File size cannot exceed 5MB.');
        setShowModal(true);
        return;
      }

      setUserData((prevData) => ({ ...prevData, profilePic: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData.firstname || !userData.lastname || !userData.email || !userData.password) {
      setModalContent('All fields marked with * are required.');
      setShowModal(true);
      return;
    }

    if (!userData.email.includes('@')) {
      setModalContent('Please enter a valid email address.');
      setShowModal(true);
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setModalContent('Passwords do not match.');
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('first_name', userData.firstname);
      formData.append('last_name', userData.lastname);
      formData.append('other_name', `${userData.firstname} ${userData.lastname}`);
      formData.append('email', userData.email);
      formData.append('phone_number', userData.phoneNumber);
      formData.append('password', userData.password);
      formData.append('confirm_password', userData.confirmPassword);
      formData.append('role', userData.role);
      if (userData.profilePic) {
        formData.append('profile_pic', userData.profilePic);
      }

      await dispatch(createUser({ formData })).unwrap();
      setModalContent('Imam added successfully!');
      setShowModal(true);

      setTimeout(() => {
        navigate('/imams');
      }, 2000);
    } catch (error: any) {
      setModalContent(error?.message || 'An error occurred while adding the Imam.');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Breadcrumb pageName="Add New Imam" />

      <div className="flex justify-center items-center w-[100%]">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark w-[100%]">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Add New Imam</h3>
            </div>
            <form onSubmit={handleOnSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      First name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={userData.firstname}
                      onChange={handleOnChange}
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Last name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      name="lastname"
                      value={userData.lastname}
                      onChange={handleOnChange}
                      type="text"
                      placeholder="Enter your last name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Email <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleOnChange}
                      placeholder="Enter your email address"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Password <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={userData.password}
                      onChange={handleOnChange}
                      placeholder="Enter password"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Confirm Password <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleOnChange}
                    placeholder="Confirm password"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone number
                  </label>
                  <input
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleOnChange}
                    type="text"
                    placeholder="Enter your phone number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
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
                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={userData.message}
                    onChange={handleOnChange}
                    rows={6}
                    placeholder="Type your message"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${
                    loading ? 'cursor-not-allowed opacity-70' : ''
                  }`}
                >
                  {loading ? <div className="h-7 w-7 animate-spin rounded-full border-4 border-solid border-stroke border-t-transparent"></div>: 'Add Imam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Imam"
        content={modalContent}
      />
    </>
  );
};

export default AddImam;
