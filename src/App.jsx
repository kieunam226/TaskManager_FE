import React, {  useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard'
import ManagerTasks from './pages/Admin/ManagerTasks'
import PrivateRoute from './routes/PrivateRoute'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import CreateTask from './pages/Admin/CreateTask'
import ManagerUsers from './pages/Admin/ManagerUsers'
import UserDashboard from './pages/User/UserDashboard'
import ViewTaskDetails from './pages/User/ViewTaskDetails'
import MyTasks from './pages/User/MyTasks'
import UserProvider, { UserContext } from './context/userContext'
import { Toaster } from 'react-hot-toast'


const App = () => {
  return (
    <UserProvider>
   <div>
    <Router>
      <Routes>

        <Route path="/login" element= {<Login /> } />
        <Route path="/signup" element={<SignUp /> } />

        {/* Admin routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />} >
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/tasks" element={<ManagerTasks />} />
        <Route path="/admin/create-task" element={<CreateTask />} />
        <Route path="/admin/users" element={<ManagerUsers />} />
        </Route>

         {/* User routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />} >
       <Route path="/user/dashboard" element={<UserDashboard />} />
       <Route path="/user/tasks" element={<MyTasks />} />
       <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
        </Route>
      <Route path='/' element={<Root />} />

      </Routes>
    </Router>
   </div>

   <Toaster 
    toastOptions={{
      className: "",
      style: {
        fontSize: "13px",
      },
    }}
   />
    </UserProvider>
  )
}

export default App

const Root = () => {
  const {user, loading} = useContext(UserContext);

  if(loading) return <Outlet />; // or a loading spinner
  
  if(!user) {
    return <Navigate to="/login" />;
  }
  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />;
}