import { useState } from 'react';
import { loginUser, registerUser, setAuthToken } from '../api';

const Auth = ({ onLoginSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  
  // ✨ 1. PUDHU STATE INGA IRUKKU
  const [showPassword, setShowPassword] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // LOGIN logic
        const { data } = await loginUser({ email: formData.email, password: formData.password });
        localStorage.setItem('token', data.token); 
        setAuthToken(data.token); 
        onLoginSuccess(data.user); 
      } else {
        // REGISTER logic
        await registerUser(formData);
        setMessage('Registration successful! Please login. 🎉');
        setIsLogin(true); // Switch to login screen
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
        
        {message && <p className="auth-message">{message}</p>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input type="text" name="name" placeholder="Your Name" onChange={handleChange} required />
          )}
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          
          {/* ✨ 2. PASSWORD FIELD MAGIC START */}
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              required 
              style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
            />
            <span 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ 
                position: 'absolute', 
                right: '15px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              {showPassword ? "🙈" : "👁️"} 
            </span>
          </div>
          {/* ✨ PASSWORD FIELD MAGIC END */}
          
          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? 'New to FilmFind? ' : 'Already have an account? '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up now.' : 'Sign in.'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;