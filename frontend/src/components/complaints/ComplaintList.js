import React from 'react';
import { Table, Button, Space, Popconfirm, message, Badge } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import dayjs from 'dayjs';

const ComplaintList = ({ complaints, onDelete, role }) => {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/complaints/${id}/`);
      message.success('Рекламация удалена');
      onDelete(id);
    } catch (error) {
      message.error('Ошибка при удалении рекламации');
    }
  };

  const columns = [
    {
      title: 'Дата отказа',
      dataIndex: 'failure_date',
      key: 'date',
      render: (date) => dayjs(date).format('DD.MM.YYYY'),
      sorter: (a, b) => new Date(a.failure_date) - new Date(b.failure_date),
    },
    {
      title: 'Машина',
      dataIndex: ['machine', 'machine_serial'],
      key: 'machine',
      render: (text, record) => (
        <Link to={`/machines/${record.machine?.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Узел отказа',
      dataIndex: ['failure_node', 'title'],
      key: 'failure_node',
    },
    {
      title: 'Наработка',
      dataIndex: 'operating_hours',
      key: 'hours',
      render: (text) => `${text} м/час`,
    },
    {
      title: 'Статус',
      key: 'status',
      render: (_, record) => (
        <Badge
          status={record.resolved ? 'success' : 'error'}
          text={record.resolved ? 'Устранено' : 'Требует ремонта'}
        />
      ),
      filters: [
        { text: 'Устранено', value: true },
        { text: 'Требует ремонта', value: false },
      ],
      onFilter: (value, record) => record.resolved === value,
    },
    {
      title: 'Дата восстановления',
      dataIndex: 'recovery_date',
      key: 'recovery_date',
      render: (date) => (date ? dayjs(date).format('DD.MM.YYYY') : '-'),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/complaints/${record.id}`}>
            <Button icon={<EyeOutlined />} size="small" />
          </Link>

          {role !== 'CLIENT' && (
            <>
              <Link to={`/complaints/edit/${record.id}`}>
                <Button icon={<EditOutlined />} size="small" />
              </Link>

              <Popconfirm
                title="Удалить рекламацию?"
                onConfirm={() => handleDelete(record.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="complaint-list">
      <Table
        columns={columns}
        dataSource={complaints}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
        scroll={{ x: true }}
        bordered
      />
    </div>
  );
};

export default ComplaintList;