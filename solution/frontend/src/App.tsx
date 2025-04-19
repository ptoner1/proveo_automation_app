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

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setContacts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
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