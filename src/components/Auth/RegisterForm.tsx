import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  username: string
}

export function RegisterForm() {
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
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      
      // Add your registration logic here
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Full Name</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button className="w-full" type="submit">
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}