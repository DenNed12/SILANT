import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MaintenanceForm({ machines, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    machine: '',
    maintenance_type: '',
    maintenance_date: new Date(),
    operating_hours: '',
    work_order: '',
    work_order_date: new Date(),
    maintenance_company: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4">Добавить ТО</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Машина</label>
            <select
              name="machine"
              value={formData.machine}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Выберите машину</option>
              {machines.map(machine => (
                <option key={machine.id} value={machine.id}>
                  {machine.machine_serial} ({machine.machine_model.title})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Тип ТО</label>
            <select
              name="maintenance_type"
              value={formData.maintenance_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Выберите тип</option>
              <option value="TO1">ТО-1</option>
              <option value="TO2">ТО-2</option>
              <option value="TO3">ТО-3</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Дата ТО</label>
            <DatePicker
              selected={formData.maintenance_date}
              onChange={(date) => setFormData({...formData, maintenance_date: date})}
              className="w-full p-2 border rounded"
              dateFormat="dd.MM.yyyy"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Наработка (м/час)</label>
            <input
              type="number"
              name="operating_hours"
              value={formData.operating_hours}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}

export default function MachineForm() { ... }