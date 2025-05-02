import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './pages/Dashboard';
import MachinesPage from './pages/MachinesPage';
import Login from './components/auth/Login';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['CLIENT', 'MANAGER']} />}>
            <Route path="/machines" element={<MachinesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
