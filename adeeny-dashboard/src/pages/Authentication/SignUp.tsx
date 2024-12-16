import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createUser } from '../../redux/slice/authSlice';
import AuthHeader from '../../components/Header/AuthHeader';


const SignUp: React.FC = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    username: "", 
    email: "",
    phone: "",
    password: "",
    passwordAgain: "",
    phoneNumber:"",
    role: "ADMIN",
    profilePic: null as File | null, 
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserData(prevData => ({ ...prevData, profilePic: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  console.log(userData.profilePic,"hhe")
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData.email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }

    if (userData.password !== userData.passwordAgain) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // const user = 

      await dispatch(await (createUser({
        first_name: userData.firstname,
        last_name: userData.lastname,
        other_name: userData.firstname + " " + userData.lastname,
        email: userData.email,
        phone_number: userData.phoneNumber,
        password: userData.password,
        profile_pic: userData.profilePic,
        confirm_password: userData.passwordAgain,
        role: userData.role,
        // image: undefined
      }) as unknown as Promise<any>)).unwrap();
      navigate("/auth/verifyotp", { state: { email: userData.email } });
      // dispatch(addUser(user));
    } catch (error) {
      console.log(error, "hjhe");
      // alert('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
    
     {/* <Header/> */}
     <AuthHeader sidebarOpen={undefined} setSidebarOpen={function (arg0: boolean): void {
        throw new Error('Function not implemented.');
      } }/>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark  dark:bg-black ">
        <div className="flex flex-wrap items-center h-[1000px]">
         

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 dark:bg-boxdark w-[60] h-[100%]">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5 bg-slate-50 h-[100%]  shadow-default dark:border-strokedark dark:bg-boxdark">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign Up to Adeeny
              </h2>

              <form onSubmit={handleOnSubmit}>
                {/* Name inputs */}
                <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Name</label>
                <div className="flex space-x-2">
               <input
               type="text"
               name="firstname"
               value={userData.firstname}
               onChange={handleOnChange}
               placeholder="Enter your first name"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <input
              type="text"
              name="lastname"
              value={userData.lastname}
              onChange={handleOnChange}
               placeholder="Enter your last name"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
         </div>

                {/* Profile Picture input */}
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

                {/* Password inputs */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Password</label>

                  <div className="flex space-x-2">
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleOnChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />

                   <input
                    type="password"
                    name="passwordAgain"
                    value={userData.passwordAgain}
                    onChange={handleOnChange}
                    placeholder="Re-enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  </div>
                 
                </div>

                {/* <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Re-type Password</label>
                 
                </div> */}

                <div className="mb-6">
               <label className="mb-2.5 block font-medium text-black dark:text-white">Phone Number</label>
                <input
             type="text"
              name="phoneNumber"
                value={userData.phoneNumber}
              onChange={handleOnChange}
             placeholder="Enter your phone number"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                 />
                </div>

                {/* Role selection */}
                <div className="mb-6">
                  <label htmlFor="role" className="mb-2.5 block font-medium text-black dark:text-white">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={userData.role}
                    onChange={handleOnChange}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="IMAM">Imam</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Create account"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    disabled={loading}
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="hidden w-[40%] xl:block xl:w-1/2 h-[100%] relative  dark:bg-black">
  <div className="h-full w-[100%] dark:opacity-50 dark:bg-black">
    <Link className="inline-block h-full w-[100%]" to="/">
      <img
        className="object-cover w-full h-full"
        src="https://images.pexels.com/photos/19421082/pexels-photo-19421082/free-photo-of-sheikh-zayed-grand-mosque-in-uae.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Logo"
      />
    </Link>
  </div>
</div>
         
        </div>
      </div>
    </>
  );
};

export default SignUp;

