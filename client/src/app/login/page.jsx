"use client";

import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { AuthContext } from '@/context/AuthContext';
import api from '@/api/axios';
import { Eye, EyeOff, GraduationCap, UserSquare, ShieldAlert, ArrowLeft } from 'lucide-react';

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
  const router = useRouter();

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
        router.push(`/${res.data.user.role}/dashboard`);
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
      router.push(`/${res.data.user.role}/dashboard`);
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
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-page)] p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--color-brand-primary)]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[var(--color-brand-accent)]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 z-0" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors z-20 font-medium">
        <ArrowLeft size={18} /> Back to Home
      </Link>

      <div className="w-full max-w-md bg-[var(--color-bg-elevated)] backdrop-blur-xl rounded-2xl border border-[var(--color-border-default)] shadow-2xl p-8 transition-all relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-primary)] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
            C
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Welcome to CampusConnect
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">Log in to your campus operating system</p>
        </div>

        {otpStep ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] text-center">Verify OTP</h2>
            <p className="text-[var(--color-text-secondary)] text-center text-sm">Enter the 6-digit code sent to <span className="font-medium text-[var(--color-text-primary)]">{otpEmail}</span></p>
            <div className="flex justify-between gap-2">
              {otpCode.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, i)}
                  className="w-12 h-12 text-center text-xl font-bold bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all"
                />
              ))}
            </div>
            <button onClick={onVerifyOtp} className="w-full py-3 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white rounded-lg font-semibold transition-colors shadow-sm">
              Verify Account
            </button>
            <button onClick={() => setOtpStep(false)} className="w-full text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              Back to Login
            </button>
          </div>
        ) : (
          <div>
            <div className="flex p-1 bg-[var(--color-bg-subtle)] rounded-lg mb-8">
              <button 
                onClick={() => setIsLogin(true)} 
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isLogin ? 'bg-[var(--color-bg-elevated)] text-[var(--color-brand-primary)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsLogin(false)} 
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isLogin ? 'bg-[var(--color-bg-elevated)] text-[var(--color-brand-primary)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
              >
                Create Account
              </button>
            </div>

            {isLogin ? (
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Email Address</label>
                  <input {...registerLogin('email')} placeholder="student@campus.edu" className="w-full p-3 bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all" />
                  {loginErrors.email && <p className="text-[var(--color-status-danger)] text-xs mt-1.5 font-medium">{loginErrors.email.message}</p>}
                </div>
                <div className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
                    <a href="#" className="text-xs font-medium text-[var(--color-brand-primary)] hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <input {...registerLogin('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full p-3 bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {loginErrors.password && <p className="text-[var(--color-status-danger)] text-xs mt-1.5 font-medium">{loginErrors.password.message}</p>}
                </div>
                <button type="submit" className="w-full py-3 mt-4 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white rounded-lg font-semibold transition-colors shadow-sm flex justify-center items-center gap-2">
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit(onRegister)} className="space-y-4">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Select Role</label>
                <div className="flex gap-2 mb-4">
                  <button type="button" onClick={() => setValue('role', 'student')} className={`flex-1 py-3 rounded-lg flex flex-col items-center justify-center gap-2 border transition-all ${selectedRole === 'student' ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 text-[var(--color-brand-primary)]' : 'border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]'}`}>
                    <GraduationCap size={20} />
                    <span className="text-xs font-medium">Student</span>
                  </button>
                  <button type="button" onClick={() => setValue('role', 'faculty')} className={`flex-1 py-3 rounded-lg flex flex-col items-center justify-center gap-2 border transition-all ${selectedRole === 'faculty' ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 text-[var(--color-brand-primary)]' : 'border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]'}`}>
                    <UserSquare size={20} />
                    <span className="text-xs font-medium">Staff</span>
                  </button>
                  <button type="button" onClick={() => setValue('role', 'admin')} className={`flex-1 py-3 rounded-lg flex flex-col items-center justify-center gap-2 border transition-all ${selectedRole === 'admin' ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 text-[var(--color-brand-primary)]' : 'border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]'}`}>
                    <ShieldAlert size={20} />
                    <span className="text-xs font-medium">Admin</span>
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Full Name</label>
                  <input {...registerSignup('name')} placeholder="Jane Doe" className="w-full p-3 bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all" />
                  {signupErrors.name && <p className="text-[var(--color-status-danger)] text-xs mt-1.5 font-medium">{signupErrors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Email Address</label>
                  <input {...registerSignup('email')} placeholder="jane@campus.edu" className="w-full p-3 bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all" />
                  {signupErrors.email && <p className="text-[var(--color-status-danger)] text-xs mt-1.5 font-medium">{signupErrors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Password</label>
                  <div className="relative">
                    <input {...registerSignup('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full p-3 bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {signupErrors.password && <p className="text-[var(--color-status-danger)] text-xs mt-1.5 font-medium">{signupErrors.password.message}</p>}
                </div>
                {(selectedRole === 'student' || selectedRole === 'faculty') && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Department</label>
                    <input {...registerSignup('department')} placeholder="e.g. Computer Science" className="w-full p-3 bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all" />
                  </div>
                )}
                <button type="submit" className="w-full py-3 mt-6 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white rounded-lg font-semibold transition-colors shadow-sm flex justify-center items-center gap-2">
                  Create Account
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
