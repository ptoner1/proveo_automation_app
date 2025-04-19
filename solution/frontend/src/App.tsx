import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button, TextField, Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
}

const API_URL = 'http://localhost:3001/dev/contacts';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  phoneNumber: yup.string().required('Phone number is required').matches(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format'),
  age: yup.number().required('Age is required').min(1, 'Age must be at least 1').max(130, 'Are you trying to break social security? You have been reported to Elon\'s Doge.')
});

type FormData = yup.InferType<typeof schema>;

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      age: 0
    }
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setContacts(data);
  };

  const onSubmit = async (data: FormData) => {
    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    reset();
    setEditingId(null);
    fetchContacts();
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchContacts();
  };

  const handleEdit = (contact: Contact) => {
    Object.entries(contact).forEach(([key, value]) => {
      if (key !== 'id') {
        setValue(key as keyof FormData, value);
      }
    });
    setEditingId(contact.id);
  };

  return (
    <Container>
      <Typography variant="h3" style={{ margin: '20px 0' }}>Contact Manager</Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="First Name"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Last Name"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Email"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="age"
              control={control}
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editingId ? 'Update Contact' : 'Add Contact'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <div style={{ marginTop: '20px' }}>
        {contacts.map((contact) => (
          <Card key={contact.id} style={{ marginBottom: '10px' }}>
            <CardContent>
              <Typography variant="h6">{contact.firstName} {contact.lastName}</Typography>
              <Typography>Email: {contact.email}</Typography>
              <Typography>Phone: {contact.phoneNumber}</Typography>
              <Typography>Age: {contact.age}</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(contact.id)}
                style={{ marginRight: '10px' }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEdit(contact)}
              >
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default App; 