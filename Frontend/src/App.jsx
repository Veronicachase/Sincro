
import { Routes, Route } from "react-router-dom";
//import RequireAuth from './components/RequireAurth'
import  AuthContextProvider  from './context/AuthContext';
import { CreatePdfContextProvider } from "./context/CreatePdfContext";
import CreateNewProject from './views/projects/CreateNewProject'
import MyProjects from './views/projects/MyProjects'
import ProjectInfo from './views/projects/ProjectInfo'
import Pendings from './views/Pendings/Pendings'
import Progress from './views/progress/Progress'
import CreateOrder from './views/matAndOrders/CreateOrder'
import OrderList from './views/matAndOrders/OrderList'
import OrderDetails from './views/matAndOrders/OrderDetails'
import CreateContact from './views/contacts/CreateContact'
import Contacts from './views/contacts/Contacts'
import ContactDetails from './views/contacts/ContactDetails'
import CreateEmployee from './views/staff/CreateEmployee'
import StaffList from './views/staff/StaffList'
import Employee from './views/staff/Employee'
import Reports from './views/reports/Reports'
import Layout from './components/Layout'
import LoginForm  from './views/login/LoginForm'
import Register from './views/register/Register'
import Home from './views/home/Home'
import ProjectSectionTasks from "./views/projects/ProjectSectionTasks"
import ProjectCreateTask from "./views/projects/ProjectCreateTask"
import ForgotPassword from './views/forgotPassword/ForgotPassword'
import ProjectInfoTasks from "./views/projects/ProjectInfoTask";


//import BritishFlag from '../../assets/images/BritishFlag.png';

import { Navigate } from "react-router-dom";

{/** cambiar por un slider button */}
import "./App.css";


export default function App() {
  

  return (
    <>
      
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<Layout />}>
            {/*<Route element={<RequireAuth />}>*/}
              <Route path="/create-new-project" element={<CreateNewProject />} />
              <Route path="/my-projects" element={<MyProjects />} />
              <Route path="/project-info/:projectId" element={< ProjectInfo/>} />
              <Route path="/project-section-tasks/:projectId/:sectionKey" element={< ProjectSectionTasks/>} />
              <Route path="/project-create-task/:projectId/:sectionKey" element={< ProjectCreateTask/>} />
              <Route path="/project-info-task/:projectId/:sectionKey" element={<ProjectInfoTasks />} />
              <Route path="/pendings" element={<Pendings />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/create-order" element={<CreateOrder />} />
              <Route path="/order-list" element={<OrderList />} />
              <Route path="/order-details/:orderId" element={<OrderDetails />} />
              <Route path="/allContacts" element={<Contacts />} />
              <Route path="/create-contact" element={<CreateContact />} />
              <Route path="/contact-details/:contactId" element={<ContactDetails />} />
              <Route path="/staff-list" element={<StaffList />} />
              <Route path="/create-employee" element={<CreateEmployee />} />
              <Route  element = <CreatePdfContextProvider/>>  
              <Route path="/employee" element={<Employee/>} />
              </Route>
              <Route path="/reports" element={<Reports />} />
            </Route>
         {/* </Route>*/}
        </Routes>
      </AuthContextProvider>
    </>
  );
}




