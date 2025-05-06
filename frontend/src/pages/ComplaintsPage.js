import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/api';
import ComplaintList from '../components/complaints/ComplaintList';
import ComplaintForm from '../components/complaints/ComplaintForm';

function ComplaintsPage() {
  // Безопасное получение user с дефолтным значением
  const { user } = useSelector(state => state.auth ?? {});
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [machines, setMachines] = useState([]);
  const [failureNodes, setFailureNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Определяем endpoint в зависимости от роли (если пользователь есть)
        const machinesEndpoint = user?.role === 'CLIENT'
          ? '/user/machines/'
          : '/machines/';

        const [complaintsRes, machinesRes, refsRes] = await Promise.all([
          api.get('/complaints/'),
          api.get(machinesEndpoint),
          api.get('/references/?name=Узел отказа')
        ]);

        setComplaints(complaintsRes.data);
        setMachines(machinesRes.data);
        setFailureNodes(refsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.role]); // Зависимость только от role

  const handleAddComplaint = async (formData) => {
    try {
      const response = await api.post('/complaints/', formData);
      setComplaints([response.data, ...complaints]);
      setShowForm(false);
    } catch (err) {
      console.error('Error adding complaint:', err);
      setError('Ошибка при добавлении рекламации');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          Обновить
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Рекламации</h1>
        {/* Показываем кнопку только если user существует и не CLIENT */}
        {user && user.role !== 'CLIENT' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Добавить рекламацию
          </button>
        )}
      </div>

      {showForm && (
        user ? (
          <ComplaintForm
            machines={machines}
            failureNodes={failureNodes}
            onSubmit={handleAddComplaint}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            Для добавления рекламации необходимо авторизоваться
          </div>
        )
      )}

      <ComplaintList
        complaints={complaints}
        canEdit={!!user} // Передаем возможность редактирования
      />
    </div>
  );
}

export default ComplaintsPage;