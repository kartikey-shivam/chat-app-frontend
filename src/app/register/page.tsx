'use client'

import { RegisterForm } from '@/components/Auth/RegisterForm'
import Link from 'next/link'
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <RegisterForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
  </p>
</div>
  )
}