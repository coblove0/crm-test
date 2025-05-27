import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, useMediaQuery, useTheme } from '@mui/material';
import { Client } from '../types';

interface ClientFormProps {
  initialValues: Omit<Client, 'id'>;
  onSubmit: (values: Omit<Client, 'id'>) => void;
  onCancel: () => void;
}

const ClientSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Слишком короткое имя')
    .matches(/^[A-Za-zА-Яа-яЁё\s]+$/, 'Имя может содержать только буквы и пробелы')
    .required('Обязательно'),
  email: Yup.string().email('Неверный email').required('Обязательно'),
  phone: Yup.string()
    .min(11, 'Телефон должен содержать минимум 11 символов')
    .matches(
      /^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
      'Введите корректный номер телефона'
    )
    .required('Обязательно'),
});

const ClientForm: React.FC<ClientFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ClientSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ values, errors, touched, handleChange, isSubmitting }) => (
        <Form autoComplete="new-password">
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            minWidth={isMobile ? 'auto' : 300}
            width={isMobile ? '100%' : 400}
            px={isMobile ? 0 : 2}
            paddingTop= '5px'
          >
            <TextField
              hiddenLabel
              label="Имя"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={Boolean(errors.name && touched.name)}
              helperText={touched.name && errors.name}
              fullWidth
              size="small"
            />
            <TextField
              hiddenLabel
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={Boolean(errors.email && touched.email)}
              helperText={touched.email && errors.email}
              fullWidth
              size="small"
            />
            <TextField
              hiddenLabel
              label="Телефон"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              error={Boolean(errors.phone && touched.phone)}
              helperText={touched.phone && errors.phone}
              fullWidth
              size="small"
            />
            <Box
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              justifyContent="flex-end"
              gap={1}
              mt={2}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                fullWidth={isMobile}
              >
                Сохранить
              </Button>
              <Button
                onClick={onCancel}
                disabled={isSubmitting}
                fullWidth={isMobile}
              >
                Отмена
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ClientForm;