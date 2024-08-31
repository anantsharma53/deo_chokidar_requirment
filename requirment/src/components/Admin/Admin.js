import React, { useState } from 'react';
import './Admin.css'
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom'
import './Admin.css'

const AdminLogin = () => {
  // State variables to store input values and error messages
  const [user, setUser] = useState({
    username: "",
    password: "",
});
const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
        ...user,
        [name]: value,
    });
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
                navigate("/admindasboard");
            }
            else {
                navigate("/admin");
            }

        })
        .catch((err) => {
            alert("Check your Username Or Password");
            console.log(err);
        });

}

  return (
    <>
    <Header/>
    <div className="logincontainer1">
      <div className="loginform loginform1">
        <h2>HOD Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="User Name"
            name="username"
            onChange={handleChange}
            value={user.username}
          />
          <input
            type='password'
            placeholder="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={user.password}
            className="form-control"
          />
          <button type="submit" >Login</button>
          <a href="#">Forget Password?</a>
        </form>
      </div>
    </div>
    
    </>
  );
};

export default AdminLogin;
