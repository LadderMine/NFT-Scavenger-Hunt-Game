import React from 'react'
import { LogIn } from "lucide-react";


const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      <div className="w-full max-w-md p-8 rounded-3xl border border-gray-500 backdrop-blur-lg bg-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-pink-400">Welcome Back</h2>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 border border-gray-500 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          />
        </div>
        <div className="mt-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-500 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          />
        </div>
        <button className="w-full mt-6 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-bold flex items-center justify-center space-x-2 hover:opacity-90">
          <span><LogIn /></span>
          <span>Login</span>
        </button>
        <p className="mt-4 text-center font-semibold text-white">
          Need an account? <a href="#" className="text-pink-400 hover:underline">Register</a>
        </p>

      </div>
    </div>
  )
}

export default Login
