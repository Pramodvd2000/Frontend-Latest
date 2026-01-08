import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styled from "styled-components";

const CalendarContainer = styled.div`
  max-width: 1800px;
  margin: auto;
  padding: 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

function Calendar() {
  return (
    <CalendarContainer>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={"auto"}
        editable={true}
        selectable={true}
        eventBackgroundColor="#007bff"
        eventBorderColor="#0056b3"
        dayMaxEventRows={2}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        }}
        contentHeight="auto"
      />
    </CalendarContainer>
  );
}

export default Calendar;