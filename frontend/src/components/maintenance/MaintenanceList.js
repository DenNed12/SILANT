import React from 'react';
import { Link } from 'react-router-dom';

const MaintenanceList = ({ maintenances, canEdit }) => {
  if (!maintenances || maintenances.length === 0) {
    return <div className="text-gray-500 text-center py-4">Нет данных о техническом обслуживании</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Машина</th>
            <th className="py-2 px-4 border-b">Вид ТО</th>
            <th className="py-2 px-4 border-b">Дата проведения</th>
            <th className="py-2 px-4 border-b">Наработка (м/ч)</th>
            {canEdit && <th className="py-2 px-4 border-b">Действия</th>}
          </tr>
        </thead>
        <tbody>
          {maintenances.map((maintenance) => (
            <tr key={maintenance.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-center">
                {maintenance.machine?.machine_serial || 'Не указана'}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {maintenance.maintenance_type || 'Не указан'}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {new Date(maintenance.maintenance_date).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {maintenance.operating_hours || 'Не указана'}
              </td>
              {canEdit && (
                <td className="py-2 px-4 border-b text-center">
                  <Link
                    to={`/maintenance/edit/${maintenance.id}`}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={() => console.log('Delete', maintenance.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Удалить
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceList;