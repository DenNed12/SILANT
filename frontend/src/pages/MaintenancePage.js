import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/api';
import MaintenanceList from '../components/maintenance/MaintenanceList';
import MaintenanceForm from '../components/maintenance/MaintenanceForm';

function MaintenancePage() {
  const { user } = useSelector(state => state.auth);
  const [maintenances, setMaintenances] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [maintenancesRes, machinesRes] = await Promise.all([
          api.get('/maintenances/'),
          api.get(user.role === 'CLIENT' ? '/user/machines/' : '/machines/')
        ]);
        setMaintenances(maintenancesRes.data);
        setMachines(machinesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user]);

  const handleAddMaintenance = async (formData) => {
    try {
      const response = await api.post('/maintenances/', formData);
      setMaintenances([...maintenances, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding maintenance:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Техническое обслуживание</h1>
        {user.role !== 'CLIENT' && (
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
        role={user.role}
      />
    </div>
  );
}

export default MaintenanceForm;