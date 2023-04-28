import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"",email:"" ,password:"",cpassword:""})
    let navigate = useNavigate();
    const host = process.env.REACT_APP_API
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const{name,email,password} = credentials;
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({name,email,password})
          });
          const json = await response.json()
          console.log(json);
          if(json.success){
            // save the auth token and redirect
            localStorage.setItem('token', json.authToken)
            navigate("/")
            props.showAlert("Account Created Successful","success")

          }else{
            props.showAlert("Invalid credentials","danger")
          }
    }

    const onChange = (e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
  return (
    <div className='container mt-3'>
      <h2>Create a account</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group my-3">
                <label htmlFor="exampleInputEmail1">Name</label>
                <input type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="emailHelp" placeholder="Enter email"/>
            </div>
            <div className="form-group my-3">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" name='email' onChange={onChange}  aria-describedby="emailHelp" placeholder="Enter email"/>
            </div>
            <div className="form-group my-3">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required placeholder="Password"/>
            </div>
            <div className="form-group my-3">
                <label htmlFor="cpassword">Confirm Password</label>
                <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required placeholder="Confirm Password"/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default Signup