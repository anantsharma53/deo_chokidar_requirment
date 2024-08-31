import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
function Menubar () {
    let token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    const handleLogout = (e) => {
        localStorage.removeItem('token');
        navigate('/admin');
    }
    
    useEffect(()=>{
        if(!token){
            navigate('/admin');
        }
    }, [token, navigate]);
    const handlehome=(e)=>{
        e.preventDefault();
        navigate('/admindasboard');
    }
    
    return (
        <div className="no-print">
                <hr style={{ margin: '0' }} />
                                <button onClick={handlehome}
                                style={{
                                    margin: '15px',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    backgroundColor: '#4CAF50',
                                    color: '#fff',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'background-color 0.3s ease'
                                  }}
                                   onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                                  onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                                >Home</button>
                                <button 
                                style={{
                                    margin: '15px',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    backgroundColor: '#4CAF50',
                                    color: '#fff',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'background-color 0.3s ease'
                                  }}
                                   onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                                  onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                                to="/logout" onClick={handleLogout}>Logout</button>
                <hr style={{ margin: '0' }} />
                
        </div>
    );
};
export default Menubar;