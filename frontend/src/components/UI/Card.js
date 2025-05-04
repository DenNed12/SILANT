import React from 'react';
import { Link } from 'react-router-dom'; // Добавьте этот импорт

export function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

export function StatCard({ title, value, icon, link }) {
  return (
    <Link // Теперь Link определён
      to={link}
      className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow block"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </Link>
  );
}