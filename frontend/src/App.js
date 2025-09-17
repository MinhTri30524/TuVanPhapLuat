import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PHome from './pages/pHome';
import PSearch from './pages/pSearch';
import PAdvise from './pages/pAdvise';
import PNews from './pages/pNews';
import PLogin from './pages/pLogin';
import PRegister from './pages/pRegister';
import PChat from './pages/pChat';
import PDetail from './pages/pDetail';
import PDocument from './pages/pDocument';
import PDetailDocument from './pages/pDetailDocument';
import AdminDashboard from './pages/pAdminDashboard';

function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<PHome />} />
        <Route path="/tracuu" element={<PSearch />} />
        <Route path="/tuvan" element={<PAdvise />} />
        <Route path="/tintuc" element={<PNews />} />
        <Route path="/chat" element={<PChat />} />
        <Route path="/login" element={<PLogin />} />
        <Route path="/register" element={<PRegister />} />
        <Route path="/tintuc/:slug/:id" element={<PDetail />} />
        <Route path="/vanban" element={<PDocument />} />
        <Route path="/vanban/:slug/:id" element={<PDetailDocument />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>

  );
}
export default App