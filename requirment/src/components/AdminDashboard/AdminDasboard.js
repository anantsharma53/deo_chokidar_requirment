import React, { useState, useEffect } from 'react';
import './AdminDasboard.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom'
import Menubar from '../HeaderMenu/HeaderMenu';
import CSVUpload from '../CSVUpload/CSVUpload';
// import ApplicantList from '../Allaplication/Allaplication';
const AdminDashboard = () => {
    const [totalForms, setTotalForms] = useState(0);
    const [applicationsPerPost, setApplicationsPerPost] = useState({});
    const [error, setError] = useState(null);
 
useEffect(() => {
    const fetchJobApplicationsCount = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch('http://127.0.0.1:8000/api/job-applications/count/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include auth token if required
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTotalForms(data.total_applications); // Set total applications count
        setApplicationsPerPost(data.applications_per_post); // Set applications count per post
      } catch (error) {
        setError(error.message);
      }
    };

    fetchJobApplicationsCount();
  }, []);  
let navigate = useNavigate();
  const handlePrintApplication = () => {
    // Logic to handle application printing
     navigate('/applicantList')
    
    console.log('Print application');
  };

  const handleOtherAction = () => {
    // Logic for another action 
    navigate('/dashboard')
    console.log('Other action');
  };

  return (
    <>
    <Header/>
    <Menubar/>
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h3>Total Forms Received</h3>
        <p>{totalForms}</p>
      </div>
      <div className="dashboard-box">
        <h3>Posts Wise</h3>
        <ul>
        {Object.entries(applicationsPerPost).map(([post, count]) => (
          <li key={post}>{post}: {count}</li>
        ))}
      </ul>
      </div>
      <div className="dashboard-box">
        <h3>Print Application</h3>
        <button onClick={handlePrintApplication}>Print</button>
      </div>
      <div className="dashboard-box">
        <h3>Application Entry</h3>
        <button onClick={handleOtherAction} style={{marginRight:'10px'}}>New Form</button>
      </div>
      <div className="dashboard-box">
        <CSVUpload/>
      </div>
        
    </div>
    </>
  );
};

export default AdminDashboard;
