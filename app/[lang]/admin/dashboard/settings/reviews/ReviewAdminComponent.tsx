'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { AdminReview } from '@/app/lib/types'
import { buildApiUrl } from '@/app/lib/utils'

type Props = {
  initialReviews: AdminReview[];
  idToken: string
}

export default function Component({ initialReviews, idToken }: Props) {
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const onAccept = async (id: string) => {
    console.log("accepting review", id)
    const url = buildApiUrl(`/admin/reviews/accept`)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ reviewId: id })
    })
    if (response.ok) {
      console.log("review accepted")
    }
  }

  const onDecline = async (id: string) => {
    console.log("declining review", id)
    const url = buildApiUrl(`/admin/reviews/decline`)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${idToken}`
      },
      body: JSON.stringify({ reviewId: id })
    })
    if (response.ok) {
      console.log("review declined")
    }
  }

  const handleAccept = async (id: string) => {
    setLoading(prev => ({ ...prev, [id]: true }))
    await onAccept(id)
    setReviews(prev => prev.map(review => 
      review.id === id ? { ...review, accepted: true } : review
    ))
    setLoading(prev => ({ ...prev, [id]: false }))
  }

  const handleDecline = async (id: string) => {
    setLoading(prev => ({ ...prev, [id]: true }))
    await onDecline(id)
    setReviews(prev => prev.filter(review => review.id !== id))
    setLoading(prev => ({ ...prev, [id]: false }))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Admin Review List</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="truncate">{review.reviewTitle}</span>
                <Badge variant={review.accepted ? "default" : "secondary"}>
                  {review.accepted ? "Accepted" : "Pending"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.starRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-2">{review.review}</p>
              <div className="text-xs text-gray-500">
                <p>By: {review.userFirstname} from {review.userCity}</p>
                <p>Order ID: {review.orderId}</p>
                <p>Date: {new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDecline(review.id)}
                disabled={loading[review.id] || review.accepted}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Decline
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => handleAccept(review.id)}
                disabled={loading[review.id] || review.accepted}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Accept
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}