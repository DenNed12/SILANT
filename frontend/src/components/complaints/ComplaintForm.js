import React from 'react';

const ComplaintForm = ({ machines, failureNodes, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState({
    machine: '',
    failure_date: '',
    operating_hours: '',
    failure_node: '',
    failure_description: '',
    recovery_method: '',
    spare_parts: '',
    recovery_date: '',
    service_company: ''
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
      <h2 className="text-xl font-bold mb-4">Добавить рекламацию</h2>
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
            <label className="block mb-1">Дата отказа</label>
            <input
              type="date"
              name="failure_date"
              value={formData.failure_date}
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
            <label className="block mb-1">Узел отказа</label>
            <select
              name="failure_node"
              value={formData.failure_node}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Выберите узел отказа</option>
              {failureNodes.map(node => (
                <option key={node.id} value={node.id}>{node.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Описание отказа</label>
          <textarea
            name="failure_description"
            value={formData.failure_description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label className="block mb-1">Способ восстановления</label>
            <select
              name="recovery_method"
              value={formData.recovery_method}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Выберите способ</option>
              <option value="repair">Ремонт</option>
              <option value="replacement">Замена узла</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block mb-1">Используемые запасные части</label>
            <input
              type="text"
              name="spare_parts"
              value={formData.spare_parts}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="form-group">
            <label className="block mb-1">Дата восстановления</label>
            <input
              type="date"
              name="recovery_date"
              value={formData.recovery_date}
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

export default ComplaintForm;