import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientForm from '../components/ClientForm';

describe('ClientForm', () => {
  const initialValues = { name: '', email: '', phone: '' };
  const onSubmit = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    onSubmit.mockClear();
    onCancel.mockClear();
  });

  it('Рендерим все поля и кнопки.', () => {
    render(<ClientForm initialValues={initialValues} onSubmit={onSubmit} onCancel={onCancel} />);
    expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/телефон/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /отмена/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /сохранить/i })).toBeInTheDocument();
  });

  it('Показываем ошибки валидации  при пустых полях.', async () => {
    render(<ClientForm initialValues={initialValues} onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));
    expect(await screen.findAllByText(/обязательно/i)).toHaveLength(3);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('Показываем ошибки валидации при неправильном имени.', async () => {
    render(<ClientForm initialValues={initialValues} onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.change(screen.getByLabelText(/имя/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));
    expect(await screen.findByText(/имя может содержать только буквы и пробелы/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('Показываем ошибки валидации при коротком телефоне.', async () => {
    render(<ClientForm initialValues={initialValues} onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.change(screen.getByLabelText(/телефон/i), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));
    expect(await screen.findByText(/телефон должен содержать минимум 11 символов/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('Показываем ошибки валидации при неверном формате телефона.', async () => {
    render(<ClientForm initialValues={initialValues} onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.change(screen.getByLabelText(/телефон/i), { target: { value: '12345678901' } });
    fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));
    expect(await screen.findByText(/введите корректный номер телефона/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('Вызываем событие onSubmit при корректных значениях.', async () => {
    render(<ClientForm initialValues={initialValues} onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.change(screen.getByLabelText(/имя/i), { target: { value: 'Иван Иванов' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ivan@mail.com' } });
    fireEvent.change(screen.getByLabelText(/телефон/i), { target: { value: '+7 999 123-45-67' } });
    fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({
      name: 'Иван Иванов',
      email: 'ivan@mail.com',
      phone: '+7 999 123-45-67',
    }));
  });

  it('Вызываем событие onCancel при отмене.', () => {
    render(<ClientForm initialValues={initialValues} onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /отмена/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});