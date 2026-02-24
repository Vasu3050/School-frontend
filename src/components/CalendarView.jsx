// src/components/CalendarView.jsx
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { isoDateString } from "../../src/Utils/dateUtilsClient.js"; // small helper we'll create
import { getCalendarMonth } from "../api/calendarApi.js";

/**
 * Props:
 * - academicYearId (required)
 * - onDateClick(dateISO) optional
 */
export default function CalendarView({ academicYearId, onDateClick }) {
  const [events, setEvents] = useState([]);
  const [currentYearMonth, setCurrentYearMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });

  useEffect(() => {
    if (!academicYearId) return;
    fetchMonth(currentYearMonth.year, currentYearMonth.month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academicYearId, currentYearMonth.year, currentYearMonth.month]);

  async function fetchMonth(year, month) {
    try {
      const res = await getCalendarMonth(academicYearId, year, month);
      const payload = res?.data?.data || [];
      const evts = payload.map((p) => ({
        id: p.id,
        title: p.title || p.type,
        start: isoDateString(p.date),
        allDay: true,
        extendedProps: { type: p.type, affectsAttendance: p.affectsAttendance, notes: p.notes },
        className:
          p.type === "holiday" ? "fc-event-holiday" :
          p.type === "half_day" ? "fc-event-halfday" :
          p.type === "working_override" ? "fc-event-working" :
          "fc-event-event",
      }));
      setEvents(evts);
    } catch (err) {
      console.error("fetchMonth calendar error", err);
      setEvents([]);
    }
  }

  function handleDatesSet(info) {
    const y = info.start.getFullYear();
    const m = info.start.getMonth() + 1;
    setCurrentYearMonth({ year: y, month: m });
  }

  function handleDateClick(arg) {
    const dateISO = isoDateString(arg.date);
    if (onDateClick) onDateClick(dateISO);
  }

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        datesSet={handleDatesSet}
        dateClick={handleDateClick}
        height="auto"
      />
      <style jsx>{`
        /* quick theme classes (tailwind will not apply to event elements created by fullcalendar) */
        .fc-event-holiday { background: #f87171 !important; border-color:#ef4444 !important; color: white !important; }
        .fc-event-halfday { background: #facc15 !important; border-color:#f59e0b !important; color: #111 !important; }
        .fc-event-working { background: #34d399 !important; border-color:#10b981 !important; color: #111 !important; }
        .fc-event-event { background: #60a5fa !important; border-color:#3b82f6 !important; color: #111 !important; }
      `}</style>
    </div>
  );
}