import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContextProvider } from "./context/AuthContext";
import EditActivityNew from "./pages/EditActivityPage/EditActivityNew";
import EditProfileNew from './pages/EditProfilePage/EditProfileNew';
import HistoryNew from "./pages/HistoryPage/HistoryNew";
import LandingNew from "./pages/HomePage/LandingNew";
import LoginNew from "./pages/LoginPage/LoginNew";
import SignUpNew from "./pages/LoginPage/SignUpNew";
import NewActivityNew from "./pages/NewActivityPage/NewActivityNew";
import ProfilePageNew from './pages/ProfilePageNew/ProfilePageNew';
import ForgotPassword from './pages/LoginPage/ForgotPassword';
import Settings from './pages/SettingsPage/Settings';

const Mobile = () => {

  return (
    <Router>
      <div className="w-screen h-full min-h-screen bg-white dark:bg-gray-900">
      <div className="fixed z-10 h-[env(safe-area-inset-top)] bg-white dark:bg-gray-900 opacity-90 left-0 right-0"></div>
        <AuthContextProvider>
            <Routes>
              <Route exact path="/" element={<AuthenticatedRoute><LoginNew /></AuthenticatedRoute>} />
              <Route exact path="/signup" element={<SignUpNew />} />
              <Route exact path="/forgotpassword" element={<ForgotPassword />} />
              <Route exact path="/home" element={<ProtectedRoute><LandingNew /></ProtectedRoute>} />
              <Route exact path="/newactivity" element={<NewActivityNew />} />
              <Route exact path="/editactivity" element={<EditActivityNew />} />
              <Route exact path="/profile" element={<ProfilePageNew />} />
              <Route exact path="/editprofile" element={<EditProfileNew />} />
              <Route exact path="/history" element={<HistoryNew />} />
              <Route exact path="/settings" element={<Settings />} />
            </Routes>
        </AuthContextProvider>
      </div>
    </Router>
  );
};

export default Mobile;