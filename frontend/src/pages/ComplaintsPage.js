import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/api';
import ComplaintList from '../components/complaints/ComplaintList';
import ComplaintForm from '../components/complaints/ComplaintForm';

function ComplaintsPage() {
  const { user } = useSelector(state => state.auth);
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [machines, setMachines] = useState([]);
  const [failureNodes, setFailureNodes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsRes, machinesRes, refsRes] = await Promise.all([
          api.get('/complaints/'),
          api.get(user.role === 'CLIENT' ? '/user/machines/' : '/machines/'),
          api.get('/references/?name=Узел отказа')
        ]);
        setComplaints(complaintsRes.data);
        setMachines(machinesRes.data);
        setFailureNodes(refsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user]);

  const handleAddComplaint = async (formData) => {
    try {
      const response = await api.post('/complaints/', formData);
      setComplaints([...complaints, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding complaint:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Рекламации</h1>
        {user.role !== 'CLIENT' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Добавить рекламацию
          </button>
        )}
      </div>

      {showForm && (
        <ComplaintForm
          machines={machines}
          failureNodes={failureNodes}
          onSubmit={handleAddComplaint}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ComplaintList
        complaints={complaints}
        role={user.role}
      />
    </div>
  );
}

export default ComplaintsPage;