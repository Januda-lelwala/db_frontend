# KandyPack Frontend - Clean Structure

A clean, organized React frontend extracted from the original messy codebase.

## 📁 Project Structure

```
frontend-clean/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Buttons, inputs, cards, etc.
│   │   ├── layout/         # Header, footer, navigation
│   │   └── forms/          # Form components
│   ├── pages/              # Page components organized by feature
│   │   ├── Auth/           # Login, register, forgot password
│   │   ├── Customer/       # Customer portal pages
│   │   ├── Products/       # Product listing, details
│   │   └── Home/           # Landing page
│   ├── context/            # React Context providers
│   │   ├── AuthContext.js
│   │   └── StoreContext.js
│   ├── services/           # API service layer
│   │   ├── api.js          # Main API configuration
│   │   └── auth.service.js # Authentication API calls
│   ├── utils/              # Utility functions
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── styles/             # Global styles
│   ├── config/             # App configuration
│   │   └── constants.js
│   ├── App.js
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update the API URL:
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://your-backend-url:port/api
```

### 3. Start Development Server
```bash
npm start
```

The app will open at http://localhost:3000

## 🔌 Connecting to Your Backend

Update the `REACT_APP_API_URL` in `.env` to point to your backend API.

The API service in `src/services/api.js` is configured to:
- Add JWT token to all requests automatically
- Handle 401 errors (token expiration)
- Provide consistent error handling
- Support request/response interceptors

## 📦 Key Features

- **Clean folder structure** - Organized by feature and responsibility
- **Modular components** - Reusable, maintainable components
- **Context API** - Global state management for auth and store
- **Protected routes** - Automatic redirect for unauthorized access
- **Centralized API** - Single source for all backend communication
- **Error handling** - Consistent error display across the app

## 🎨 Styling

The project uses CSS modules and follows a component-based styling approach:
- Each component has its own CSS file
- Global styles in `src/styles/`
- CSS variables for theming

## 🧪 Testing

```bash
npm test
```

## 🏗️ Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 📝 Notes

- All authentication is handled through JWT tokens
- Tokens are stored in localStorage
- The app expects your backend to have these endpoints:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `GET /api/auth/verify`
  - `POST /api/auth/logout`
