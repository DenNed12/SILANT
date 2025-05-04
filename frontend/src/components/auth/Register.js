import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const { error, status } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className="auth-form">
      <h2>Регистрация аккаунта</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p>Уже есть аккаунт? <a href="/login">Войдите</a></p>
    </div>
  );
};

export default Register;