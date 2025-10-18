# KandyPack Login Guide

## How to Login to Different Portals

### 🔐 Authentication Overview

The application now uses role-specific authentication endpoints:
- **Customer**: `/api/auth/login`
- **Admin**: `/api/auth/admin/login`
- **Driver**: `/api/auth/driver/login`
- **Assistant**: `/api/auth/assistant/login`

---

## 🛍️ Customer Login

**URL**: `http://localhost:3000/login` or `http://localhost:3000/login/customer`

**Steps**:
1. Go to the Customer Login page
2. Enter your email address
3. Enter your password
4. Click "Sign In"
5. You'll be redirected to `/customer` portal

**Example Credentials** (if your backend has test data):
```
Email: customer@example.com
Password: password123
```

---

## 👨‍💼 Admin Login

**URL**: `http://localhost:3000/login/admin` or `http://localhost:3000/login/employee`

**Steps**:
1. Go to the Employee Portal login page
2. Click on the **"👨‍💼 Administrator"** tab
3. Enter your admin email/ID
4. Enter your password
5. Click "Sign In as Admin"
6. You'll be redirected to `/employee` portal with admin access

**Example Credentials**:
```
Email: admin@kandypack.com
Password: admin123
```

**Admin Capabilities**:
- Full system management
- User oversight
- Business analytics
- Manage customers, orders, products
- Manage stores, inventory
- Manage trucks and trains
- View all reports

---

## 🚛 Driver Login

**URL**: `http://localhost:3000/login/employee`

**Steps**:
1. Go to the Employee Portal login page
2. Click on the **"🚛 Driver"** tab
3. Enter your driver email/ID (e.g., DRV001)
4. Enter your password
5. Click "Sign In as Driver"
6. You'll be redirected to `/employee` portal with driver dashboard

**Example Credentials**:
```
Email: driver@kandypack.com
Password: driver123
```

**Driver Capabilities**:
- View delivery assignments
- Update delivery status
- Manage routes
- Track deliveries
- Report issues

---

## 🤝 Assistant Login

**URL**: `http://localhost:3000/login/employee`

**Steps**:
1. Go to the Employee Portal login page
2. Click on the **"🤝 Assistant"** tab
3. Enter your assistant email/ID (e.g., AST001)
4. Enter your password
5. Click "Sign In as Assistant"
6. You'll be redirected to `/employee` portal with assistant dashboard

**Example Credentials**:
```
Email: assistant@kandypack.com
Password: assistant123
```

**Assistant Capabilities**:
- Handle support tickets
- Assist drivers
- Manage inventory
- Process orders
- Customer support

---

## 🔧 Technical Implementation

### Login Flow

1. User enters credentials on login page
2. Frontend calls appropriate endpoint based on role:
   ```javascript
   // Admin login
   await authService.admin.login({ email, password });
   
   // Driver login
   await authService.driver.login({ email, password });
   
   // Assistant login
   await authService.assistant.login({ email, password });
   
   // Customer login
   await authService.login({ email, password });
   ```

3. Backend validates credentials and returns JWT token
4. Token is stored in localStorage
5. User is redirected to appropriate portal
6. Token is automatically included in all subsequent API requests

### Testing Without Backend

If your backend is not running yet, you can test the UI flow:

1. Start the frontend: `npm start`
2. Navigate to login pages
3. The UI will show the login forms and tabs
4. You'll see error messages if backend is not available

### Setting Up Backend

Make sure your backend is running on `http://localhost:3000` (or update `REACT_APP_API_URL` in `.env`)

Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:3000/api
```

---

## 📱 Quick Access URLs

| Role | Login URL | Portal URL |
|------|-----------|------------|
| Customer | `/login` or `/login/customer` | `/customer` |
| Admin | `/login/admin` or `/login/employee` | `/employee` |
| Driver | `/login/employee` (Driver tab) | `/employee` |
| Assistant | `/login/employee` (Assistant tab) | `/employee` |

---

## 🔍 Debugging Login Issues

### Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for API errors

### Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to login
4. Look for the POST request to `/api/auth/*/login`
5. Check the response status and body

### Check LocalStorage
1. Open Developer Tools (F12)
2. Go to Application tab
3. Check Local Storage
4. Look for `authToken` and `user` keys

### Common Issues

**Issue**: "Network Error" or "Cannot connect"
- **Solution**: Make sure backend is running on `http://localhost:3000`

**Issue**: "401 Unauthorized"
- **Solution**: Check credentials, ensure user exists in database

**Issue**: "403 Forbidden"
- **Solution**: User doesn't have permission for that role

**Issue**: Redirected to login after successful login
- **Solution**: Check if token is being saved in localStorage

---

## 🧪 Testing the Login System

### Test Script (Browser Console)

```javascript
// Test Admin Login
const testAdminLogin = async () => {
  const response = await fetch('http://localhost:3000/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@kandypack.com',
      password: 'admin123'
    })
  });
  const data = await response.json();
  console.log('Admin Login:', data);
};

// Test Driver Login
const testDriverLogin = async () => {
  const response = await fetch('http://localhost:3000/api/auth/driver/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'driver@kandypack.com',
      password: 'driver123'
    })
  });
  const data = await response.json();
  console.log('Driver Login:', data);
};

// Run tests
testAdminLogin();
testDriverLogin();
```

---

## 📞 Support

If you encounter issues:
1. Check this guide
2. Verify backend is running
3. Check browser console for errors
4. Verify API endpoints in backend
5. Check user exists in database with correct role
