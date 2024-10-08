'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { buildApiUrl } from '../lib/utils';

type EmailFormData = {
  email: string
}

type ResetFormData = {
  code: string
  newPassword: string
}

const emailSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
})

const resetSchema = yup.object({
  code: yup.string().matches(/^\d+$/, "Please enter a valid code").required("Code is required"),
  newPassword: yup.string()
    .matches(/\w*[a-z]\w*/, "Password must contain a lowercase letter")
    .matches(/\w*[A-Z]\w*/, "Password must contain an uppercase letter")
    .matches(/\d/, "Password must contain a number")
    .matches(/[!@#$%^&*]/, "Password must contain a special character")
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
})

export default function ForgotPassword() {
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { register: registerEmail, handleSubmit: handleSubmitEmail, formState: { errors: emailErrors } } = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema)
  })

  const { register: registerReset, handleSubmit: handleSubmitReset, formState: { errors: resetErrors } } = useForm<ResetFormData>({
    resolver: yupResolver(resetSchema)
  })

  const onSubmitEmail = async (data: EmailFormData) => {
    try {
      const response = await fetch(buildApiUrl('/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send reset code')
      }

      setCodeSent(true)
      setError(null)
    } catch (err) {
      setError('Failed to send reset code. Please check your email and try again.')
    }
  }

  const onSubmitReset = async (data: ResetFormData) => {
    const url = buildApiUrl('/auth/reset-password');
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to reset password')
      }

      router.push('/login')
    } catch (err) {
      setError('Failed to reset password. Please check your code and try again.')
    }
  }

  return (
    <div className="container mx-auto max-w-md mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your email to receive a reset code</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!codeSent ? (
            <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...registerEmail('email')}
                  aria-invalid={emailErrors.email ? "true" : "false"}
                />
                {emailErrors.email && (
                  <p className="text-sm text-red-500" role="alert">{emailErrors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">Send Reset Code</Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Reset Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter reset code"
                  {...registerReset('code')}
                  aria-invalid={resetErrors.code ? "true" : "false"}
                />
                {resetErrors.code && (
                  <p className="text-sm text-red-500" role="alert">{resetErrors.code.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  {...registerReset('newPassword')}
                  aria-invalid={resetErrors.newPassword ? "true" : "false"}
                />
                {resetErrors.newPassword && (
                  <p className="text-sm text-red-500" role="alert">{resetErrors.newPassword.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">Reset Password</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}