import { useEffect, useState} from 'react';
import { useSelector} from 'react-redux';
import api from '../api/api';
import MachineList from '../components/machines/MachineList';

function MachinesPage() {
  const { user } = useSelector(state => state.auth);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const endpoint = user.role === 'CLIENT'
          ? '/user/machines/'
          : '/machines/';
        const response = await api.get(endpoint);
        setMachines(response.data);
      } catch (error) {
        console.error('Error fetching machines:', error);
      }
    };

    fetchMachines();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Мои машины</h1>
      <MachineList machines={machines} role={user.role} />
    </div>
  );
}

export default MachinesPage;