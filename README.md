# PLP Study Plan Generator

An interactive MERN stack application for generating and managing personalized study plans.

## 🚀 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Cookie-based Auth** - Secure session management
- **Google GenAI** - AI-powered plan generation
- **Nodemailer** - Email notifications
- **Express Validator** - Request validation

### Frontend
- **React** - UI library
- **Vite** - Build tool and development server
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **TailwindCSS** - Styling
- **React Toastify** - Toast notifications
- **Context API** - State management

## 📁 Project Structure

```
plp_final_project_MERN/
├── backend/                   # Backend server
│   ├── controllers/          # Request handlers
│   ├── cron-jobs/           # Scheduled tasks
│   ├── lib/                 # Utility libraries
│   ├── middleware/          # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   ├── db.js              # Database configuration
│   ├── server.js          # Express app setup
│   └── package.json       # Backend dependencies
│
└── my-app/                # Frontend React application
    ├── public/           # Static files
    ├── src/
    │   ├── assets/      # Images, fonts, etc.
    │   ├── Components/  # Reusable components
    │   ├── context/     # React Context providers
    │   ├── pages/       # Page components
    │   │   ├── admin/  # Admin dashboard
    │   │   └── user/   # User dashboard
    │   ├── App.jsx     # Root component
    │   └── main.jsx    # Entry point
    ├── index.html
    └── package.json    # Frontend dependencies
```

**Project images**
for now eail otp is disabled
(home page)
[Home page](./images/home.png)

(Register page)
[Register page](./images/register.png)

(Login page)
[Login page](./images/login.png)

(User Dashboard page)
[User Dashboard page](./images/dashboard.png)


# VISIST LIVE SITE HERE

[Visit live site](https://ai-study-planner-buddy.netlify.app)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Google Cloud API key (for AI features)

### Environment Variables

#### Backend (.env)
``` bash
DB_NAME=my_study_budy_ai
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
ORIGIN_URI=http://localhost:5173
JWT_SECRET=your_secret_code
PAYSTACK_SECRET_KEY=sk_live_key(paystack)
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/VictorOduorKe/plp_final_project_MERN.git
cd plp_final_project_MERN
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../my-app
npm install
```

4. Start the backend server
```bash
cd backend
npm run dev
```


5. Start the frontend development server
```bash
cd my-app
npm run dev
```
**Create a .env in frontend(my-app) with these**
```bash
VITE_API_URL=http://localhost:3000
VITE_NODE_ENV=development
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🌟 Features

- **User Authentication**
  - JWT and Cookie-based auth
  - Email verification
  - Password recovery

- **Study Plan Management**
  - AI-generated study plans
  - Weekly and daily task tracking
  - Progress monitoring

- **Quiz System**
  - Practice questions
  - Performance tracking
  - Score analytics

- **Admin Dashboard**
  - User management
  - Payment analytics
  - Content moderation

- **Payment Integration**
  - Premium plan subscriptions
  - Payment history
  - Subscription management

## 🔒 Security Features

- HTTP-only cookies for JWT storage
- CORS configuration
- Request validation
- Protected routes
- Rate limiting
- Input sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -am 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Create Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

- Victor Oduor
- GitHub: [@VictorOduorKe](https://github.com/VictorOduorKe)
