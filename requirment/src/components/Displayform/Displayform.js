// ApplicantProfile.jsx
import React from 'react';
import './Displayform.css'; // Import the CSS file
import { useState, useEffect } from 'react';
import * as html2pdf from 'html2pdf.js';
const ApplicantProfile = () => {
    const [ApplicantData, setApplicantData] = useState([]);
    const [error, setError] = useState(null);
    // let token=localStorage.getItem("token");
    useEffect(() => {
        const fetchApplicantApplicantData = async () => {
            try {
                const token = localStorage.getItem("token"); // Replace 'your_bearer_token' with the actual bearer token
                const response = await fetch('http://127.0.0.1:8000/api/applicant-information/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch ApplicantData');
                }

                const data = await response.json();
                setApplicantData(data);
            } catch (error) {
                setError('Error fetching ApplicantData');
            }
        };

        fetchApplicantApplicantData();
    }, []);
    const pic = ApplicantData.image;
    if (!ApplicantData || ApplicantData.length === 0 || ApplicantData.image === null) {
        return <p>Please fill out the application form.</p>;
    }
    const calculateTotalExperience = () => {
        return ApplicantData.experience.reduce((total, currentExp) => {
            // Assuming years are represented as strings, convert to numbers for addition
            return (
                (parseFloat(total + parseFloat(currentExp.years, 10) / 12))

            );
        }, 0);
    };

    // ...

    // Use the function in your component
    { calculateTotalExperience() }

    const handleGeneratePDF = () => {
        const content = document.querySelector('.applicant-details-container');

        // Convert images to base64 and embed them in the HTML
        const images = content.querySelectorAll('img');
        images.forEach(async (img) => {
            const imageUrl = img.src;
            const base64Image = await getBase64Image(imageUrl);
            img.src = base64Image;
        });

        const pdfOptions = {
            margin: 10,
            filename: 'applicant_profile.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        html2pdf(content, pdfOptions);
    };

    const getBase64Image = async (url) => {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error fetching image:', error.message);
            throw error; // Rethrow the error to handle it at the higher level
        }
    };




    return (

        <div className="applicant-details-container">

            <div className="header-section">
                <div className="logo" >
                    <img
                        src="http://127.0.0.1:8000/media/images/jhlogo1.jpg"
                        alt="" style={{ height: '80px', width: 'auto' }} />
                    <p>
                        <strong>जिला जामताड़ा </strong>
                        <br></br>
                        <strong>DISTRICT JAMTARA</strong>
                    </p>
                </div>

            </div>
            <hr></hr>
                <hr></hr>
                <div className="single-row">
                    <div className="input-group">
                        <label htmlFor="post" style={{ marginRight: '10px' }}>Post</label>
                        <span>{ApplicantData.post}</span>
                    </div>

                    <div className="input-group">
                        <label htmlFor="application_number" style={{ marginRight: '10px' }}>Application Number</label>
                        <span>{ApplicantData.application_number}</span>
                    </div>

                    <div className="input-group">
                        <label htmlFor="roll_number" style={{ marginRight: '10px' }}>Roll Number</label>
                        <span>{ApplicantData.roll_number}</span>
                    </div>
                </div>
                <hr></hr>
                <div className="applicant-info-container">
                    <div className="form-left">
                        {/* Applicant Name */}
                        <label htmlFor="applicantName" style={{ marginRight: '10px' }}>Applicant Name</label>
                        <span>{ApplicantData.applicantName}</span>

                        {/* Father Name */}
                        <label htmlFor="fatherName" style={{ marginRight: '10px' }}>Father Name</label>
                        <span>{ApplicantData.fatherName}</span>

                        {/* Aadhaar Number */}
                        <div className="form-group">
                            <label htmlFor="aadhaar_number" style={{ marginRight: '10px' }}>Applicant Aadhaar Number</label>
                            <span>{ApplicantData.aadhaar_number}</span>
                        </div>

                        {/* Date of Birth */}
                        <div className="form-group">
                            <label htmlFor="dob" style={{ marginRight: '10px' }}>Date of Birth</label>
                            <span>{ApplicantData.dob}</span>
                        </div>
                    </div>

                    <div className="form-right">
                        {/* User Picture */}
                        <div className="user-picture">
                            <img src={`http://127.0.0.1:8000/${ApplicantData.image}`} alt="User" />
                            {/* src={`http://127.0.0.1:8000/${ApplicantData.image}`} */}
                        </div>

                        {/* Signature */}
                        <div className="user-signature">
                            <img src={`http://127.0.0.1:8000/${ApplicantData.signature}`} alt="Signature" />
                        </div>
                    </div>
                </div>

                <div className="permanent-address-box">
                    <h3>Permanent Address</h3>

                    {/* Second Row */}
                    <div className="address-row">
                        <div className="input-group">
                            <label htmlFor="bit_number" style={{ marginRight: '10px' }}>Bit Number</label>
                            <span>{ApplicantData.bit_number}</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="bit_village" style={{ marginRight: '10px' }}>Bit Village</label>
                            <span>{ApplicantData.bit_village}</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="village" style={{ marginRight: '10px' }}>Village</label>
                            <span>{ApplicantData.village}</span>
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="address-row">
                        <div className="input-group">
                            <label htmlFor="panchyat" style={{ marginRight: '10px' }}>Panchyat</label>
                            <span>{ApplicantData.panchyat}</span>

                        </div>

                        <div className="input-group">
                            <label htmlFor="post_office" style={{ marginRight: '10px' }}>Post Office</label>
                            <span>{ApplicantData.post_office}</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="police_station" style={{ marginRight: '10px' }}>Police Station</label>
                            <span>{ApplicantData.police_station}</span>
                        </div>
                    </div>

                    {/* Third Row */}
                    <div className="address-row">
                        <div className="input-group">
                            <label htmlFor="circle" style={{ marginRight: '10px' }}>Circle</label>
                            <span>{ApplicantData.circle}</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="district" style={{ marginRight: '10px' }}>District</label>
                            <span>{ApplicantData.district}</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="pin_code" style={{ marginRight: '10px' }}>Pincode</label>
                            <span>{ApplicantData.pin_code}</span>
                        </div>
                    </div>
                </div>
                {/* Correspondent Address */}
                <div className="permanent-address-box">
                    <h3>Correspondent Address</h3>
                    <span>{ApplicantData.correspondentAddress}</span>
                </div>
                <div className="form-row">
                    {/* Email */}
                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <span>{ApplicantData.email}</span>
                    </div>

                    {/* Mobile Number */}
                    <div className="form-field">
                        <label htmlFor="mobileNumber">Mobile Number</label>
                        <span>{ApplicantData.mobileNumber}</span>
                    </div>

                    {/* Nationality */}
                    <div className="form-field">
                        <label htmlFor="nationality">Nationality</label>
                        <span>{ApplicantData.nationality}</span>
                    </div>
                </div>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Disability Type</th>
                            <th>Disability Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{ApplicantData.disability_type}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.disability_percentage}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Education</th>
                            <th>Board/University</th>
                            <th>Passing Year</th>
                            <th>Total Marks</th>
                            <th>Obtained Marks</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{ApplicantData.education}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.boardUniversity}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.passingYear}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.total_marks}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.obtained_marks}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.percentage}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Residential Certificate Number</th>
                            <th>Residential Certificate Date</th>
                            <th>Caste Certificate Number</th>
                            <th>Caste Certificate Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{ApplicantData.residential_certificate_number}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.residential_certificate_date}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.caste_certificate_number}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.caste_certificate_date}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Draft Number</th>
                            <th>Draft Date</th>
                            <th>DD Amount</th>
                            <th>Bank Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{ApplicantData.draft_number}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.draft_date}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.dd_amount}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.bank_name}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Experience Circle</th>
                            <th>Experience Police Station</th>
                            <th>Experience Bit Number</th>
                            <th>Experience Bit Village</th>
                            <th>Experience Years</th>
                            <th>Experience Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{ApplicantData.exp_circle}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.exp_police_station}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.exp_bit_number}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.exp_bit_village}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.exp_years}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.exp_remarks}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th >Is Ex-Serviceman</th>
                            <th>Has Criminal Case</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{ApplicantData.is_ex_serviceman ? 'Yes' : 'No'}</span>

                            </td>
                            <td>
                                <span>{ApplicantData.has_criminal_case ? 'Yes' : 'No'}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <label htmlFor="criminal_case_details">Criminal Case Details</label>
                                <span>{ApplicantData.criminal_case_details}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Identification Marks</th>
                            <th>Explain</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="identification_mark_1"> Mark 1</label>
                            </td>
                            <td>
                                <span>{ApplicantData.identification_mark_1}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="identification_mark_2">Mark 2</label>
                            </td>
                            <td>
                                <span>{ApplicantData.identification_mark_2}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Exam Center Name</th>
                            <th>Exam Date</th>
                            <th>Exam Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{ApplicantData.exam_center_name}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.exam_date}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.exam_time}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* Category */}
                <div className="category-field">
                    <label htmlFor="category">Category</label>
                    <span>{ApplicantData.category}</span>
                </div>
                <div className="gender-field">
                    {/* Gender Label */}
                    <label>Gender</label>
                    <span>{ApplicantData.gender}</span>
                </div>
                {/* Declaration */}
                <div style={{ display: 'flex', alignItems: 'start', margin: '16px' }}>
                    <p style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                        I hereby declare that the information provided in this form is true, complete, and accurate to the best of my knowledge. I understand that any false statement or omission may result in disqualification from consideration or, if already employed, in disciplinary action, up to and including termination.
                        <br />
                        I further understand that submission of this form does not guarantee acceptance or approval, and decisions will be made based on the criteria specified by Organization.
                    </p>

                </div>
                <table className="form-table">
                    <thead>
                        <tr>
                            <th>Application Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>{ApplicantData.application_status}</span>
                            </td>
                            <td>
                                <span>{ApplicantData.remarks}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* <button onClick={handleBack} style={{ marginRight: '10px' }}>Back / Edit</button>
                <button onClick={handleSubmit} style={{ marginRight: '10px' }}> Submit</button>
             */}




























            
            <div style={{ margin: '0', marginBottom: '3px' }}>
                <hr style={{ margin: '0' }} />
                <p style={{ margin: '0', marginBottom: '3px' }}><strong>Post Name:</strong> &nbsp;&nbsp;&nbsp;{ApplicantData.post}</p>
                <p style={{ margin: '0', marginBottom: '3px' }}><strong>Application Number:</strong> &nbsp;&nbsp;&nbsp;{ApplicantData.application_number}</p>
                <hr style={{ margin: '0' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="personal-info">
                    <h2>Personal Information</h2>
                    <table className="applicant-info-table">
                        <tbody>
                            <tr>
                                <td><strong>Name:</strong></td>
                                <td>{ApplicantData.applicantName}</td>
                            </tr>
                            <tr>
                                <td><strong>Father's Name:</strong></td>
                                <td>{ApplicantData.fatherName}</td>
                            </tr>
                            <tr>
                                <td><strong>Date of Birth:</strong></td>
                                <td>{ApplicantData.dob}</td>
                            </tr>
                            <tr>
                                <td><strong>Correspondent Address:</strong></td>
                                <td>{ApplicantData.correspondentAddress}</td>
                            </tr>
                            <tr>
                                <td><strong>Permanent Address:</strong></td>
                                <td>{ApplicantData.permanentAddress}</td>
                            </tr>
                            <tr>
                                <td><strong>Mobile Number:</strong></td>
                                <td>{ApplicantData.mobileNumber}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>{ApplicantData.email}</td>
                            </tr>
                            <tr>
                                <td><strong>Nationality:</strong></td>
                                <td>{ApplicantData.nationality}</td>
                            </tr>
                            <tr>
                                <td><strong>Category:</strong></td>
                                <td>{ApplicantData.category}</td>
                            </tr>
                            <tr>
                                <td><strong>Gender:</strong></td>
                                <td>{ApplicantData.gender}</td>
                            </tr>
                            <tr>
                                <td><strong>Physically Challenged:</strong></td>
                                <td>{ApplicantData.isPhysicallyChallenged ? 'Yes' : 'No'}</td>
                            </tr>
                        </tbody>
                    </table>


                </div>
                <div style={{ alignItems: 'center' }}>
                    <img className="profile-image" src={`http://127.0.0.1:8000/${ApplicantData.image}`} alt="Applicant Image" />
                </div>
            </div>
            <div className="pre-education-section">
                <h2>Education</h2>
                <table className="pre-education-container">
                    <thead>
                        <tr>
                            <th>Exam</th>
                            <th>Board/University</th>
                            <th>Passing Year</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ApplicantData.education && ApplicantData.education.map((edu, index) => (
                            <tr key={index} className="pre-education-item">
                                <td><strong>{edu.education}</strong></td>
                                <td>{edu.boardUniversity}</td>
                                <td> {edu.passingYear}</td>
                                <td> {edu.percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <div className="experience-section">
                <h2>Experience</h2>
                <table className="experience-container">
                    <thead>
                        <tr>
                            <th>Organization</th>
                            <th>Years</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ApplicantData.experience.map((exp, index) => (
                            <tr key={index} className="experience-item">
                                <td><strong>{exp.organization}</strong></td>
                                <td>{exp.years}</td>
                                <td>{exp.remarks}</td>
                            </tr>
                        ))}
                        {/* Total Experience Row */}
                        <tr className="experience-item">
                            {/* <td colSpan="0"></td> */}
                            <td>Total Experience:</td>
                            <td colSpan="2">{calculateTotalExperience()} &nbsp; Years</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p style={{ marginLeft: '10px', textAlign: 'justify' }}>
                I hereby declare that the information provided in this form is true, complete, and accurate to the best of my knowledge. I understand that any false statement or omission may result in disqualification from consideration or, if already employed, in disciplinary action, up to and including termination.
                <br />
                I further understand that submission of this form does not guarantee acceptance or approval, and decisions will be made based on the criteria specified by Organization.
            </p>
            <div className="image-section" >
                <div>
                    <p>Date:</p>
                    <p>Place:</p>
                </div>
                <div>
                    <img className="profile-signe" src={`http://127.0.0.1:8000/${ApplicantData.signature}`} alt="Applicant Signature" />
                    <p>Signature</p>
                </div>

            </div>
            <button onClick={handleGeneratePDF} style={{ width: '100%' }}>DownLoad your Application</button>
        </div>
    );
};

export default ApplicantProfile;
