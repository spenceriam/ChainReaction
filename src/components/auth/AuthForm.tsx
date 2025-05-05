import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../utils/supabase';

interface AuthFormProps {
  type: 'signin' | 'signup';
}

interface FormData {
  email: string;
  password: string;
  username?: string;
}

export function AuthForm({ type }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { email, password, username } = data;
    setLoading(true);
    setMessage(null);

    try {
      if (type === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
            },
          },
        });

        if (error) throw error;
        setMessage('Check your email for the confirmation link');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {type === 'signin' ? 'Sign In' : 'Create Account'}
      </h2>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {type === 'signup' && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              type="text"
              {...register('username')}
            />
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            type="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && (
            <p className="mt-1 text-red-500">{errors.email.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            type="password"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
          />
          {errors.password && (
            <p className="mt-1 text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Processing...' : type === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
} 