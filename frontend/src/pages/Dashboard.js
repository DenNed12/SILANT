import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Card, Statistic, Row, Col, Button, Tag } from 'antd';
import { ToolOutlined, WarningOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const machines = useSelector(state => state.machines?.list || []);
  const maintenances = useSelector(state => state.maintenances?.recent || []);
  const complaints = useSelector(state => state.complaints?.recent || []);

  const columns = [
    {
      title: 'Заводской номер',
      dataIndex: 'machine_serial',
      key: 'machine_serial',
      render: (text, record) => (
        <Link to={`/machines/${record.id}`}>{text}</Link>
      ),
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
      title: 'Сервисная компания',
      dataIndex: ['service_company', 'name'],
      key: 'service_company',
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_, record) => {
        const hasComplaints = complaints.some(c => c.machine === record.id);
        const lastMaintenance = maintenances
          .filter(m => m.machine === record.id)
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

        return (
          <div className="flex gap-2">
            {hasComplaints && <Tag color="red">Есть рекламации</Tag>}
            {lastMaintenance && (
              <Tag color="green">
                Последнее ТО: {new Date(lastMaintenance.date).toLocaleDateString()}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small">
            <Link to={`/maintenance?machine=${record.id}`}>
              <ToolOutlined /> ТО
            </Link>
          </Button>
          <Button size="small">
            <Link to={`/complaints?machine=${record.id}`}>
              <WarningOutlined /> Рекламации
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/logo-silant.png"
            alt="СИЛАНТ"
            className="h-12 mr-4"
          />
          <h1 className="text-xl font-bold">Электронная сервисная книга Мой Силант</h1>
        </div>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user.name}</span>
              <Button type="text">Выйти</Button>
            </div>
          ) : (
            <>
              <Button type="text">
                <Link to="/login">Войти</Link>
              </Button>
              <Button type="primary">
                <Link to="/register">Зарегистрироваться</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Основной контент */}
      <main className="container mx-auto py-6 px-4">
        {/* Информация об организации/клиенте */}
        {isAuthenticated && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              {user.role === 'CLIENT' ? 'Клиент' : 'Организация'}: {user.name}
            </h2>
            <p>Email: {user.email}</p>
            {user.role === 'SERVICE' && <p>Сервисная компания: {user.service_company_name}</p>}
          </Card>
        )}

        {/* Статистика */}
        <Row gutter={16} className="mb-6">
          <Col span={8}>
            <Card>
              <Statistic
                title="Всего машин"
                value={machines.length}
                prefix="🚜"
              />
              <Button type="link" block>
                <Link to="/machines">Перейти к списку</Link>
              </Button>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Последние ТО"
                value={maintenances.length}
                prefix={<ToolOutlined />}
              />
              <Button type="link" block>
                <Link to="/maintenance">Перейти к техосмотрам</Link>
              </Button>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Активные рекламации"
                value={complaints.length}
                prefix={<WarningOutlined />}
              />
              <Button type="link" block>
                <Link to="/complaints">Перейти к рекламациям</Link>
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Таблица с машинами */}
        <Card
          title="Список техники"
          extra={<Link to="/machines">Посмотреть все</Link>}
          className="mb-6"
        >
          <Table
            columns={columns}
            dataSource={machines.slice(0, 5)} // Показываем только 5 последних
            rowKey="id"
            pagination={false}
            size="middle"
          />
        </Card>

        {/* Технические характеристики */}
        <Card title="Технические характеристики" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Основные параметры</h3>
              <ul className="space-y-1">
                <li>• Модель техники: {machines[0]?.machine_model?.title || '-'}</li>
                <li>• Модель двигателя: {machines[0]?.engine_model?.title || '-'}</li>
                <li>• Модель трансмиссии: {machines[0]?.transmission_model?.title || '-'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Дополнительные параметры</h3>
              <ul className="space-y-1">
                <li>• Модель ведущего моста: {machines[0]?.drive_axle_model?.title || '-'}</li>
                <li>• Модель управляемого моста: {machines[0]?.steering_axle_model?.title || '-'}</li>
                <li>• Комплектация: {machines[0]?.equipment || '-'}</li>
              </ul>
            </div>
          </div>
        </Card>
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

export default Dashboard;