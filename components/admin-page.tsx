'use client'

import { useState, useEffect } from 'react'
import { Contractor } from './types'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock function to fetch contractors - replace with actual API call
const fetchContractors = async (): Promise<Contractor[]> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          userId: '1',
          contractorName: 'John Doe Construction',
          contractorDescription: 'Experienced construction company specializing in residential projects.',
          contractorEmail: 'john@doeconstruction.com',
          contractorPhone: '+1234567890',
          contractorImageUrl: '/placeholder.svg?height=100&width=100',
          approvalStatus: 'pending',
          created_at: '2023-06-01T00:00:00Z',
          updated_at: '2023-06-01T00:00:00Z',
        },
        // Add more mock contractors here
      ])
    }, 1000)
  })
}

// Mock function to update contractor status - replace with actual API call
const updateContractorStatus = async (userId: string, status: 'approved' | 'declined'): Promise<void> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Contractor ${userId} ${status}`)
      resolve()
    }, 500)
  })
}

export function AdminPageComponent() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContractors = async () => {
      const data = await fetchContractors()
      setContractors(data)
      setLoading(false)
    }
    loadContractors()
  }, [])

  const handleApproval = async (userId: string, status: 'approved' | 'declined') => {
    await updateContractorStatus(userId, status)
    setContractors(prevContractors => 
      prevContractors.map(contractor => 
        contractor.userId === userId ? { ...contractor, approvalStatus: status } : contractor
      )
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contractor Approval Dashboard</h1>
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractors.map((contractor) => (
            <Card key={contractor.userId}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={contractor.contractorImageUrl} alt={contractor.contractorName} />
                    <AvatarFallback>{contractor.contractorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{contractor.contractorName}</CardTitle>
                    <CardDescription>{contractor.contractorEmail}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">{contractor.contractorDescription}</p>
                <p className="text-sm"><strong>Phone:</strong> {contractor.contractorPhone}</p>
                <p className="text-sm"><strong>Created:</strong> {new Date(contractor.created_at).toLocaleDateString()}</p>
                <Badge variant={contractor.approvalStatus === 'approved' ? 'success' : contractor.approvalStatus === 'declined' ? 'destructive' : 'secondary'} className="mt-2">
                  {contractor.approvalStatus || 'Pending'}
                </Badge>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  onClick={() => handleApproval(contractor.userId, 'approved')} 
                  disabled={contractor.approvalStatus === 'approved'}
                  variant="outline"
                >
                  Approve
                </Button>
                <Button 
                  onClick={() => handleApproval(contractor.userId, 'declined')} 
                  disabled={contractor.approvalStatus === 'declined'}
                  variant="destructive"
                >
                  Decline
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}