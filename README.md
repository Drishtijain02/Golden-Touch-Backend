# 🛠️ Golden Touch Backend

Backend API for the **Golden Touch Beauty Salon & Parlour** website.

# Website link-https://golden-touch-frontend.vercel.app/

This backend powers the salon's appointment booking system, owner dashboard, authentication, database operations and email notifications.

The backend is built using **Node.js + Express.js**, with **Supabase** as the database and authentication layer and **Resend** for transactional email notifications.

---

## 🌸 About the Project

The Golden Touch backend was developed as part of a real-world salon website project.

It provides the APIs required for:

* 📅 Creating and managing appointments
* 👤 Managing customer information
* 🔐 Owner authentication
* 📊 Owner dashboard data
* 📧 Sending appointment notifications
* 🔄 Updating appointment status
* ❌ Deleting appointments
* 🔎 Filtering appointments

The backend communicates with the frontend through REST APIs.

---

## 🏗️ Architecture

```text
                 ┌─────────────────────┐
                 │   Golden Touch      │
                 │      Frontend       │
                 └──────────┬──────────┘
                            │
                            │ REST API
                            ▼
                 ┌─────────────────────┐
                 │   Express.js API    │
                 │      Backend        │
                 └──────┬───────┬──────┘
                        │       │
              ┌─────────┘       └──────────┐
              ▼                            ▼
      ┌───────────────┐             ┌───────────────┐
      │   Supabase    │             │    Resend     │
      │   PostgreSQL  │             │ Email Service │
      └───────────────┘             └───────────────┘
              │                            │
              ▼                            ▼
       Appointment Data              Owner Email
       Admin Profiles
```

---

## 🚀 Features

### 📅 Appointment API

The backend provides APIs for the complete appointment lifecycle.

Customers can submit:

* Name
* Phone number
* Email
* Service
* Preferred date
* Preferred time
* Special requests

Each appointment is assigned a booking ID and initially receives the status:

```text
Pending
```

---

### 🔄 Appointment Status Management

Appointments can move through the following workflow:

```text
Pending
   ↓
Confirmed
   ↓
Completed
```

Appointments can also be:

```text
Cancelled
```

The backend validates status changes and prevents invalid status values.

Supported statuses:

```text
Pending
Confirmed
Completed
Cancelled
```

---

## 📡 API Endpoints

### Get All Appointments

```http
GET /appointments
```

Returns appointments ordered by newest first.

Optional filters:

```http
GET /appointments?status=Pending
```

```http
GET /appointments?date=2026-08-12
```

---

### Create Appointment

```http
POST /appointments
```

Example request:

```json
{
  "id": "GT-1001",
  "name": "John Doe",
  "phone": "+919876543210",
  "email": "john@example.com",
  "service": "Haircut",
  "date": "2026-08-15",
  "time": "15:30",
  "msg": "Prefer a senior stylist"
}
```

The appointment is stored in Supabase with:

```text
status = Pending
```

After successful creation, the API returns the booking ID and confirmation message.

---

### Update Appointment Status

```http
PUT /appointments/:id
```

Example:

```json
{
  "status": "Confirmed"
}
```

Supported values:

```text
Pending
Confirmed
Completed
Cancelled
```

---

### Delete Appointment

```http
DELETE /appointments/:id
```

Deletes the appointment associated with the booking ID.

---

## 📧 Email Notification System

The backend integrates with **Resend** to notify the salon owner whenever a new appointment is created.

### Flow

```text
Customer submits appointment
          ↓
Express API
          ↓
Validate appointment
          ↓
Save appointment to Supabase
          ↓
Send email using Resend
          ↓
Owner receives booking details
```

The email contains information such as:

* Booking ID
* Customer name
* Phone number
* Customer email
* Service
* Preferred date
* Preferred time
* Special requests

The owner can then open the dashboard and manage the appointment.

---

## 🔐 Authentication

The backend uses **Supabase Authentication** for owner login.

The login process is:

```text
Owner enters email + password
              ↓
      Supabase Auth
              ↓
       User authenticated
              ↓
     Admin profile fetched
              ↓
       Dashboard access
```

