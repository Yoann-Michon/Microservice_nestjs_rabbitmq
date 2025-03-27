import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/dashboard/Profile";
import DashboardHome from "../pages/dashboard/DashboardHome";
import User from "../pages/dashboard/Users";
import { Event } from "../pages/Events";
import { DashboardEvent } from "../pages/dashboard/DashboardEvent";
import { AuthService } from "../services/Auth.service";
import { EventDetails } from "../pages/EventsDetails";
import { DashboardEventDetails } from "../pages/dashboard/DashboardEventDetails";
import Footer from "../components/Footer";
import Header from "../components/Header";

const App = () => {
  const PrivateRoute = () => {
    return !AuthService.isTokenExpired() ? <Outlet /> : <Navigate to="/signin" />;
  };
  
  const PublicLayout = () => {
    return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    );
  };
  
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<Event />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/event/:id" element={<EventDetails />} />
        </Route>
        
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="events" element={<DashboardEvent />} />
            <Route path="event/:id" element={<DashboardEventDetails />} />
            <Route path="user" element={<User />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;