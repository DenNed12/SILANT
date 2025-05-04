import { Card, StatCard } from '../components/UI/Card';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';



const MachinesPage = () => {
  const machines = useSelector(state => state.machines?.list || []);
  const maintenances = useSelector(state => state.maintenances?.recent || []);
  const { isAuthenticated, user } = useSelector(state => state.auth || {});

  return (
    <div className="container mx-auto p-4">
      {/* Шапка с кнопками */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SILANT - Управление техникой</h1>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Добро пожаловать, {user?.name}</span>
            <button className="text-red-600 hover:text-red-700">Выйти</button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Зарегистрироваться
            </Link>
          </div>
        )}
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Всего машин"
          value={machines.length}
          icon="🚜"
          link="/machines"
        />
        <StatCard
          title="На обслуживании"
          value={maintenances.length}
          icon="🔧"
          link="/maintenance"
        />
        <StatCard
          title="Активных рекламаций"
          value={0}
          icon="⚠️"
          link="/complaints"
        />
      </div>

      {/* Основные карточки с контентом */}
      <div className="grid grid-cols-1 gap-4">
        <Card title="Последние ТО">
          <div className="space-y-2">
            {maintenances.slice(0, 5).map(maintenance => (
              <div key={maintenance.id} className="border-b pb-2">
                <p className="font-medium">{maintenance.machineName}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{new Date(maintenance.date).toLocaleDateString()}</span>
                  <span>{maintenance.type}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Список всей техники">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {machines.map(machine => (
              <div key={machine.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-medium">{machine.name}</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Зав. №: {machine.serialNumber}</p>
                  <p>Модель: {machine.model}</p>
                  <p>Дата выпуска: {new Date(machine.releaseDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MachinesPage;