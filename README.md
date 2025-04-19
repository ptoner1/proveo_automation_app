# Contact Manager Application

A full-stack TypeScript application for managing contacts.

### Backend Setup ```Bash
   cd backend
   npm install
   npm start

### Frontend Setup ```Bash
   cd frontend
   npm install
   npm start


If the backend server is throwing errors that look like this:

      × Unhandled exception in handler 'getContacts'.
      × [Error: SQLITE_CORRUPT: database disk image is malformed]
      × SQLITE_CORRUPT: database disk image is malformed

   You need to delete backend/contacts.db file
   It will be recreated when you run npm start

The application will be available at http://localhost:3000