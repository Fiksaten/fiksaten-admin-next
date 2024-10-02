'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useAuth } from '@/components/AuthProvider'
import { ContractorRegisterData, RegisterData } from '../lib/types'

export function RegisterPageComponent() {
  const [userType, setUserType] = useState('consumer')
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phoneNumber: '',
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    businessId: '',
    companyDescription: '',
    companyImageUrl: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const { register } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { firstname,
      lastname,
      email,
      password,
      phoneNumber,
      companyName,
      companyEmail,
      companyPhone,
      businessId,
      companyDescription,
      companyImageUrl } = formData
    const registerData: RegisterData = {
      firstname,
      lastname,
      email,
      password,
      phoneNumber,
    }
    const contractorRegisterData: ContractorRegisterData = {
      companyDescription,
      companyEmail,
      companyImageUrl,
      companyName,
      companyPhone,
      businessId
    }

    register(registerData, userType === "contractor" ? contractorRegisterData : undefined)
    toast({
      title: "Registration Submitted",
      description: `Registered as ${userType}`,
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioGroup defaultValue="consumer" onValueChange={setUserType} className="flex space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="consumer" id="consumer" />
            <Label htmlFor="consumer">Consumer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="contractor" id="contractor" />
            <Label htmlFor="contractor">Contractor</Label>
          </div>
        </RadioGroup>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input id="firstname" name="firstname" required onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input id="lastname" name="lastname" required onChange={handleInputChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required onChange={handleInputChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required onChange={handleInputChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" name="phoneNumber" required onChange={handleInputChange} />
        </div>

        {userType === 'contractor' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" name="companyName" required onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input id="companyEmail" name="companyEmail" type="email" required onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyPhone">Company Phone</Label>
              <Input id="companyPhone" name="companyPhone" required onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessId">Business ID</Label>
              <Input id="businessId" name="businessId" required onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyDescription">Company Description</Label>
              <Textarea id="companyDescription" name="companyDescription" required onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyImageUrl">Company Image URL (Optional)</Label>
              <Input id="companyImageUrl" name="companyImageUrl" onChange={handleInputChange} />
            </div>
          </>
        )}

        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  )
}