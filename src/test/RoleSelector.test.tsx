import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RoleSelector from '../components/RoleSelector';
import { renderWithProvider } from '../store/testStore'; // Используем тестовый store

describe('RoleSelector', () => {
  it('по умолчанию отображает кнопку "Войти"', () => {
    renderWithProvider(<RoleSelector />);
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });

  it('открывает диалог логина по кнопке "Войти"', () => {
    renderWithProvider(<RoleSelector />);
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));
    expect(screen.getByText(/вход/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/логин/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
  });

  it('показывает ошибку при неверном логине/пароле', async () => {
    renderWithProvider(<RoleSelector />);
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));
    fireEvent.change(screen.getByLabelText(/логин/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText(/пароль/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));
    expect(await screen.findByText(/неверный логин или пароль/i)).toBeInTheDocument();
  });

  it('логинит пользователя с правильными данными', async () => {
    renderWithProvider(<RoleSelector />);
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));
    fireEvent.change(screen.getByLabelText(/логин/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText(/пароль/i), { target: { value: 'userpass' } });
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));
    await waitFor(() =>
      expect(screen.queryByText(/вход/i)).not.toBeInTheDocument()
    );
    expect(screen.getByText(/вы вошли в систему/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /выйти/i })).toBeInTheDocument();
  });

  it('логинит администратора с правильными данными', async () => {
    renderWithProvider(<RoleSelector />);
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));
    fireEvent.change(screen.getByLabelText(/логин/i), { target: { value: 'admin1' } });
    fireEvent.change(screen.getByLabelText(/пароль/i), { target: { value: 'adminpass' } });
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));
    await waitFor(() =>
      expect(screen.queryByText(/вход/i)).not.toBeInTheDocument()
    );
    expect(screen.getByText(/вы вошли в систему/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /выйти/i })).toBeInTheDocument();
  });

  it('выход возвращает к кнопке "Войти"', async () => {
    renderWithProvider(<RoleSelector />);
    // Логинимся
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));
    fireEvent.change(screen.getByLabelText(/логин/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText(/пароль/i), { target: { value: 'userpass' } });
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));
    await waitFor(() =>
      expect(screen.queryByText(/вход/i)).not.toBeInTheDocument()
    );
    // Выходим
    fireEvent.click(screen.getByRole('button', { name: /выйти/i }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument()
    );
  });
});