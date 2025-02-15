'use client'

import { RegisterForm } from '@/components/Auth/RegisterForm'
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  username: string
}
export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      
      const response = await api.auth.register(formData.username, formData.email, formData.password)
      console.log(response,"36")
      login(response?.jwt, {
        id: response?.user.id,
        email: response?.user.email,
        username:response?.user.username
      });
      router.push("/chat");
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <RegisterForm formData={formData} handleSubmit={handleSubmit} handleChange={handleChange} />
    </div>
  )
}