import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isDark, setIsDark] = useState(true);
   const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    designation: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert(`${isSignIn ? 'Sign In' : 'Sign Up'} successful!\nEmail: ${formData.email}`);
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setFormData({
      name: '',
      email: '',
      companyName: '',
      designation: '',
      password: '',
    });
  };

  return (
    <div className={`h-screen transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-10 -left-10 w-72 h-72 ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-10 -right-10 w-72 h-72 ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-full blur-3xl animate-pulse`} style={{animationDelay: '1s'}}></div>
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={() => setIsDark(!isDark)}
        className={`fixed cursor-pointer top-4 right-4 z-50 p-2 rounded-lg backdrop-blur-xl ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition border ${isDark ? 'border-white/20' : 'border-black/20'}`}
      >
        <span className="text-lg ">{isDark ? '☀️' : '🌙'}</span>
      </button>

      {/* Main Auth Container */}
      <div className="relative w-full max-w-4xl mx-auto z-10 h-[90vh] max-h-[650px]">
        <div className="grid md:grid-cols-2 gap-0 backdrop-blur-xl bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-full">
          
          {/* Left Side - Branding */}
          <div className={`p-6 flex flex-col justify-center relative ${isDark ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-200'}`}>
            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center space-x-2 mb-4">
  <div 
    onClick={() => navigate('/')}
    className="w-9 h-9 bg-gradient-to-br from-white to-gray-800 rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
  >
    <span className={`font-bold text-lg ${isDark ? 'text-black' : 'text-white'}`}>S</span>
  </div>
  <div>
    <span 
      onClick={() => navigate('/')}
      className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'} cursor-pointer`}
    >
      SpendDock
    </span>
    <p className={`text-[10px] ${isDark ? 'text-white/60' : 'text-black/60'}`}>AI-Powered Automation</p>
  </div>
</div>

              {/* Heading */}
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-2 leading-tight`}>
                {isSignIn ? 'Welcome Back!' : 'Join SpendDock'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-white/70' : 'text-black/70'} mb-4`}>
                {isSignIn 
                  ? 'Sign in to manage invoices with AI'
                  : 'Start automating invoice processing'
                }
              </p>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {[
                  { icon: '⚡', text: '98% AI Accuracy' },
                  { icon: '🔒', text: 'Secure & Compliant' },
                  { icon: '📊', text: 'Real-time Analytics' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-7 h-7 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/10'} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm">{feature.icon}</span>
                    </div>
                    <div className={`text-xs font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                      {feature.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: '10K+', label: 'Users' },
                  { value: '1M+', label: 'Invoices' },
                  { value: '99.9%', label: 'Uptime' }
                ].map((stat, index) => (
                  <div key={index} className={`p-2 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
                    <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                      {stat.value}
                    </div>
                    <div className={`text-[10px] ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Sliding Forms */}
          <div className={`p-6 relative ${isDark ? 'bg-black/40' : 'bg-white/40'} overflow-hidden`}>
            <div className="relative h-full flex items-center">
              
              {/* SIGN IN FORM */}
              <div 
                className="absolute inset-0 transition-all duration-700 ease-in-out flex items-center"
                style={{
                  transform: isSignIn ? 'translateX(0)' : 'translateX(100%)',
                  opacity: isSignIn ? 1 : 0,
                  pointerEvents: isSignIn ? 'auto' : 'none'
                }}
              >
                <div className="w-full">
                  <div className="mb-4">
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-1`}>
                      Sign In
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      Enter your credentials
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Email */}
                    <div>
                      <label className={`block text-xs font-medium ${isDark ? 'text-white/80' : 'text-black/80'} mb-1`}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@company.com"
                        className={`w-full px-3 py-2 rounded-lg backdrop-blur-xl ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-black/10 border-black/20 text-black placeholder-black/40'} border focus:outline-none focus:ring-1 ${isDark ? 'focus:ring-white/50' : 'focus:ring-black/50'} transition text-xs`}
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className={`block text-xs font-medium ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                          Password
                        </label>
                        <button className={`text-[10px] font-medium ${isDark ? 'text-white hover:text-white/80 cursor-pointer' : 'text-black hover:text-black/80 cursor-pointer'} transition`}>
                          Forgot?
                        </button>
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`w-full px-3 py-2 rounded-lg backdrop-blur-xl ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-black/10 border-black/20 text-black placeholder-black/40'} border focus:outline-none focus:ring-1 ${isDark ? 'focus:ring-white/50' : 'focus:ring-black/50'} transition text-xs`}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      className={`w-full py-2.5 rounded-lg ${isDark ? 'bg-white text-black hover:shadow-xl hover:shadow-white/30 cursor-pointer' : 'bg-black text-white hover:shadow-xl hover:shadow-black/30 cursor-pointer'} font-semibold text-sm transition transform hover:scale-[1.02] mt-1`}
                    >
                      Sign In →
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center my-3">
                    <div className={`flex-1 h-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`}></div>
                    <span className={`px-2 text-[10px] ${isDark ? 'text-white/60' : 'text-black/60'}`}>or</span>
                    <div className={`flex-1 h-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`}></div>
                  </div>

                  {/* Toggle */}
                  <div className="text-center">
                    <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      Don't have an account?{' '}
                      <button
                        onClick={toggleForm}
                        className={`font-semibold pl-1.5 ${isDark ? 'text-white hover:text-white/80 cursor-pointer' : 'text-black hover:text-black/80 cursor-pointer'} transition underline`}
                      >
                        Create Account
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              {/* SIGN UP FORM */}
              <div 
                className="absolute inset-0 transition-all duration-700 ease-in-out flex items-center"
                style={{
                  transform: isSignIn ? 'translateX(-100%)' : 'translateX(0)',
                  opacity: isSignIn ? 0 : 1,
                  pointerEvents: isSignIn ? 'none' : 'auto'
                }}
              >
                <div className="w-full">
                  <div className="mb-3">
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-1`}>
                      Create Account
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      Start automating today
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* Name */}
                    <div>
                      <label className={`block text-xs font-medium ${isDark ? 'text-white/80' : 'text-black/80'} mb-1`}>
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full px-3 py-1.5 rounded-lg backdrop-blur-xl ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-black/10 border-black/20 text-black placeholder-black/40'} border focus:outline-none focus:ring-1 ${isDark ? 'focus:ring-white/50' : 'focus:ring-black/50'} transition text-xs`}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-xs font-medium ${isDark ? 'text-white/80' : 'text-black/80'} mb-1`}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@company.com"
                        className={`w-full px-3 py-1.5 rounded-lg backdrop-blur-xl ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-black/10 border-black/20 text-black placeholder-black/40'} border focus:outline-none focus:ring-1 ${isDark ? 'focus:ring-white/50' : 'focus:ring-black/50'} transition text-xs`}
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className={`block text-xs font-medium ${isDark ? 'text-white/80' : 'text-black/80'} mb-1`}>
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your Company Ltd."
                        className={`w-full px-3 py-1.5 rounded-lg backdrop-blur-xl ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-black/10 border-black/20 text-black placeholder-black/40'} border focus:outline-none focus:ring-1 ${isDark ? 'focus:ring-white/50' : 'focus:ring-black/50'} transition text-xs`}
                      />
                    </div>

                    {/* Designation */}
                    <div>
                      <label className={`block text-xs font-medium ${isDark ? 'text-white/80' : 'text-black/80'} mb-1`}>
                        Designation
                      </label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="Finance Manager"
                        className={`w-full px-3 py-1.5 rounded-lg backdrop-blur-xl ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-black/10 border-black/20 text-black placeholder-black/40'} border focus:outline-none focus:ring-1 ${isDark ? 'focus:ring-white/50' : 'focus:ring-black/50'} transition text-xs`}
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className={`block text-xs font-medium ${isDark ? 'text-white/80' : 'text-black/80'} mb-1`}>
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`w-full px-3 py-1.5 rounded-lg backdrop-blur-xl ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-black/10 border-black/20 text-black placeholder-black/40'} border focus:outline-none focus:ring-1 ${isDark ? 'focus:ring-white/50' : 'focus:ring-black/50'} transition text-xs`}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      className={`w-full py-2.5 rounded-lg ${isDark ? 'bg-white text-black hover:shadow-xl hover:shadow-white/30 cursor-pointer' : 'bg-black text-white hover:shadow-xl hover:shadow-black/30 cursor-pointer'} font-semibold text-sm transition transform hover:scale-[1.02] mt-1`}
                    >
                      Create Account →
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center my-2.5">
                    <div className={`flex-1 h-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`}></div>
                    <span className={`px-2 text-[10px] ${isDark ? 'text-white/60' : 'text-black/60'}`}>or</span>
                    <div className={`flex-1 h-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`}></div>
                  </div>

                  {/* Toggle */}
                  <div className="text-center">
                    <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      Already have an account?{' '}
                      <button
                        onClick={toggleForm}
                        className={`font-semibold  pl-1.5 ${isDark ? 'text-white hover:text-white/80 cursor-pointer' : 'text-black hover:text-black/80 cursor-pointer'} transition underline`}
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}