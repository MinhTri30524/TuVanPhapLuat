import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
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
      </Routes>
  );
}
export default App