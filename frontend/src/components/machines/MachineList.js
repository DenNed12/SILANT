import { Link } from 'react-router-dom';

function MachineList({ machines, role }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {machines.map(machine => (
        <div key={machine.id} className="border p-4 rounded-lg">
          <h3 className="font-bold">{machine.machine_serial}</h3>
          <p>Модель: {machine.machine_model.title}</p>
          <Link
            to={`/machines/${machine.id}`}
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            Подробнее
          </Link>
          {role === 'MANAGER' && (
            <button className="ml-2 text-red-500 hover:underline">
              Удалить
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default MachineList;