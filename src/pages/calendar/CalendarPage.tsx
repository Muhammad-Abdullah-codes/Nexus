import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Clock,
  Video,
  Check,
  X,
  Calendar as CalendarIcon,
  User,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

// Initial Mock Data with different statuses
const initialMeetings = [
  {
    id: 1,
    title: "Seed Funding Pitch",
    time: "10:00 AM",
    date: new Date(),
    type: "Investor Meeting",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Product Demo Review",
    time: "2:30 PM",
    date: new Date(),
    type: "Internal",
    status: "confirmed",
  },
  {
    id: 3,
    title: "Intro Call with Michael R.",
    time: "4:00 PM",
    date: new Date(),
    type: "Networking",
    status: "pending", // Requires Accept/Decline
  },
];

export const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [meetings, setMeetings] = useState(initialMeetings);
  const [isScheduling, setIsScheduling] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState("");

  // Filter meetings for the currently selected date (Mock logic just shows all for now to keep it populated)
  // In a real app, you would filter `meetings` based on `date`.

  const handleAccept = (id: number) => {
    setMeetings(
      meetings.map((m) => (m.id === id ? { ...m, status: "confirmed" } : m)),
    );
  };

  const handleDecline = (id: number) => {
    setMeetings(meetings.filter((m) => m.id !== id));
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingTitle.trim()) return;

    const newMeeting = {
      id: Date.now(),
      title: newMeetingTitle,
      time: "TBD", // Mocking the time for simplicity
      date: date,
      type: "User Scheduled",
      status: "confirmed",
    };

    setMeetings([...meetings, newMeeting]);
    setIsScheduling(false);
    setNewMeetingTitle("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Schedule & Meetings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your availability and upcoming calls.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Column */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <style>
            {`
    .react-calendar {
      width: 100%;
      border: none;
      background: #172554;
      color: white;
      font-family: inherit;
      padding: 20px;
      border-radius: 16px;
    }

    /* Navigation */
    .react-calendar__navigation {
      margin-bottom: 20px;
    }

    .react-calendar__navigation button {
      color: white;
      background: transparent;
      min-width: 44px;
      font-size: 18px;
      border-radius: 10px;
    }

    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
      background: #1e3a8a;
    }

    /* Weekday row */
    .react-calendar__month-view__weekdays {
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 600;
      color: #93c5fd;
      margin-bottom: 10px;
    }

    .react-calendar__month-view__weekdays abbr {
      text-decoration: none;
    }

    /* Calendar tiles */
    .react-calendar__tile {
      background: transparent;
      color: #e5e7eb;
      border-radius: 12px;
      padding: 14px 6px;
      transition: all 0.2s ease;
    }

    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
      background: #1e40af;
    }

    /* Selected day */
    .react-calendar__tile--active {
      background: #2563eb !important;
      color: white !important;
    }

    /* Today */
    .react-calendar__tile--now {
      background: rgba(37, 99, 235, 0.25);
      color: #60a5fa;
    }

    /* Neighbor month dates */
    .react-calendar__month-view__days__day--neighboringMonth {
      color: #64748b;
    }
  `}
          </style>
          <Calendar
            onChange={(val) => setDate(val as Date)}
            value={date}
            className="w-full"
          />
        </div>

        {/* Meetings Sidebar Column */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </h2>
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
              {meetings.length} Events
            </span>
          </div>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {meetings.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <CalendarIcon size={32} className="mx-auto mb-2 opacity-50" />
                <p>No meetings scheduled for this day.</p>
              </div>
            ) : (
              meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    meeting.status === "pending"
                      ? "border-yellow-600/30 bg-yellow-900/10 dark:border-yellow-700/50"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {meeting.title}
                    </h3>
                    {meeting.status === "pending" && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 gap-2">
                    <Clock size={14} />
                    <span>{meeting.time}</span>
                  </div>

                  {meeting.status === "pending" ? (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/20"
                        onClick={() => handleDecline(meeting.id)}
                      >
                        <X size={14} className="mr-1" /> Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAccept(meeting.id)}
                      >
                        <Check size={14} className="mr-1" /> Accept
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full">
                        {meeting.type}
                      </span>
                      <button className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        <Video size={14} /> Join Call
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Inline Scheduling Form Mockup */}
          {isScheduling ? (
            <form
              onSubmit={handleScheduleSubmit}
              className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in"
            >
              <input
                type="text"
                placeholder="Meeting Title..."
                value={newMeetingTitle}
                onChange={(e) => setNewMeetingTitle(e.target.value)}
                className="w-full text-sm p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsScheduling(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  disabled={!newMeetingTitle.trim()}
                >
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsScheduling(true)}
              className="w-full mt-4 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Clock size={18} /> Schedule New Meeting
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
