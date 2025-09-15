# English Learning Management System (LMS)

A modern, responsive Learning Management System built with React, Tailwind CSS, and Firebase Authentication.

## Features

- **Clean Authentication**: Email/password login with Firebase
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Protected Routes**: Dashboard accessible only after authentication
- **Modern UI**: Sleek interface with smooth transitions and card-based layout
- **Modular Architecture**: Easy to expand with additional features

## Pages

1. **Home/Landing Page**: Welcome message with feature highlights and login navigation
2. **Login Page**: Clean authentication form with email/password fields
3. **Dashboard Page**: Protected page with course, assignment, and quiz sections

## Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Routing**: React Router DOM
- **Icons**: Heroicons (via Tailwind)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd englishlms
   npm install
   ```

2. **Configure Firebase**:
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password provider
   - Copy your Firebase config and replace the placeholder values in `src/firebase.js`:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Create test users**:
   - Go to Firebase Console > Authentication > Users
   - Add users manually or use the sign-up functionality (if implemented)

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.js     # Route protection component
├── contexts/
│   └── AuthContext.js        # Authentication context provider
├── pages/
│   ├── Home.js              # Landing page
│   ├── Login.js             # Authentication page
│   └── Dashboard.js         # Main dashboard (protected)
├── App.js                   # Main app component with routing
├── index.js                 # Application entry point
├── index.css                # Global styles with Tailwind
└── firebase.js              # Firebase configuration
```

## Key Components

### AuthContext
Manages authentication state across the application with functions for login, logout, and user state tracking.

### ProtectedRoute
Higher-order component that restricts access to authenticated users only.

### Dashboard Sections
- **Courses**: Interactive course cards with progress tracking
- **Assignments**: Assignment list with due dates and completion status
- **Quizzes**: Available quizzes with start/review options

## Customization

### Adding New Pages
1. Create new component in `src/pages/`
2. Add route in `App.js`
3. Use `ProtectedRoute` wrapper if authentication is required

### Styling
- Modify `tailwind.config.js` for custom colors and themes
- Update `src/index.css` for global styles
- Use existing utility classes for consistency

### Firebase Features
The current setup uses only Authentication. To add more Firebase features:
- **Firestore**: For storing course data, assignments, and user progress
- **Storage**: For file uploads and course materials
- **Cloud Functions**: For server-side logic

## Development Notes

- All components include detailed comments for clarity
- Responsive design works on mobile, tablet, and desktop
- Smooth transitions and hover effects enhance user experience
- Modular structure allows easy expansion
- Error handling implemented for authentication flows

## Future Enhancements

- Course content management
- Assignment submission system
- Quiz creation and grading
- Progress tracking and analytics
- User profiles and settings
- Real-time notifications
- File upload capabilities

## Troubleshooting

### Firebase Configuration
- Ensure all Firebase config values are correct
- Check that Authentication is enabled in Firebase Console
- Verify Email/Password provider is activated

### Build Issues
- Clear node_modules and reinstall if needed: `rm -rf node_modules && npm install`
- Check for any missing dependencies
- Ensure Node.js version compatibility

## License

This project is created for educational purposes.
