import { Star, MapPin, Phone, Mail, Globe, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import { Contractor, Review } from '@/app/lib/types'


export default function ContractorReviews({contractor, reviews}: {contractor: Contractor, reviews: Review[]}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="relative w-full h-40 mb-4">
              <Image
                src={contractor.contractorHeaderImageUrl}
                alt="Contractor header"
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                width={100}
                height={100}
              />
            </div>
            <CardTitle className="mt-8">{contractor.contractorName}</CardTitle>
            {contractor.contractorVerified && (
              <Badge variant="secondary" className="mt-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{contractor.contractorDescription}</p>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{`${contractor.contractorAddressStreet}, ${contractor.contractorAddressDetail}, ${contractor.contractorAddressZip}, ${contractor.contractorAddressCountry}`}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>{contractor.contractorPhone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>{contractor.contractorEmail}</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                <a href={contractor.contractorWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {contractor.contractorWebsite}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold mr-2">{contractor.contractorReviewAverage}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(parseFloat(contractor.contractorReviewAverage))
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                ({contractor.contractorReviewCount || 0} reviews)
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.length === 0 || reviews === undefined ? (
                <div className="text-center text-muted-foreground">
                  No reviews yet
                </div>
              ) : (
                <>
                  {reviews?.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{review.reviewTitle}</h3>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.starRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.review}</p>
                  <div className="flex items-center text-sm">
                    <span className="font-medium mr-2">{review.userFirstname}</span>
                    <span className="text-muted-foreground">ZIP: {review.userZip}</span>
                  </div>
                </div>
              ))}
              </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}