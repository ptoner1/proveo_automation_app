import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDb } from './db';

interface Contact {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
}

export const getContacts = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const db = await getDb();
  const contacts = await db.all('SELECT * FROM contacts');
  return {
    statusCode: 200,
    body: JSON.stringify(contacts)
  };
};

export const createContact = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const db = await getDb();
  const contact: Contact = JSON.parse(event.body || '{}');
  const result = await db.run(
    'INSERT INTO contacts (firstName, lastName, email, phoneNumber, age) VALUES (?, ?, ?, ?, ?)',
    [contact.firstName, contact.lastName, contact.email, contact.phoneNumber, contact.age]
  );
  return {
    statusCode: 201,
    body: JSON.stringify({ id: result.lastID, ...contact })
  };
};

export const updateContact = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const db = await getDb();
  const id = event.pathParameters?.id;
  const contact: Contact = JSON.parse(event.body || '{}');
  await db.run(
    'UPDATE contacts SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, age = ? WHERE id = ?',
    [contact.firstName, contact.lastName, contact.email, contact.phoneNumber, contact.age, id]
  );
  return {
    statusCode: 200,
    body: JSON.stringify({ id, ...contact })
  };
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