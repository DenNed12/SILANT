import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import ProtectedRoute from './ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import CatalogPage from './pages/CatalogPage';
import MachinesPage from './pages/MachinesPage';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Полу-публичные маршруты (требуют аутентификации) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/catalog" element={<CatalogPage />} />
          </Route>

          {/* Защищенные маршруты (требуют определенных ролей) */}
          <Route element={<ProtectedRoute allowedRoles={['CLIENT', 'MANAGER']} />}>
            <Route path="/machines" element={<MachinesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;