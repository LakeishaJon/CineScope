import React, { useState } from 'react';
import { Film } from 'lucide-react';

export default function LoginPage({ onLogin, onBack }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-8" 
      style={{ background: 'linear-gradient(135deg, #0C0C0F 0%, #1A1A1D 50%, #2D1A1F 100%)' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(135deg, #D72638, #FFB400)' }}></div>
              <Film className="absolute inset-0 m-auto text-white" size={28} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: '#A0A3A8' }}>
            {isRegister ? 'Join CineScope to save your favorites' : 'Sign in to continue to CineScope'}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2 text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 transition"
              style={{ 
                background: '#1A1A1D',
                border: '1px solid rgba(160, 163, 168, 0.25)'
              }}
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-white mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 transition"
              style={{ 
                background: '#1A1A1D',
                border: '1px solid rgba(160, 163, 168, 0.25)'
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #FFB400, #D72638)',
              color: '#0C0C0F'
            }}
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </div>

        {/* Toggle Login/Register */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm transition"
            style={{ color: '#A0A3A8' }}
          >
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <span style={{ color: '#FFB400' }} className="font-semibold">
              {isRegister ? 'Login' : 'Register'}
            </span>
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full mt-4 py-3 rounded-lg font-medium transition"
          style={{ 
            border: '1px solid rgba(160, 163, 168, 0.25)',
            color: '#A0A3A8'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}