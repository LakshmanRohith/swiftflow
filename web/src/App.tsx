// path: web/src/App.tsx

import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MyTasks from './pages/MyTasks';
import ProjectDetail from './pages/ProjectDetail';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile'; // Import Profile page
import Settings from './pages/Settings'; // Import Settings page

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="analytics" element={<Analytics />} />
        {/* Add the new routes */}
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Add a simple 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Simple 404 component
function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">404 - Not Found</h1>
            <p className="mt-4">The page you are looking for does not exist.</p>
            <Link to="/" className="mt-6 text-blue-500 hover:underline">Go to Dashboard</Link>
        </div>
    )
}

export default App;
