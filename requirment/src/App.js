import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Sign from './components/SignUp/Sign';
import JobApplicationForm from './components/JobForm/JobFrom';
import FormPreview from './components/FormPre/FormPre';
import ImageSignatureForm from './components/UploadFile/UploadFile';
import AdmitCard from './components/AdmitCard/AdmitCard';
import Layout from './components/Dashboard/Dashboard';
import ApplicantList from './components/Allaplication/Allaplication';
import SessionExpired from './components/SessionExpired/SessionExpired';
import AdminLogin from './components/Admin/Admin';
import Admindasboard from './components/AdminDashboard/AdminDasboard';
import JobApplicationForm1 from './components/AdmitCardSearch/AdmitCardSearch';
import CSVUpload from './components/CSVUpload/CSVUpload';
import ProtectedRoute from './routes/ProtectedRoute';
function App() {
  return (

    <BrowserRouter>
      <Routes>
      <Route path='/register' element={<Sign />} />
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Layout />} />
        {/* <Route path='/preview' element={<FormPreview />} /> */}
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/applicantList' element={<ApplicantList/>}/>
        <Route path='/sessionexpires' element={<SessionExpired/>}/>
        <Route path='/admitcard' element={<AdmitCard/>}/>
        <Route path='/admindasboard' element={<Admindasboard/>}/>
        <Route path='/jobApplicationForm1' element={<JobApplicationForm1/>}/>
        <Route path='/csvupload' element={<ProtectedRoute Component={CSVUpload} />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
