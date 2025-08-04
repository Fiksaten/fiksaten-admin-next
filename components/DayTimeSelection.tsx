"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface DayTimeSelectionProps {
  availableDays: string[];
  startTime: string;
  endTime: string;
  onConfirm: (selectedDay: string, selectedTime: string) => void;
  onCancel: () => void;
}

export default function DayTimeSelection({
  availableDays,
  startTime,
  endTime,
  onConfirm,
  onCancel,
}: DayTimeSelectionProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log("DayTimeSelection props:", {
      availableDays,
      startTime,
      endTime,
    });
  }, [availableDays, startTime, endTime]);

  const generateTimeSlots = () => {
    console.log("Generating time slots from", startTime, "to", endTime);

    const slots: string[] = [];

    // Clean the time strings by removing timezone info and seconds
    const cleanStartTime = startTime.split("+")[0].split(".")[0];
    const cleanEndTime = endTime.split("+")[0].split(".")[0];

    console.log("Cleaned times:", cleanStartTime, "to", cleanEndTime);

    // Parse start and end times
    const start = new Date(`2000-01-01T${cleanStartTime}`);
    const end = new Date(`2000-01-01T${cleanEndTime}`);

    console.log("Start time object:", start);
    console.log("End time object:", end);

    // Start from the start time
    const current = new Date(start);

    // Generate slots every 30 minutes until we reach or exceed the end time
    while (current < end) {
      const timeString = current.toTimeString().slice(0, 5);
      slots.push(timeString);
      console.log("Added slot:", timeString);

      // Move to next 30-minute slot
      current.setMinutes(current.getMinutes() + 30);
    }

    console.log("Generated slots:", slots);
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatDay = (day: string) => {
    const date = new Date(day);
    return date.toLocaleDateString("fi-FI", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
    });
  };

  const handleConfirm = () => {
    if (!selectedDay || !selectedTime) {
      alert("Please select both a day and a start time.");
      return;
    }
    onConfirm(selectedDay, selectedTime);
  };

  // If no available days, show a fallback
  if (availableDays.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-yellow-800">
              No available days found. Please check the order configuration.
            </p>
            <p className="text-sm text-yellow-600 mt-2">
              Debug info: availableDays = {JSON.stringify(availableDays)}
            </p>
          </CardContent>
        </Card>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Day ({availableDays.length} available)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {availableDays.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                onClick={() => setSelectedDay(day)}
                className="justify-start"
              >
                {formatDay(day)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Select Start Time ({timeSlots.length} slots)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Available time slots between {startTime.slice(0, 5)} -{" "}
            {endTime.slice(0, 5)}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => setSelectedTime(time)}
                size="sm"
              >
                {time}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          onClick={handleConfirm}
          disabled={!selectedDay || !selectedTime}
        >
          Confirm Selection
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {selectedDay && selectedTime && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-green-800 font-medium">
              Selected: {formatDay(selectedDay)} at {selectedTime}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
