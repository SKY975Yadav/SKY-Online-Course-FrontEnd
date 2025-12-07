# 🎨 Online Course Platform – Frontend (React + Vite)

A modern, responsive frontend application for the Online Course Management System. Built with React 18, Vite, and Tailwind CSS, providing an intuitive user interface for students, instructors, and administrators.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [Key Components](#-key-components)
- [Pages Overview](#-pages-overview)
- [Authentication Flow](#-authentication-flow)
- [API Integration](#-api-integration)
- [Styling Guide](#-styling-guide)
- [Deployment](#-deployment)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
- [Acknowledgments](#-acknowledgments)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with persistent sessions
- Protected routes with role-based access control
- Login, Registration, and Password Reset flows
- OTP verification for password recovery
- Automatic token refresh and session management
- Remember me functionality with localStorage

### 👥 User Management
- User profile viewing and editing
- Password change functionality
- Profile picture placeholder with role-based icons
- Account settings management
- Email and name updates with password confirmation

### 📚 Course Features
- **Browse & Search:**
  - Advanced course search with real-time filtering
  - Course catalog with pagination
  - Featured courses section
  - Popular courses showcase
  - Category-based filtering (planned)

- **Course Details:**
  - Comprehensive course information display
  - Module and lesson breakdown
  - Instructor information
  - Student enrollment count
  - Rating and review system
  - Video and document listings

- **Student Features:**
  - Course enrollment with payment integration
  - My Courses dashboard
  - Course progress tracking
  - Course completion marking
  - Review submission
  - Access to enrolled course content

- **Instructor Features:**
  - Create and manage courses
  - View enrolled students
  - Edit course details and pricing
  - Delete courses
  - Course analytics (enrollment count, revenue)
  - Student management per course

- **Admin Features:**
  - Full platform oversight dashboard
  - User management (view, delete)
  - Course management (view, delete)
  - Enrollment monitoring
  - Platform statistics and analytics

### 💳 Payment Integration
- Razorpay payment gateway integration (ready)
- Secure payment processing
- Payment history tracking
- Order creation and verification

### 📝 Feedback & Reviews
- 5-star rating system
- Written review submission
- Review display with timestamps
- Average rating calculation
- Feedback filtering by course

### 🎯 UI/UX Features
- Responsive design for all screen sizes
- Modern, clean interface with Tailwind CSS
- Loading states and skeleton screens
- Toast notifications for user feedback
- Smooth page transitions
- Accessible design patterns
- Mobile-first approach
- Dark mode ready (infrastructure in place)

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18.x |
| Build Tool | Vite 5.x |
| Language | JavaScript (ES6+) |
| Styling | Tailwind CSS 3.x |
| Routing | React Router DOM 6.x |
| HTTP Client | Axios |
| State Management | React Context API |
| Notifications | React Toastify |
| Icons | Lucide React, React Icons |
| Form Handling | Native React (controlled components) |
| Package Manager | npm / yarn |

---

## 🏗 Project Structure

```
src/
├── api/
│   └── client.js                    # API client & all endpoint definitions
├── components/
│   ├── Layout/
│   │   ├── Header.jsx              # Navigation header with auth menu
│   │   ├── Footer.jsx              # Platform footer
│   │   └── Layout.jsx              # Main layout wrapper
│   ├── UI/
│   │   ├── Button.jsx              # Reusable button component
│   │   ├── Card.jsx                # Card container component
│   │   └── Input.jsx               # Form input component
│   └── ProtectedRoute.jsx          # Route guard for authenticated pages
├── contexts/
│   └── AuthContext.jsx             # Authentication state management
├── pages/
│   ├── Home.jsx                    # Landing page
│   ├── BrowseCourses.jsx           # Course catalog
│   ├── CourseDetail.jsx            # Individual course page
│   ├── Profile.jsx                 # User profile & settings
│   ├── Unauthorized.jsx            # Access denied page
│   ├── Auth/
│   │   ├── Login.jsx               # Login page
│   │   ├── Register.jsx            # Registration page
│   │   ├── ForgotPassword.jsx      # Password recovery
│   │   ├── VerifyOTP.jsx           # OTP verification
│   │   └── ResetPassword.jsx       # Password reset
│   ├── Student/
│   │   ├── StudentDashboard.jsx    # Student overview
│   │   └── MyCourses.jsx           # Enrolled courses
│   ├── Instructor/
│   │   ├── InstructorDashboard.jsx # Instructor overview
│   │   ├── InstructorCourses.jsx   # Course management
│   │   ├── CreateCourse.jsx        # New course form
│   │   ├── EditCourse.jsx          # Course editing
│   │   └── CourseStudents.jsx      # Student list per course
│   └── Admin/
│       ├── AdminDashboard.jsx      # Platform overview
│       ├── ManageUsers.jsx         # User management
│       ├── ManageCourses.jsx       # Course oversight
│       └── ManageEnrollments.jsx   # Enrollment tracking
├── App.jsx                         # Main app component with routes
├── main.jsx                        # App entry point
└── index.css                       # Global styles & Tailwind imports
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Backend API running (see backend README)
- Modern web browser

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/SKY975Yadav/Online-Course-Platform-Frontend.git
cd Online-Course-Platform-Frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure API endpoint**

Create or update `src/api/client.js` with your backend URL:

```javascript
const API_BASE_URL = 'http://localhost:8080';
// For production:
// const API_BASE_URL = 'https://your-api-domain.com';
```

4. **Start development server**

```bash
npm run dev
# or
yarn dev
```

The application will be available at: **http://localhost:5173**

5. **Build for production**

```bash
npm run build
# or
yarn build
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build production-ready bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm run lint:fix` | Auto-fix linting issues |

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Razorpay Configuration (if implementing payment)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# App Configuration
VITE_APP_NAME=SKY Education Platform
VITE_APP_VERSION=1.0.0

# Feature Flags (optional)
VITE_ENABLE_DARK_MODE=false
VITE_ENABLE_ANALYTICS=false
```

**Note:** Vite exposes environment variables to your app by prefixing them with `VITE_`. Access them via `import.meta.env.VITE_*`

---

## 🔑 Key Components

### Layout Components

#### Header
- Responsive navigation with mobile menu
- Role-based navigation links
- User dropdown with profile/logout
- Logo with conditional navigation (restricted for instructors/admins)
- Authentication state display

#### Footer
- Multi-column layout with links
- Social media integration
- Course categories
- Company information
- Legal links

#### Layout Wrapper
- Consistent page structure
- Toast notification container
- Global styling application

### UI Components

#### Button
```jsx
<Button 
  variant="primary|outline|text"
  size="sm|md|lg"
  loading={boolean}
  disabled={boolean}
>
  Click me
</Button>
```

#### Card
```jsx
<Card>
  <Card.Header>
    <h2>Title</h2>
  </Card.Header>
  <Card.Content>
    Content here
  </Card.Content>
</Card>
```

#### Input
```jsx
<Input
  label="Email"
  name="email"
  type="email"
  value={value}
  onChange={handleChange}
  required
  error="Error message"
/>
```

### Protected Route
Wraps components requiring authentication:

```jsx
<ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR']}>
  <YourComponent />
</ProtectedRoute>
```

---

## 📄 Pages Overview

### Public Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with featured courses |
| Browse Courses | `/courses` | Course catalog with search |
| Course Detail | `/courses/:id` | Individual course information |
| Login | `/login` | User authentication |
| Register | `/register` | New user registration |
| Forgot Password | `/forgot-password` | Password recovery |
| Verify OTP | `/verify-otp` | OTP confirmation |
| Reset Password | `/reset-password` | New password setup |

### Student Pages (Protected)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/student/dashboard` | Student overview & stats |
| My Courses | `/student/courses` | Enrolled courses list |

### Instructor Pages (Protected)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/instructor/dashboard` | Instructor overview |
| My Courses | `/instructor/courses` | Course management list |
| Create Course | `/instructor/courses/create` | New course form |
| Edit Course | `/instructor/courses/:id/edit` | Course modification |
| Course Students | `/instructor/courses/:id/students` | Student roster |

### Admin Pages (Protected)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/admin/dashboard` | Platform statistics |
| Manage Users | `/admin/users` | User administration |
| Manage Courses | `/admin/courses` | Course oversight |
| Manage Enrollments | `/admin/enrollments` | Enrollment tracking |

### Shared Protected Pages

| Page | Route | Description |
|------|-------|-------------|
| Profile | `/profile` | User profile & settings |
| Unauthorized | `/unauthorized` | Access denied message |

---

## 🔐 Authentication Flow

### Login Process
1. User enters credentials
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates and returns JWT token + user data
4. Token stored in localStorage
5. User data saved in AuthContext
6. Redirect to role-specific dashboard

### Protected Routes
1. ProtectedRoute checks for user in AuthContext
2. If no user, redirect to login with return path
3. If user exists but role doesn't match, redirect to unauthorized
4. Otherwise, render requested component

### Token Management
- Token automatically attached to all API requests via Axios interceptor
- On 401 response, user logged out and redirected to login
- Token persists across page refreshes via localStorage

### Logout Process
1. User clicks logout
2. POST request to `/api/auth/logout` (optional)
3. Clear localStorage (token & user data)
4. Clear AuthContext state
5. Redirect to home page

---

## 🔌 API Integration

### API Client Structure

```javascript
// Base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Request interceptor (add token)
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle 401)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
    }
    return Promise.reject(error);
  }
);
```

### Available API Modules

- **authAPI** - Authentication endpoints
- **userAPI** - User management
- **courseAPI** - Course operations
- **enrollmentAPI** - Enrollment management
- **feedbackAPI** - Reviews and ratings
- **paymentAPI** - Payment processing
- **secureContentAPI** - Protected content access

### Example API Usage

```javascript
// Import API module
import { courseAPI } from '../api/client';

// Fetch courses
const fetchCourses = async () => {
  try {
    const response = await courseAPI.getAllCourses();
    setCourses(response.data);
  } catch (error) {
    toast.error('Failed to fetch courses');
  }
};
```

---

## 🎨 Styling Guide

### Tailwind CSS Configuration

The project uses Tailwind CSS for styling with a custom configuration:

**Color Palette:**
- Primary: Blue (blue-600, blue-500, etc.)
- Success: Green (green-600, green-500)
- Warning: Yellow (yellow-600, yellow-500)
- Error: Red (red-600, red-500)
- Neutral: Gray scale (gray-50 to gray-900)

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Common Patterns

**Container:**
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

**Card with hover effect:**
```jsx
<div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
  {/* Card content */}
</div>
```

**Button styles:**
```jsx
// Primary button
<button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">

// Outline button
<button className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50">
```

**Form inputs:**
```jsx
<input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
```

### Responsive Design

All components follow mobile-first approach:

```jsx
<div className="
  grid 
  grid-cols-1           /* Mobile: 1 column */
  md:grid-cols-2        /* Tablet: 2 columns */
  lg:grid-cols-3        /* Desktop: 3 columns */
  xl:grid-cols-4        /* Large desktop: 4 columns */
  gap-6
">
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
```bash
npm install -g vercel
vercel login
vercel
```

2. **Configure environment variables in Vercel dashboard**
   - Add all `VITE_*` variables
   - Ensure API URL points to production backend

3. **Deploy**
```bash
vercel --prod
```

### Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
```

2. **Build and deploy**
```bash
npm run build
netlify deploy --prod --dir=dist
```

3. **Configure redirects** (create `public/_redirects`):
```
/*    /index.html   200
```

### Docker

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:

```bash
docker build -t course-platform-frontend .
docker run -p 80:80 course-platform-frontend
```

### Production Checklist

- [ ] Update API_BASE_URL to production backend
- [ ] Configure CORS on backend for production domain
- [ ] Enable HTTPS
- [ ] Configure CDN for static assets
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Enable gzip compression
- [ ] Configure caching headers
- [ ] Add meta tags for SEO
- [ ] Test all user flows
- [ ] Set up monitoring and analytics

---

## 🌐 Browser Support

- Chrome (last 2 versions) ✅
- Firefox (last 2 versions) ✅
- Safari (last 2 versions) ✅
- Edge (last 2 versions) ✅
- Mobile Safari (iOS 12+) ✅
- Chrome Mobile (Android 8+) ✅

**Not supported:**
- Internet Explorer (any version)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed
- Ensure responsive design on all screen sizes

### Code Style

- Use functional components with hooks
- Prefer named exports over default exports
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use meaningful variable and function names
- Add prop-types or TypeScript for type safety

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Saikrishna G**
- GitHub: [@SKY975Yadav](https://github.com/SKY975Yadav)
- Backend Repository: [Online Course Platform API](https://github.com/SKY975Yadav/Online-Course-Platform)
- Frontend Repository: [Online Course Platform Frontend](https://github.com/SKY975Yadav/Online-Course-Platform-Frontend)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for lightning-fast development experience
- Tailwind CSS for utility-first styling
- Lucide React for beautiful icons
- React Router for seamless navigation
- Axios for robust HTTP client
- React Toastify for elegant notifications
- Open source community for inspiration and support

---

## 📊 Project Statistics

- **Components:** 25+
- **Pages:** 20+
- **API Endpoints Integrated:** 35+
- **Supported Roles:** 3 (Student, Instructor, Admin)
- **Authentication Methods:** JWT + Session Management
- **Responsive Breakpoints:** 5
- **Browser Compatibility:** 95%+ of users

---

## 🔮 Roadmap

### Upcoming Features

- [ ] Real-time notifications with WebSockets
- [ ] Advanced course search with filters
- [ ] Video player with progress tracking
- [ ] Certificate generation upon completion
- [ ] Discussion forums for each course
- [ ] Live chat support
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA) support
- [ ] Advanced analytics dashboard
- [ ] Social media sharing integration
- [ ] Course recommendations based on preferences
- [ ] Gamification elements (badges, achievements)

### In Progress

- Payment gateway integration UI
- Course preview functionality
- Enhanced mobile experience
- Accessibility improvements

---

## 📞 Support

For support and questions:
- 📧 Email: support@skyeducationplatform.com
- 💬 Community: [Discord Server](#)
- 🐛 Issues: [GitHub Issues](https://github.com/SKY975Yadav/Online-Course-Platform-Frontend/issues)
- 📚 Documentation: [Wiki](https://github.com/SKY975Yadav/Online-Course-Platform-Frontend/wiki)

---

## 🎯 Getting Help

### Common Issues

**Build fails with dependency errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API calls returning 401:**
- Check if backend is running
- Verify token in localStorage
- Check API_BASE_URL configuration

**Styles not applying:**
- Ensure Tailwind CSS is properly configured
- Check if `index.css` is imported in `main.jsx`
- Clear browser cache

**Routes not working after deployment:**
- Configure server to redirect all routes to `index.html`
- Check routing configuration

---

⭐ **If this project helped you, please give it a star on GitHub!**

---

**Built with ❤️ by Saikrishna G**
