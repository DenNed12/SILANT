import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ComplaintForm({ machines, failureNodes, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    machine: '',
    failure_date: new Date(),
    operating_hours: '',
    failure_node: '',
    failure_description: '',
    recovery_method: '',
    spare_parts: '',
    recovery_date: new Date()
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
      <h2 className="text-xl font-bold mb-4">Новая рекламация</h2>
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
                  {machine.machine_serial}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Узел отказа</label>
            <select
              name="failure_node"
              value={formData.failure_node}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Выберите узел</option>
              {failureNodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Дата отказа</label>
            <DatePicker
              selected={formData.failure_date}
              onChange={(date) => setFormData({...formData, failure_date: date})}
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

          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1">Описание отказа</label>
            <textarea
              name="failure_description"
              value={formData.failure_description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Способ восстановления</label>
            <select
              name="recovery_method"
              value={formData.recovery_method}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Выберите способ</option>
              <option value="REPAIR">Ремонт</option>
              <option value="REPLACE">Замена узла</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Используемые запчасти</label>
            <input
              type="text"
              name="spare_parts"
              value={formData.spare_parts}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Дата восстановления</label>
            <DatePicker
              selected={formData.recovery_date}
              onChange={(date) => setFormData({...formData, recovery_date: date})}
              className="w-full p-2 border rounded"
              dateFormat="dd.MM.yyyy"
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

export default function ComplaintForm() { ... }