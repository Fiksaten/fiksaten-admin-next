/* eslint-disable @typescript-eslint/no-explicit-any */
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Dictionary } from "@/lib/dictionaries";
import HeadBox from "./HeadBox";

export enum ScheduleOption {
  AsSoonAsPossible = "ASAP",
  Today = "TODAY",
  Tomorrow = "TOMORROW",
  Flexible = "FLEXIBLE",
  inTwoWeeks = "IN_TWO_WEEKS",
}
interface FormData {
  categoryId: string;
  title: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  scheduleOption: ScheduleOption;
  budget: string;
  orderStreet: string;
  orderCity: string;
  orderZip: string;
  locationMoreInfo: string;
  paymentMethod: "later" | "now";
}

export default function Details({
  dict,
  formData,
  handleInputChange,
  handleDateChange,
}: {
  dict: Dictionary;
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleDateChange: (date: Date, name: "startDate" | "endDate") => void;
}) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeadBox dict={dict} title="Palvelun tiedot" description="Tässä osassa voit määrittää palvelun tiedot." imageName="woman-phone-lander"/>
      <div>
        <Label htmlFor="title">Otsikko</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => handleDateChange(date!, "startDate")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {formData.endDate ? (
                  format(formData.endDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => handleDateChange(date!, "endDate")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <Label htmlFor="scheduleOption">Schedule Option</Label>
        <Select
          name="scheduleOption"
          value={formData.scheduleOption}
          onValueChange={(value) =>
            handleInputChange({
              target: { name: "scheduleOption", value },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a schedule option" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ScheduleOption).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
