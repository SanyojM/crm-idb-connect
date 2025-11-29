"use client";

import DashboardTodo from "./dashboardTodo";
import DashboardAnnouncement from "./dashboardAnnouncement";
import DashboardTodaysFollowUps from "./dashboardTodaysFollowup";
import DashboardTodaysDeadline from "./dashboardTodaysDeadline";

export default function DashboardHome() {
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* My To-do's */}
      <DashboardTodo />

      {/* Announcements */}
      <DashboardAnnouncement />

      {/* Today's Follow Ups */}
      <DashboardTodaysFollowUps />

      {/* Today's Task Deadlines */}
      <DashboardTodaysDeadline />
    </div>
  );
}
