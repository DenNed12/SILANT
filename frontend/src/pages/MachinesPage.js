import React from 'react';
import { useSelector } from 'react-redux';

const MachinesPage = () => {
  // Получаем список машин напрямую из хранилища
  const machines = useSelector(state => state.machines?.list || []);

  return (
    <div className="machines-page">
      <h2>Список всей техники</h2>

      {machines.length > 0 ? (
        <div className="machines-grid">
          {machines.map(machine => (
            <div key={machine.id} className="machine-card">
              <h3>{machine.name}</h3>
              <div className="machine-details">
                <p>Заводской номер: {machine.serialNumber}</p>
                <p>Модель: {machine.model}</p>
                <p>Дата выпуска: {new Date(machine.releaseDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-machines">
          На данный момент в системе нет зарегистрированной техники
        </div>
      )}
    </div>
  );
};

export default MachinesPage;