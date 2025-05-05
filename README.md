# Swycle: Promoting Sustainable Fashion to Swarthmore Students

## Team Members

Michael Ugwe and Summit Pradhan

## About

- Swycle is a website to promote sustainable fashion for Swarthmore students. It is made up of two main sections:

1. **Forum**: A social platform for students to discuss fashion (ex: fit checks, thrift finds, etc.)
2. **Marketplace**: A marketplace for students to buy and sell secondhand clothing.

Swycle is restricted to Swarthmore students only. Students must log in with their @swarthmore.edu accounts to access the website.

## Tech Stack

- **Frontend**: Typescript, React, Tailwind CSS
  - **Libraries**: React Router (routing), ShadCN UI (styled components), Zod (form validation), Lucide React (icons), Linkify (auto-linking URLs)
- **Backend**: Python, Flask, SQLAlchemy
- **Database**: SQLite
- **Authentication**: Google OAuth
- **Deployment**: Docker, SCCS Servers

## Setup

> [!WARNING]  
> To run this project locally, you will need to have a Google Cloud account and set up a Google OAuth 2.0 client ID. If you don't have one, you can create one by following the instructions [here](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred). Otherwise, you can reach out to us for our credentials.

1. Clone the repository
2. Inside the /frontend directory, create an `.env` file based on the `.env.example` file. Make sure to add the `VITE_GOOGLE_CLIENT_ID` variable with your Google OAuth 2.0 client ID.
3. cd into /frontend. Run `npm install` to install the dependencies.
4. To start the frontend, run `npm run dev` in the /frontend directory.
5. cd into /backend. Run `pip install -r requirements.txt` to install the dependencies.
6. To start the backend, run `python app.py` in the /backend directory.
