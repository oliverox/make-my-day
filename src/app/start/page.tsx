"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "~/components/dayPicker";
import { UserComponentWrapper } from "~/components/userComponentWrapper";

export default function NewPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  useEffect(() => {
    const selectedDateLS = window.localStorage.getItem("mmd.selectedDate");
    if (typeof selectedDateLS === "string") {
      setSelectedDate(new Date(selectedDateLS));
    } else {
      setSelectedDate(new Date());
    }
  }, []);

  const onDateSelect = (date: Date | undefined) => {
    if (date) {
      localStorage.setItem("mmd.selectedDate", date.toString());
      setSelectedDate(date);
    }
  };

  return (
    <UserComponentWrapper>
      <DayPicker onDateSelect={onDateSelect} selectedDate={selectedDate} />
    </UserComponentWrapper>
  );
}
