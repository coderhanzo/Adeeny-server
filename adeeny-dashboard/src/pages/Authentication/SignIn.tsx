import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/slice/authSlice';
import Loader from '../../common/Loader';
import AuthHeader from '../../components/Header/AuthHeader';


const SignIn: React.FC = () => {  
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const user = {
        email: userData.email,
        password: userData.password,
      };

      await dispatch(await (loginUser({ email: user.email, password: user.password }) as unknown as Promise<any>)).unwrap();
      navigate("/auth/verifyotp", { state: { email: user.email } });
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeader sidebarOpen={undefined} setSidebarOpen={function (arg0: boolean): void {
        throw new Error('Function not implemented.');
      } }/>

      {/* Display Loader if loading is true */}
      {loading && <Loader />}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark">
        <div className="flex flex-wrap items-center h-[100%]">
          
          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 dark:bg-boxdark h-[100vh]">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5 bg-slate-50 h-[100%] shadow-default dark:border-strokedark dark:bg-boxdark">
              <span className="mb-1.5 block font-medium">Welcome back</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to Adeeny
              </h2>

              {/* Show Alerts if there's an error */}
              {error && <p>{error}</p>}

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

                {/* Password input */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleOnChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    disabled={loading} // Disable the button while loading
                  />
                </div>

                <div className="text-center">
                  <span className="text-sm">Don't have an account? </span>
                  <Link to="/auth/signup" className="text-primary">Sign Up</Link>
                </div>
              </form>
            </div>
          </div>

          <div className="hidden w-[40%] xl:block xl:w-1/2 h-[100vh] dark:bg-black">
            <div className="h-full w-[100%] dark:opacity-50 dark:bg-black">
              <Link className="inline-block h-full w-[100%]" to="/">
                <img className="object-cover w-full h-full" src="https://images.pexels.com/photos/19421082/pexels-photo-19421082/free-photo-of-sheikh-zayed-grand-mosque-in-uae.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Logo" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;