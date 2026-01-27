# User Self-Profile CRUD Functions Report

## Overview
This document contains all the functions that allow users to manage their own profile data (username, password, email, avatar) in the e-commerce application.

---

## 🔧 Backend - User Self-Update Functions

### File: `backend/controllers/profileController.js`

```javascript
// ✅ UPDATE - User updates their own username/email
const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findByPk(req.user.id);
  const updatedUser = await user.update({
    username: username || user.username,
    email: email || user.email
  });
}

// ✅ UPDATE - User changes their own password  
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });
}

// ✅ READ - User views their own profile
const getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] },
    include: [{ model: db.role, attributes: ['id', 'name'] }]
  });
}

// ✅ DELETE - User deletes their own account
const deleteProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  await user.destroy();
}

// ✅ CREATE - User uploads their own avatar
const uploadAvatar = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  const avatarPath = `/uploads/avatars/${req.file.filename}`;
  await user.update({ avatar: avatarPath });
}
```

---

## 🎨 Frontend - User Self-Update Functions

### File: `frontend/src/components/user/SimpleProfile.vue`

```javascript
// ✅ UPDATE - User updates their profile (username/email)
const updateProfile = async () => {
  const response = await axios.put('http://localhost:3000/api/profile', {
    username: user.username,
    email: user.email
  }, {
    withCredentials: true
  });
  authStore.user = response.data.user;
}

// ✅ UPDATE - User changes their password
const updateProfile = async () => {
  await axios.put('http://localhost:3000/api/profile/password', {
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword
  }, {
    withCredentials: true
  });
}

// ✅ READ - User loads their profile data
const loadUserData = () => {
  if (authStore.user) {
    Object.assign(user, {
      username: authStore.user.username || '',
      email: authStore.user.email || ''
    })
  }
}
```

### File: `frontend/src/stores/auth.js`

```javascript
// ✅ CREATE - User registers their own account
async register(username, email, password) {
  const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, email, password })
  });
  this.user = data.user;
  this.isAuthenticated = true;
}



// ✅ DELETE - User logs out (clears their session)
async logout() {
  await fetch("http://localhost:3000/api/logout", {
    method: "POST",
    credentials: "include",
  });
  this.user = null;
  this.isAuthenticated = false;
}
```

---

## 📊 Summary: User Self-Profile CRUD Operations

| Action | Backend Function | Frontend Function | What User Can Do |
|--------|------------------|-------------------|------------------|
| **CREATE** | `register()` | `register()` | Create their own account |
| **READ** | `getProfile()` | `loadUserData()` | View their profile |
| **READ** | `me()` | `fetchCurrentUser()` | Get their current data |
| **UPDATE** | `updateProfile()` | `updateProfile()` | Change username/email |
| **UPDATE** | `updatePassword()` | `updateProfile()` | Change password |
| **UPDATE** | `uploadAvatar()` | `handleImageError()` | Upload profile picture |
| **DELETE** | `deleteProfile()` | - | Delete their account |
| **DELETE** | `logout()` | `logout()` | Log out of their account |

---

## 🛡️ Security Features

- **Authentication**: All profile functions require JWT verification middleware
- **Authorization**: Users can only access/modify their own data (`req.user.id`)
- **Password Security**: Passwords are hashed using bcrypt before storage
- **Session Management**: Uses HTTP-only cookies for secure authentication
- **Input Validation**: Backend validates email format and required fields

---

## 📁 File Locations

### Backend Files
- `backend/controllers/profileController.js` - Main profile CRUD operations
- `backend/routes/profileRoutes.js` - Profile API routes
- `backend/middleware/authJwt.js` - JWT authentication middleware

### Frontend Files  
- `frontend/src/components/user/SimpleProfile.vue` - Profile UI component
- `frontend/src/views/user/ProfileView.vue` - Profile page
- `frontend/src/stores/auth.js` - Authentication state management
- `frontend/src/router/index.js` - Profile route configuration

---

## 🚀 API Endpoints

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `/api/profile` | `getProfile()` | Get user profile |
| PUT | `/api/profile` | `updateProfile()` | Update username/email |
| PUT | `/api/profile/password` | `updatePassword()` | Change password |
| DELETE | `/api/profile` | `deleteProfile()` | Delete account |
| POST | `/api/profile/avatar` | `uploadAvatar()` | Upload avatar |
| POST | `/api/register` | `register()` | Register account |
| GET | `/api/me` | `me()` | Get current user |
| POST | `/api/logout` | `logout()` | Logout user |

---

*Generated on: $(date)*
*Project: E-commerce Application*
