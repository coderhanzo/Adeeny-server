import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMosque} from '../../redux/slice/mosqueSlice';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { AppDispatch, RootState } from '../../redux/store/Store';
import Modal from '../../common/Loader/Modal';

const AddMosque = () => {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const [addMosqueData, setAddMosqueData] = useState({
    mosqueName: "",
    email: "",
    phone: "",
    imamName: "",
    content: "",
    donation: [],
    profilePic: null as File | null,
  });

  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  console.log(token,"heyyss")
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState({
    lat: "37.7882",
    long: "-122.4324",
    locationDisplayName: ""
  });

  // const [locationOptions, setLocationOptions] = useState([]);

  const handleUpdateState = (name: string, value: string) => {
    setAddMosqueData((prevState) => ({ ...prevState, [name]: value }));
  };


  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', addMosqueData.mosqueName);
      formData.append('mail', addMosqueData.email);
      formData.append('tel', addMosqueData.phone);
      formData.append('imam', addMosqueData.imamName);
      formData.append('description', addMosqueData.content);
      formData.append('location', location.locationDisplayName);
      formData.append('lat', location.lat);
      formData.append('long', location.long);

      if (addMosqueData.profilePic) {
        formData.append('image', addMosqueData.profilePic);
      }

      await dispatch(createMosque({ mosqueData: formData, token })).unwrap();
      setLoading(true);
      setModalContent('Mosque added successfully!');
      setShowModal(true);
    } catch (error: any) {
      setModalContent(error?.message || 'An error occurred while adding the Waqf.');
    } finally {
      setLoading(false);
      setShowModal(true);
    
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setAddMosqueData(prevData => ({ ...prevData, profilePic: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};

  const handleLocationBlur = async (input: string) => {
    try {
      const response = await axios.get(`https://api.locationiq.com/v1/autocomplete.php`, {
        params: {
          key: 'pk.47848036c9bfb7540f8cf9c7c2c25729',
          q: input,
          format: 'json'
        }
      });

      if (response.data.length > 0) {
        const options = response.data.map((item: { display_name: any; lat: string; lon: string; }) => ({
          label: item.display_name,
          value: {
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            locationDisplayName: item.display_name
          }
        }));
        // setLocationOptions(options);
      } else {
        alert("Could not retrieve location details. Please try again.");
      }
    } catch (error) {
      setModalContent("Error fetching location details.")
      alert("Error fetching location details.");
    }
  };

  // const handleLocationSelect = (selectedLocation) => {
  //   setLocation(selectedLocation);
  //   setLocationOptions([]);
  // };


  return (
    <>

      <Breadcrumb pageName="Add New Mosque" />
      <div className="flex justify-center items-center w-[100%] ">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark w-[100%]">
          <div className="border-b border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-4 px-6.5">
            <h3 className="font-medium text-black dark:text-white ">
              Add New Mosque
            </h3>
          </div>
          <form onSubmit={handleOnSubmit} className='w-[100%] '>
            <div className="p-6.5  border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Mosque Name
                  </label>
                  <input
                    type="text"
                    value={addMosqueData.mosqueName}
                    onChange={(e) => handleUpdateState("mosqueName", e.target.value)}
                    placeholder="Enter mosque name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    value={addMosqueData.email}
                    onChange={(e) => handleUpdateState("email", e.target.value)}
                    placeholder="Enter email"
                   className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Phone
                </label>
                <input
                  type="tel"
                  value={addMosqueData.phone}
                  onChange={(e) => handleUpdateState("phone", e.target.value)}
                  placeholder="Enter phone number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Imam Name
                </label>
                <input
                  type="text"
                  value={addMosqueData.imamName}
                  onChange={(e) => handleUpdateState("imamName", e.target.value)}
                  placeholder="Enter Imam's name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
               Profile Picture
              </label>
              <div className='flex'>
              <input
               type="file"
               accept="image/*"
               onChange={handleFileChange}
               className="w-full"
             />
            {preview && (
               <div className="">
                <img src={preview} alt="Profile Preview" className="w-10 h-10 rounded-full object-cover" />
               </div>
            )}
         </div>
        </div>

                 

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Location
                </label>
                <input
                  type="text"
                  value={location.locationDisplayName}
                  onBlur={(e) => handleLocationBlur(e.target.value)}
                  onChange={(e) => setLocation({ ...location, locationDisplayName: e.target.value })}
                  placeholder="Enter location"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Additional Info
                </label>
                <textarea
                  value={addMosqueData.content}
                  onChange={(e) => handleUpdateState("content", e.target.value)}
                  placeholder="Enter additional information"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  rows={4}
                />
              </div>

              <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                      {loading ? <div className="h-7 w-7 animate-spin rounded-full border-4 border-solid border-stroke border-t-transparent"></div>: 'AddMosque'}
                </button>
            </div>
          </form>
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

export default AddMosque;


