import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Table } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const MachinesPage = () => {

  const machines = useSelector(state => state.machines?.list || []);

  const columns = [
    {
      title: 'Заводской номер',
      dataIndex: 'machine_serial',
      key: 'machine_serial',
      render: (text) => <Link to={`/machines/${text}`}>{text}</Link>,
    },
    {
      title: 'Модель техники',
      dataIndex: ['machine_model', 'title'],
      key: 'machine_model',
    },
    {
      title: 'Клиент',
      dataIndex: ['client', 'name'],
      key: 'client',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small">
            <Link to={`/maintenance?machine=${record.id}`}>ТО</Link>
          </Button>
          <Button size="small">
            <Link to={`/complaints?machine=${record.id}`}>Рекламации</Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/logo-silant-small.png"
              alt="Мой Силант"
              className="h-10 mr-4"
            />
            <h1 className="text-xl font-bold">Список техники</h1>
          </Link>
        </div>
        <Button type="text" icon={<HomeOutlined />}>
          <Link to="/">На главную</Link>
        </Button>
      </header>

      {/* Основное содержимое */}
      <main className="container mx-auto p-4 flex-grow">
        <Table
          columns={columns}
          dataSource={machines}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-6 mt-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src="/logo-silant-small.png"
              alt="Мой Силант"
              className="h-8 mr-2"
            />
            <span>Мой Силант © 2025</span>
          </div>
          <div className="text-center md:text-right">
            <p>Контактные данные:</p>
            <p>Телефон: +7 (800) 123-45-67</p>
            <p>Email: support@silant.ru</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MachinesPage;