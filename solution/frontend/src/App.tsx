import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button, TextField, Grid } from '@mui/material';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
}

const API_URL = 'http://localhost:3001/dev/contacts';

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [formData, setFormData] = useState<Omit<Contact, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    age: 0
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setContacts(data);
  };

  const validateForm = () => {
    Object.keys(formData).forEach(field => validateField(field, formData[field as keyof typeof formData]));
    return Object.keys(errors).length === 0;
  };

  const validateField = (field: string, value: string | number) => {
    const newErrors = { ...errors };
    delete newErrors[field];

    switch (field) {
      case 'firstName':
        if (!value.toString().trim()) {
          newErrors.firstName = 'First name is required';
        } else if (value.toString().length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        }
        break;
      case 'lastName':
        if (!value.toString().trim()) {
          newErrors.lastName = 'Last name is required';
        } else if (value.toString().length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
        }
        break;
      case 'email':
        if (!value.toString().trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString())) {
          newErrors.email = 'Invalid email format';
        }
        break;
      case 'phoneNumber':
        if (!value.toString().trim()) {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(value.toString())) {
          newErrors.phoneNumber = 'Invalid phone number format';
        }
        break;
      case 'age':
        const age = Number(value);
        if (age < 1) {
          newErrors.age = 'Age must be at least 1';
        } else if (age >= 130) {
          newErrors.age = 'Are you trying to break social security? You have been reported to Elon\'s Doge.';
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    }
    setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', age: 0 });
    setEditingId(null);
    fetchContacts();
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchContacts();
  };

  const handleEdit = (contact: Contact) => {
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      age: contact.age
    });
    setEditingId(contact.id);
  };

  return (
    <Container>
      <Typography variant="h3" style={{ margin: '20px 0' }}>Contact Manager</Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value });
                validateField('firstName', e.target.value);
              }}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => {
                setFormData({ ...formData, lastName: e.target.value });
                validateField('lastName', e.target.value);
              }}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                validateField('email', e.target.value);
              }}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => {
                setFormData({ ...formData, phoneNumber: e.target.value });
                validateField('phoneNumber', e.target.value);
              }}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => {
                const age = parseInt(e.target.value);
                setFormData({ ...formData, age });
                validateField('age', age);
              }}
              error={!!errors.age}
              helperText={errors.age}
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