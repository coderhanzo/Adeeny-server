import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyUser } from '../../redux/slice/authSlice';
import Header from '../../components/Header';
import { useLocation , useNavigate} from 'react-router-dom';
import Loader from '../../common/Loader';
import Alerts from '../UiElements/Alerts';
import AuthHeader from '../../components/Header/AuthHeader';


const VerifyOtp: React.FC = () => {

  const location = useLocation();
  const { email } = location.state || {}


  const [userData, setUserData] = useState({
    email: email,
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const dispatch = useDispatch();
 


  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData.email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }

    console.log(userData,'JE')
    setLoading(true);
    try {
      const user = {
        email: userData.email,
        otp: userData.otp,
      };
      

      
      await dispatch(await (verifyUser({email:user.email, otp:user.otp}) as unknown as Promise<any>)).unwrap();
      navigate("/dashbord");

    } catch (error) {

      console.log(error, "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeader sidebarOpen={undefined} setSidebarOpen={function (arg0: boolean): void {
        throw new Error('Function not implemented.');
      } }/>
      <div className="rounded-sm border border-stroke  dark:border-strokedark  bg-white shadow-default">
        <div className="flex flex-wrap items-center h-[100%]   ">
          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 dark:bg-boxdark w-[60] h-[100vh] " >
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5 bg-slate-50 h-[100%]  shadow-default dark:border-strokedark dark:bg-boxdark ">
              <span className="mb-1.5 block font-medium">Enter Otp</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                OTP
              </h2>

              {}

              <form onSubmit={handleOnSubmit}>
                {/* Email input */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleOnChange}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* otp input */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">otp</label>
                  <input
                    type="otp"
                    name="otp"
                    value={userData.otp}
                    onChange={handleOnChange}
                    placeholder="Enter your otp"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Verify Otp"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    disabled={loading}
                  />
                </div>

                <div className="text-center">
                  {/* <span className="text-sm">Don't have an account? </span> */}
                  {/* <Link to="/signup" className="text-primary"></Link> */}
                </div>
              </form>
            </div>
          </div>
          <div className="hidden w-[40%] xl:block xl:w-1/2 h-[100vh]  dark:bg-black">
           <div className="h-full w-[100%] dark:opacity-50 dark:bg-black">
             <Link className="inline-block h-full  w-[100%]" to="/">
               <img className="object-cover w-full h-full" src="https://images.pexels.com/photos/19421082/pexels-photo-19421082/free-photo-of-sheikh-zayed-grand-mosque-in-uae.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Logo" />
            </Link>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;