The backend also maintains an `admin_users` table for additional profile information such as:

* User ID
* Full name
* Email
* Role

Example roles:

```text
owner
```

---

## 🗄️ Database

The project uses **Supabase PostgreSQL**.

### Appointments

The appointments table stores information including:

```text
id
booking_id
customer_name
phone
email
service
preferred_date
preferred_time
message
status
created_at
```

### Admin Users

The admin profile system stores information such as:

```text
id
full_name
email
role
password_hash
```

Supabase Auth is used for authentication while the application database stores the associated admin profile.

---

## 🧩 Backend Structure

```text
backend/
│
├── config/
│   ├── supabase.js
│   └── supabaseAuth.js
│
├── middleware/
│   └── validation.js
│
├── routes/
│   ├── appointments.js
│   ├── auth.js
│   └── ...
│
├── services/
│   └── emailService.js
│
├── server.js
│
├── package.json
├── package-lock.json
└── README.md
```

---

## 🛠️ Tech Stack

| Technology                   | Purpose                              |
| ---------------------------- | ------------------------------------ |
| Node.js                      | Backend runtime                      |
| Express.js                   | REST API framework                   |
| Supabase                     | PostgreSQL database & authentication |
| Resend                       | Transactional email                  |
| JavaScript                   | Backend development                  |
| Vercel / Deployment Platform | Backend deployment                   |

---

## 🔒 Environment Variables

Create a `.env` file locally:

```env
PORT=5000

SUPABASE_URL=your_supabase_url

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

SUPABASE_AUTH_URL=your_supabase_auth_url

RESEND_API_KEY=your_resend_api_key

OWNER_EMAIL=owner@example.com
```

⚠️ **Never commit `.env` or secret API keys to GitHub.**

Add this to `.gitignore`:

```text
.env
node_modules/
```

---

## ▶️ Running Locally

### 1. Clone the repository

```bash
git clone <your-backend-repository-url>
```

### 2. Enter the project

```bash
cd golden-touch-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create environment variables

Create:

```text
.env
```

and add the required credentials.

### 5. Start the server

For development:

```bash
npm run dev
```

Or:

```bash
node server.js
```

The API will run on the configured port.

---

## 🔄 Complete Booking Flow

```text
                    CUSTOMER
                       │
                       ▼
              Appointment Form
                       │
                       ▼
                POST /appointments
                       │
                       ▼
              Express.js Backend
                       │
              ┌────────┴────────┐
              ▼                 ▼
         Validation          Supabase
                                │
                                ▼
                         Save Appointment
                                │
                                ▼
                           Resend API
                                │
                                ▼
                         Owner Email
                                │
                                ▼
                        Owner Dashboard
                                │
                         ┌──────┴──────┐
                         ▼             ▼
                    Confirmed      Completed
                         │
                         ▼
                   WhatsApp
                  Confirmation
```

---

## 🎯 Design Goals

The backend was designed with the following goals:

* Provide a clean REST API for the frontend
* Keep appointment data centralized
* Automate owner notifications
* Reduce manual appointment management
* Provide secure owner authentication
* Support a simple appointment lifecycle
* Allow the system to be extended with additional salon-management features

---

## 🔮 Future Improvements

Potential future additions include:

* ⏰ Automated appointment reminders
* 📧 Promotional/offer email campaigns
* 📅 Availability and time-slot management
* 💳 Online payment integration
* 📊 Revenue and appointment analytics
* 👥 Customer management
* ⭐ Review management
* 📱 SMS notifications
* 🔔 Real-time dashboard notifications

---

## 👩‍💻 Developer

**Drishti Jain**

Backend developed as part of the **Golden Touch Beauty Salon & Parlour** real-world web application.

The backend is designed to work with the Golden Touch frontend and provide the APIs required for appointment booking, management and owner operations.

---

## 📄 License

This project was developed specifically for **Golden Touch Beauty Salon & Parlour**.

© 2026 Golden Touch Beauty Salon & Parlour
