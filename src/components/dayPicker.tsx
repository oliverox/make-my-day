import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { ChevronRightIcon } from "lucide-react";

export function DayPicker({
  onDateSelect,
  selectedDate,
}: {
  onDateSelect: (d: Date | undefined) => void;
  selectedDate: Date | undefined;
}) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <span>Choose a day to plan</span>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => onDateSelect(new Date())}
        >
          Today
        </Button>
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => onDateSelect(dayjs(new Date()).add(1, "day").toDate())}
        >
          Tomorrow
        </Button>
      </div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={(date) =>
          date < dayjs(new Date()).subtract(1, "day").toDate()
        }
        className="flex h-full rounded-md border bg-white"
        classNames={{
          months:
            "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
          month: "space-y-4 w-full flex flex-col",
          table: "w-full h-full border-collapse space-y-1",
          head_row: "",
          row: "w-full mt-2",
          root: `shadow-lg p-5`,
        }}
      />
      {selectedDate && (
        <Button className="mt-4 flex-1 h-12" asChild>
          <Link href="/group-size">
            <span className="text-lg">
              {dayjs(selectedDate).format("ddd D MMM")}
            </span>
            <ChevronRightIcon className="h-5 w-5" />
          </Link>
        </Button>
      )}
    </div>
  );
}
