import React ,{useState} from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
// import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
const Login = () => {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
   // Handle login logic here
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }
    if(!password){
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setError(null);

    //Login api call
    try {
      const response  = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token,role } = response.data;

      if(token){
      localStorage.setItem("token", token);
      updateUser(response.data);
      // Redirect based on role
      if(role === "admin"){
        navigate("/admin/dashboard");
      }else{
        navigate("/user/dashboard");
      }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        // Server responded with a status other than 2xx
        setError(error.response.data.message );
      }else {
        setError("Something went wrong. Please try again." );
      }
      
    }
  }


  return  <AuthLayout> 
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center '>
        <h3 className='text-xl font-semibold text-black'> Welcome back   </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Login to your account to continue
        </p>
        <form onSubmit={handleLogin} >

       <Input 
       value={email}
       onChange={({ target }) => setEmail(target.value)}
       label="Email"
       placeholder="Enter your email"
       type="email"
       />

       <Input 
       value={password}
       onChange={({ target }) => setPassword(target.value)}
       label="Password"
       placeholder="Enter your password"
       type="password"
       />

       {error && <p className='text-red-500 text-xs pb-2.5'> {error} </p>}
       <button type='submit' className='btn-primary '>
        Login
       </button>
        <p className='text-xs text-slate-600 mt-4'>
          Don't have an account? {""}
         <Link className='text-primary underline' to="/signup">
          SignUp
         </Link> 
        </p>
        </form>

      </div>
        </AuthLayout>

}

export default Login