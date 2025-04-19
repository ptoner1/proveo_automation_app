import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDb } from './db';
import * as yup from 'yup';

interface Contact {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
}

const contactSchema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  phoneNumber: yup.string().required('Phone number is required').matches(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format'),
  age: yup.number().required('Age is required').min(1, 'Age must be at least 1').max(130, 'Age must be less than 130')
});

export const getContacts = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const db = await getDb();
  const contacts = await db.all('SELECT * FROM contacts');
  return {
    statusCode: 200,
    body: JSON.stringify(contacts)
  };
};

export const createContact = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const db = await getDb();
    const rawContact = JSON.parse(event.body || '{}');
    const contact: Contact = {
      firstName: String(rawContact.firstName),
      lastName: String(rawContact.lastName),
      email: String(rawContact.email),
      phoneNumber: String(rawContact.phoneNumber),
      age: Number(rawContact.age)
    };
    
    await contactSchema.validate(contact);
    
    const result = await db.run(
      'INSERT INTO contacts (firstName, lastName, email, phoneNumber, age) VALUES (?, ?, ?, ?, ?)',
      [contact.firstName, contact.lastName, contact.email, contact.phoneNumber, contact.age]
    );
    return {
      statusCode: 201,
      body: JSON.stringify({ id: result.lastID, ...contact })
    };
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message })
      };
    }
    throw error;
  }
};

export const updateContact = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const db = await getDb();
    const id = event.pathParameters?.id;
    const rawContact = JSON.parse(event.body || '{}');
    const contact: Contact = {
      firstName: String(rawContact.firstName),
      lastName: String(rawContact.lastName),
      email: String(rawContact.email),
      phoneNumber: String(rawContact.phoneNumber),
      age: Number(rawContact.age)
    };
    
    await contactSchema.validate(contact);
    
    await db.run(
      'UPDATE contacts SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, age = ? WHERE id = ?',
      [contact.firstName, contact.lastName, contact.email, contact.phoneNumber, contact.age, id]
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ id, ...contact })
    };
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message })
      };
    }
    throw error;
  }
};

export const deleteContact = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const db = await getDb();
  const id = event.pathParameters?.id;
  await db.run('DELETE FROM contacts WHERE id = ?', [id]);
  return {
    statusCode: 204,
    body: ''
  };
}; 