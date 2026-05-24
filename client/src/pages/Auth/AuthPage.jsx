import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import { Eye, EyeOff, GraduationCap, UserSquare, ShieldAlert } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'faculty', 'admin']),
  department: z.string().optional()
});

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors }, setValue, watch } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'student' }
  });

  const selectedRole = watch('role');

  const onLogin = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      if (res.data.requireOtp) {
        setOtpEmail(data.email);
        setOtpStep(true);
        toast.success(res.data.message);
      } else {
        login(res.data.token, res.data.user);
        toast.success('Logged in successfully!');
        navigate(`/${res.data.user.role}/dashboard`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  const onRegister = async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      setOtpEmail(data.email);
      setOtpStep(true);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  const onVerifyOtp = async () => {
    const otpString = otpCode.join('');
    if (otpString.length !== 6) return toast.error('Please enter a 6-digit OTP');
    try {
      const res = await api.post('/auth/verify-otp', { email: otpEmail, otp: otpString });
      login(res.data.token, res.data.user);
      toast.success('Verified successfully!');
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed');
    }
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);
    if (val && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 transition-all">
        {otpStep ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-sora font-bold text-white text-center">Verify OTP</h2>
            <p className="text-gray-300 text-center text-sm">Enter the 6-digit code sent to {otpEmail}</p>
            <div className="flex justify-between gap-2">
              {otpCode.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, i)}
                  className="w-12 h-12 text-center text-xl bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>
            <button onClick={onVerifyOtp} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">
              Verify
            </button>
            <button onClick={() => setOtpStep(false)} className="w-full text-sm text-gray-400 hover:text-white transition-colors">
              Back to Login
            </button>
          </div>
        ) : (
          <div>
            <div className="flex border-b border-white/20 mb-6">
              <button onClick={() => setIsLogin(true)} className={`flex-1 pb-3 text-center font-medium transition-colors ${isLogin ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}>Login</button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 pb-3 text-center font-medium transition-colors ${!isLogin ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}>Register</button>
            </div>

            {isLogin ? (
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div>
                  <input {...registerLogin('email')} placeholder="Email Address" className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  {loginErrors.email && <p className="text-red-400 text-xs mt-1">{loginErrors.email.message}</p>}
                </div>
                <div className="relative">
                  <input {...registerLogin('password')} type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {loginErrors.password && <p className="text-red-400 text-xs mt-1">{loginErrors.password.message}</p>}
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">Sign In</button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit(onRegister)} className="space-y-4">
                <div className="flex justify-between gap-2 mb-4">
                  <button type="button" onClick={() => setValue('role', 'student')} className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 border ${selectedRole === 'student' ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}><GraduationCap size={20} /><span className="text-xs">Student</span></button>
                  <button type="button" onClick={() => setValue('role', 'faculty')} className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 border ${selectedRole === 'faculty' ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}><UserSquare size={20} /><span className="text-xs">Faculty</span></button>
                  <button type="button" onClick={() => setValue('role', 'admin')} className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 border ${selectedRole === 'admin' ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}><ShieldAlert size={20} /><span className="text-xs">Admin</span></button>
                </div>
                <div>
                  <input {...registerSignup('name')} placeholder="Full Name" className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  {signupErrors.name && <p className="text-red-400 text-xs mt-1">{signupErrors.name.message}</p>}
                </div>
                <div>
                  <input {...registerSignup('email')} placeholder="Email Address" className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  {signupErrors.email && <p className="text-red-400 text-xs mt-1">{signupErrors.email.message}</p>}
                </div>
                <div className="relative">
                  <input {...registerSignup('password')} type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {signupErrors.password && <p className="text-red-400 text-xs mt-1">{signupErrors.password.message}</p>}
                </div>
                {(selectedRole === 'student' || selectedRole === 'faculty') && (
                  <div>
                    <input {...registerSignup('department')} placeholder="Department (e.g. CSE)" className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                )}
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">Create Account</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
