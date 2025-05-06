import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import CatalogPage from './pages/CatalogPage';
import MachinesPage from './pages/MachinesPage';
import MaintenancePage from './pages/MaintenancePage';
import ComplaintsPage from './pages/ComplaintsPage';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/machines" element={<MachinesPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />



        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;