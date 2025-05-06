import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/api';
import MaintenanceList from '../components/maintenance/MaintenanceList';
import MaintenanceForm from '../components/maintenance/MaintenanceForm';

function MaintenancePage() {
  const { user } = useSelector(state => state.auth ?? {});
  const [maintenances, setMaintenances] = useState([]);
  const [machines, setMachines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Проверяем доступность API
        await api.get('/health-check').catch(() => {
          throw new Error('Сервер недоступен');
        });

        // 2. Параллельные запросы с таймаутом
        const requests = [
          api.get('/maintenances/', { timeout: 5000 }),
          api.get(user?.role === 'CLIENT' ? '/user/machines/' : '/machines/', { timeout: 5000 })
        ];

        const [maintenancesRes, machinesRes] = await Promise.all(requests);

        setMaintenances(maintenancesRes.data);
        setMachines(machinesRes.data);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message ||
                err.message ||
                'Ошибка сети. Проверьте подключение и повторите попытку');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAddMaintenance = async (formData) => {
    try {
      const response = await api.post('/maintenances/', formData, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMaintenances(prev => [response.data, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error('Submit Error:', err);
      setError(err.response?.data?.message || 'Ошибка при сохранении ТО');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
        >
          Обновить страницу
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Техническое обслуживание</h1>
        {user?.role !== 'CLIENT' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Добавить ТО
          </button>
        )}
      </div>

      {showForm && (
        <MaintenanceForm
          machines={machines}
          onSubmit={handleAddMaintenance}
          onCancel={() => setShowForm(false)}
        />
      )}

      <MaintenanceList
        maintenances={maintenances}
        canEdit={user?.role === 'MANAGER' || user?.role === 'SERVICE'}
      />
    </div>
  );
}

export default MaintenancePage;