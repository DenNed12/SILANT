import React from 'react';
import { useSelector } from 'react-redux';

const CatalogPage = () => {
  // Добавляем проверку на существование данных
  const { isAuthenticated } = useSelector(state => state.auth);
  const machines = useSelector(state => state.machines?.list || []);

  return (
    <div className="catalog-page">
      <h1>Каталог техники</h1>

      {machines.length === 0 ? (
        <div className="no-machines">Техника не найдена</div>
      ) : (
        <div className="machines-grid">
          {machines.map(machine => (
            <div key={machine.id} className="machine-card">
              <h3>{machine.name}</h3>
              <p>Модель: {machine.model}</p>
              <p>Год выпуска: {machine.year}</p>
              {isAuthenticated && (
                <button className="details-button">Подробнее</button>
              )}
            </div>
          ))}
        </div>
      )}

      {isAuthenticated ? (
        <div className="auth-message">
          Вы вошли как авторизованный пользователь
        </div>
      ) : (
        <div className="auth-message">
          Для доступа к дополнительным функциям войдите в систему
        </div>
      )}
    </div>
  );
};

export default CatalogPage;