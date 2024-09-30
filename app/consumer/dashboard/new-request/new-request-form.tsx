'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { buildApiUrl } from '@/app/lib/utils'
import { Category } from '@/app/lib/types'

export enum ScheduleOption {
  AsSoonAsPossible = "ASAP",
  Today = "TODAY",
  Tomorrow = "TOMORROW",
  Flexible = "FLEXIBLE",
  inTwoWeeks = "IN_TWO_WEEKS",
}



export default function NewRequestFormComponent({ idToken, categories }: { idToken: string, categories: Category[] }) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())
    console.log('Form submitted', data)
    try {
      const url = buildApiUrl("/orders/create")
      const { 
        title, 
        description, 
        budget,
        attachments, 
        orderCity, 
        orderStreet, 
        orderZip, 
        locationMoreInfo, 
        scheduleOption, 
        categoryName, 
        paymentMethod, 
        categoryId 
      } = data
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          budget,
          attachments,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          orderCity,
          orderStreet,
          orderZip,
          locationMoreInfo,
          scheduleOption,
          categoryName,
          paymentMethod,
          categoryId,
          isDraft: false,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        console.log('Order created', result)
      } else {
        console.error('Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-4">New Request</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>

        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.categoryName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required />
        </div>

        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input id="budget" name="budget" type="number" min="0" step="0.01" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="orderStreet">Street</Label>
          <Input id="orderStreet" name="orderStreet" required />
        </div>

        <div>
          <Label htmlFor="orderCity">City</Label>
          <Input id="orderCity" name="orderCity" required />
        </div>

        <div>
          <Label htmlFor="orderZip">ZIP Code</Label>
          <Input id="orderZip" name="orderZip" required />
        </div>

        <div>
          <Label htmlFor="locationMoreInfo">Additional Location Info</Label>
          <Textarea id="locationMoreInfo" name="locationMoreInfo" />
        </div>

        <div>
          <Label htmlFor="scheduleOption">Schedule Option</Label>
          <Select name="scheduleOption" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a schedule option" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ScheduleOption).map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))} 
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Payment Method</Label>
          <RadioGroup name="paymentMethod" defaultValue="later">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="later" id="later" />
              <Label htmlFor="later">Later</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="now" />
              <Label htmlFor="now">Now</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="images">Images</Label>
          <Input id="images" name="images" type="file" multiple accept="image/*" />
        </div>
      </div>

      <Button type="submit" className="w-full">Submit Request</Button>
    </form>
  )
}