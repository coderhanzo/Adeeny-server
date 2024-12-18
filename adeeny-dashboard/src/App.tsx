import { useEffect} from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'; 
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import AddMosque from './pages/Form/AddMosque';
import AddImam from './pages/Form/AddImam';
import AllMosque from './pages/AllMosque/AllMosque';
import AllWaqf from './pages/AllWaqf/AllWaqf';
import VerifyOtp from './pages/Authentication/VerifyOtp';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store/Store';
import AddWaqf from './pages/Form/AddWaqf';

function App() {
  const { pathname } = useLocation();
  const token: string | null = useSelector((state: RootState) => state.auth.accessToken);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

 

  return !token ? (
    <>
      <div className=''>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
        <Route
          path="/auth/verifyotp"
          element={
            <>
              <PageTitle title="Verify OTP | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <VerifyOtp />
            </>
          }
        />
        {/* Catch-all route for undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
    </>
  ) : (
    <>
      <DefaultLayout>
        <Routes>
          <Route
            path="/dashbord"
            element={
              <>
                <PageTitle title="Adeeny Dashboard" />
                <Dashboard token={token} />
              </>
            }
          />
          <Route
            path="/calendar"
            element={
              <>
                <PageTitle title="Calendar" />
                <Calendar />
              </>
            }
          />
    
          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Profile />
              </>
            }
          />
          <Route
            path="/tables"
            element={
              <>
                <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Tables />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Settings />
              </>
            }
          />
         
          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Buttons />
              </>
            }
          />
          <Route
            path="/addmosque"
            element={
              <>
                <PageTitle title="Add Mosque | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <AddMosque />
              </>
            }
          />
          <Route
            path="/addImam"
            element={
              <>
                <PageTitle title="Add Imam | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <AddImam />
              </>
            }
          />
          <Route
            path="/allmosque"
            element={
              <>
                <PageTitle title="All Mosques | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <AllMosque token={token} />
              </>
            }
          />
          <Route
            path="/allwaqf"
            element={
              <>
                <PageTitle title="All Waqf | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <AllWaqf />
              </>
            }
          />

           <Route
            path="/addwaqf"
            element={
              <>
                <PageTitle title="All Waqf | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <AddWaqf/>
              </>
            }
          />
          
          {/* Catch-all route for undefined authenticated routes */}
          <Route path="*" element={<Navigate to="/dashbord" replace />} /> {/* Redirect to /dashbord if the route is not found */}
        </Routes>
      </DefaultLayout>
    </>
  );
}

export default App;
