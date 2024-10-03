"use client"

import { useState } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { buildApiUrl } from "@/app/lib/utils"
import { useRouter } from "next/navigation"

type ContractorRegisterResponse = {
    id: string
    sub: any
    firstname: string
    lastname: string
    email: string
    phoneNumber: string
    expoPushToken: string
    stripeCustomerId: any
    addressStreet: any
    addressDetail: any
    addressZip: any
    addressCountry: any
    badgeCountOffers: number
    badgeCountMessages: number
    role: string
    pushNotificationPermission: boolean
    smsPersmission: boolean
    emailPermission: boolean
    created_at: string
    updated_at: string
    userId: string
    contractorName: string
    contractorDescription: string
    contractorWebsite: string
    contractorEmail: string
    contractorPhone: string
    contractorAddressStreet: string
    contractorAddressDetail: any
    contractorAddressZip: string
    contractorAddressCountry: string
    contractorImageUrl: string
    contractorReviewAverage: string
    contractorReviewCount: number
    contractorVerified: boolean
    contractorBusinessId: any
    contractorCategoryId: string
    contractorHeaderImageUrl: string
    contractorIban: string
    contractorBic: string
    approvalStatus: string
  }

export default function UnauthorizedContractor({contractor}: {contractor: ContractorRegisterResponse }){
    console.log("contractor", contractor)

    const router = useRouter()

    if(contractor.approvalStatus === "approved"){
      router.replace("/contractor/dashboard")
    } 
    const [formData, setFormData] = useState({
        companyName: contractor ? contractor.contractorName : '',
        companyEmail: contractor ? contractor.contractorEmail : '',
        companyPhone: contractor ? contractor.contractorPhone : '',
        businessId: contractor ? contractor.contractorBusinessId : '',
        companyDescription: contractor ? contractor.contractorDescription : '',
      })

      const handleSubmit = async () =>{
        const url = buildApiUrl("users/contractor/request");
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(formData)
        })
        if(!response.ok){
            console.error("failu")
        } 
        console.log("onnistu")
      }
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
      }
    return(
        <div>
            <h1>You are not approved yet. Your details</h1>
            <form onSubmit={handleSubmit} className="space-y-6">

    
        
        
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" value={formData.companyName} name="companyName" required onChange={handleInputChange} />
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

        <Button type="submit" className="w-full">Update request</Button>
      </form>
        </div>
    ) 
}