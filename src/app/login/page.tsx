"use client"
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/Auth/LoginForm';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.auth.login(email, password);
      // login(response.data.jwt, response.data.user);
      router.push('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <LoginForm />
    </div>
  );
}