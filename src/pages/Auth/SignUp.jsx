import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle sign up logic here
  const handleSignUp = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      let profileImageUrl = ''
  
      if(!fullName || fullName.trim().length < 2){
        setError("Please enter a valid fullname (at least 2 characters).");
        setIsLoading(false);
        return;
      }
      if(!validateEmail(email)){
        setError("Please enter a valid email address.");
        setIsLoading(false);
        return;
      }
      if(!password || password.length < 6){
        setError("Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
      }
     
  
      //Sign up api call
      try {
        // Upload profile picture if selected
        if (profilePic) {
          console.log('Uploading profile picture...');
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.data.imageUrl || ''; 
          console.log('Profile picture uploaded:', profileImageUrl);
        }

        // Prepare request data
        const requestData = {
          name: fullName.trim(), 
          email: email.trim().toLowerCase(),
          password,
          profileImageUrl,
          adminInviteToken
        };

        console.log('Sending registration request:', {
          ...requestData,
          password: '[HIDDEN]' // Don't log actual password
        });

        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, requestData);

        console.log('Registration response:', response.data);

        const { token, role } = response.data;
        if(token){
          localStorage.setItem("token", token);
          updateUser(response.data);

          // Redirect based on role
          if(role === "admin"){
            navigate("/admin/dashboard");
          }else{
            navigate("/user/dashboard");
          }
        } else {
          setError("Registration successful but no token received. Please try logging in.");
        }

      } catch (error) {
        console.error('Registration error:', error);
        
        if (error.response) {
          // Server responded with error status
          console.error('Error response:', error.response.data);
          const errorMessage = error.response.data.message || 
                              error.response.data.error || 
                              `Server error (${error.response.status})`;
          setError(errorMessage);
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
          setError("Cannot connect to server. Please check if the server is running.");
        } else {
          // Something else happened
          console.error('Request setup error:', error.message);
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }

  return (
    <AuthLayout>
    <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center '>
      <h3 className='text-xl font-semibold text-black'>
       Create an account 
      </h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
       Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp} >
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input 
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="Enter your full name"
            type="text"
            disabled={isLoading}
          />
          <Input 
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            placeholder="Enter your email"
            type="email"
            disabled={isLoading}
          />

          <Input 
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
            disabled={isLoading}
          />

          <Input 
            value={adminInviteToken}
            onChange={({ target }) => setAdminInviteToken(target.value)}
            label="Admin Invite Token"
            placeholder="Digit code"
            type="text"
            maxLength="7"
            disabled={isLoading}
          />
        </div>
        
        {error && <p className='text-red-500 text-xs pb-2.5'> {error} </p>}
        
        <button 
          type='submit' 
          className='btn-primary'
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign up'}
        </button>
        
        <p className='text-xs text-slate-600 mt-4'>
          Already have an account? {""}
          <Link className='text-primary underline' to="/login">
            Login
          </Link> 
        </p>
      </form>
    </div>
    </AuthLayout>
  );
}

export default SignUp