import React from 'react';

const MaintenanceForm = ({ machines, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState({
    machine: '',
    maintenance_type: '',
    maintenance_date: '',
    operating_hours: '',
    work_order: '',
    work_order_date: '',
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Добавить ТО</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label className="block mb-1">Машина</label>
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
                  {machine.machine_serial} - {machine.machine_model?.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="block mb-1">Вид ТО</label>
            <select
              name="maintenance_type"
              value={formData.maintenance_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Выберите вид ТО</option>
              <option value="TO1">ТО-1</option>
              <option value="TO2">ТО-2</option>
              <option value="TO3">ТО-3</option>
              <option value="STO">Сезонное ТО</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block mb-1">Дата проведения ТО</label>
            <input
              type="date"
              name="maintenance_date"
              value={formData.maintenance_date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="form-group">
            <label className="block mb-1">Наработка, м/час</label>
            <input
              type="number"
              name="operating_hours"
              value={formData.operating_hours}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="form-group">
            <label className="block mb-1">№ заказ-наряда</label>
            <input
              type="text"
              name="work_order"
              value={formData.work_order}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="form-group">
            <label className="block mb-1">Дата заказ-наряда</label>
            <input
              type="date"
              name="work_order_date"
              value={formData.work_order_date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="form-group">
            <label className="block mb-1">Сервисная компания</label>
            <input
              type="text"
              name="maintenance_company"
              value={formData.maintenance_company}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;