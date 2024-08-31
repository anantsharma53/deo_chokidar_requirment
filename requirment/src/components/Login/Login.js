import './Login.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import AdmitCardSearchForm from '../AdmitCardSearch/AdmitCardSearch';
function Login() {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });


    const [applicationNumber, setApplicationNumber] = useState('');
    const [dob, setDob] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };
    const handleSearch = async (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log('Search for:', applicationNumber, dob);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/searchAdmitCard/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicationNumber: applicationNumber,
                    dob: dob,
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                navigate('/admitcard', { state: { admitCardData: data } });
            } else {
                const data = await response.json();
                // alert('Admit card not found. Please check your details and try again.');
                window.confirm('Admit card not found. Please check your details and try again.');
            }
        } catch (error) {
            console.error('Error fetching the admit card:', error);
            alert('There was an error processing your request. Please try again later.');
        }
    };
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleSignupVisibility = () => {
        setShowSignup(!showSignup);
    };
    let navigate = useNavigate();
    function handleSubmit(e) {
        e.preventDefault();
        fetch("http://127.0.0.1:8000/api/signin/", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",

            },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json(); // Parse response as JSON
                } else if (res.status === 400) {
                    console.log("Unauthorized request");
                    alert("Login Error");
                    throw new Error("Unauthorized request");
                } else {
                    console.log("Something went wrong");
                    throw new Error("Something went wrong");
                }
            })
            .then((data) => {
                console.log(data);
                const { user, access } = data;
                localStorage.setItem("token", data.access);
                localStorage.setItem("tokenExpiration", data.access);
                localStorage.setItem("user_details", JSON.stringify(user));
                const users = JSON.parse(localStorage.getItem('user_details'));
                const iscandiate = users && users.is_candiate;
                if (iscandiate) {
                    //    navigate("/form");
                    navigate("/dashboard");
                }
                else {
                    navigate("/");
                }

            })
            .catch((err) => {
                alert("Check your Username Or Password");
                console.log(err);
            });

    }
    return (
        <>
            <div className='login-container'>
                <Header></Header>
                <div className='login-content'>
                    <div className='form-container'>
                        <div className='information'>
                            <h2>Important Informations</h2>
                            <ol>
                                <li style={{ padding: '12px' }}> Requirment Details</li>
                            </ol>
                            <div style={{ width: '300px', color: 'red', textAlign: 'justify' }}>
                                <p>
                                    नोट:-  सभी अभ्यर्थियों को सूचित किया जाता है कि उपर्युक्त्त समय में अपने आवेदन पत्र
                                    भरते समय हुई त्रुटियों का उचित संशोधन कर लें। यह संशोधन का अंतिम अवसर होगा,
                                    इसके बाद संशोधन का कोई भी अनुरोध विचारणीय नहीं होगा।
                                </p>
                            </div>
                        </div>
                        
                        <div className='admitcard'>
                            <h2>AdmitCard</h2>
                            {/* <AdmitCardSearchForm onSearch={handleSearch} /> */}
                            <form onSubmit={handleSearch} style={styles.form}>
                                <div style={styles.formGroup}>
                                    <label htmlFor="applicationNumber">Application Number:</label>
                                    <input
                                        type="text"
                                        id="applicationNumber"
                                        value={applicationNumber}
                                        onChange={(e) => setApplicationNumber(e.target.value)}
                                        required
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label htmlFor="dob">Date of Birth:</label>
                                    <input
                                        type="date"
                                        id="dob"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        required
                                        style={styles.input}
                                    />
                                </div>
                                <button type="submit" style={styles.button}>Search</button>
                            </form>
                            <div style={{ width: '300px', color: 'red', textAlign: 'justify' }}>
                                <p>

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const styles = {
    form: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      // border: '1px solid #ccc',
      // borderRadius: '5px',
      // backgroundColor: '#f9f9f9',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '8px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      width: '100%',
      padding: '10px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#007bff',
      color: '#fff',
      fontSize: '16px',
      cursor: 'pointer',
    },
  };
export default Login;