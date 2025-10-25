import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ProtectedRoute from "./pages/user/protectedRoutes";
import ProtectedAdminRoute from "./pages/admin/protectAdmin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 📄 Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// 👤 User Dashboard Pages
import UserDashboardLayout from "./pages/user/UserDashboardLayout";
import AddSubject from "./pages/user/AddSubject";
import StudyPlans from "./pages/user/StudyPlans";
import Notes from "./pages/user/Notes";
import Payments from "./pages/user/Payments";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import TodayStudyPath from "./pages/user/TodayStudyPath";
import ViewPlan from "./pages/user/ViewPlan";
import Exams from "./pages/user/Exams";

// 🛠️ Admin Dashboard Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AllUsers from "./pages/admin/AllUsers";
import PaymentAnalytics from "./pages/admin/PaymentAnalytics";


 const App=()=> {
  return (
    <Router>
      <div className="flex flex-col min-h-screen ga">
        <Navbar />

        <main className="flex-grow mt-10 mb-0">
          <Routes>

            {/* 🌐 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 👤 User Dashboard Routes */}
            <Route path="/user" element={
              <ProtectedRoute>
                <UserDashboardLayout />
              </ProtectedRoute>
              }>
              {/* ✅ Default page: AddSubject */}
              <Route index element={<AddSubject />} />

              {/* ✅ Named routes */}
              <Route path="add-subject" element={<AddSubject />} />
              <Route path="study-plans" element={<StudyPlans />} />
              <Route path="exams" element={<Exams />} />
              <Route path="notes" element={<Notes />} />
              <Route path="payments" element={<Payments />} />
              <Route path="todays-study-plan/:subjectId" element={<TodayStudyPath />} />
              <Route path="payment-success" element={<PaymentSuccess/>}/>
              <Route path="/user/plan/:subjectId" element={<ViewPlan />} />
            </Route>
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
              }>
              <Route index element={<PaymentAnalytics />} /> {/* default */}
              <Route path="users" element={
                <ProtectedAdminRoute>

                  <AllUsers />
                </ProtectedAdminRoute>
                } />
              <Route path="payments" element={<PaymentAnalytics />} />
            </Route>


            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
