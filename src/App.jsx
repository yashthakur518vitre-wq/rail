import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  TrainFront,
  CalendarDays,
  Users2,
  Wrench,
  GitBranch,
  FileText,
  Bell,
  Settings as SettingsIcon,
  Menu,
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Plus,
  Download,
  MapPin,
  BarChart3,
  Signal,
  Lock,
  Bell as BellIcon,
  User,
  Globe,
} from "lucide-react";

/* ============================= Shared UI ============================= */

function StatCard({ icon: Icon, iconBg, label, value, delta, deltaUp, caption }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-2xl font-semibold text-slate-800">{value}</span>
          {delta && (
            <span className={`flex items-center text-xs font-medium ${deltaUp ? "text-emerald-500" : "text-red-500"}`}>
              {delta}
              {deltaUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{caption}</p>
      </div>
    </div>
  );
}

function Panel({ title, action, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function StatusPill({ status }) {
  const styles = {
    "On Time": "bg-emerald-50 text-emerald-600",
    Running: "bg-blue-50 text-blue-600",
    Delayed: "bg-amber-50 text-amber-600",
    Cancelled: "bg-red-50 text-red-600",
    "In Progress": "bg-blue-50 text-blue-600",
    Pending: "bg-amber-50 text-amber-600",
    Completed: "bg-emerald-50 text-emerald-600",
    Active: "bg-emerald-50 text-emerald-600",
    Blocked: "bg-red-50 text-red-600",
    Maintenance: "bg-amber-50 text-amber-600",
    Resolved: "bg-emerald-50 text-emerald-600",
    Open: "bg-red-50 text-red-600",
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function PriorityLabel({ priority }) {
  const colors = { High: "text-red-500", Medium: "text-amber-500", Low: "text-emerald-500" };
  return <span className={`text-sm font-medium ${colors[priority]}`}>{priority}</span>;
}

function SearchBar({ placeholder = "Search..." }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-64">
      <Search size={16} className="text-slate-400" />
      <input placeholder={placeholder} className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" />
    </div>
  );
}

function PrimaryButton({ children, icon: Icon }) {
  return (
    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function GhostButton({ children, icon: Icon }) {
  return (
    <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function DataTable({ columns, rows, renderCell }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
            {columns.map((c) => (
              <th key={c} className="pb-3 font-medium pr-4 whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-50 last:border-0">
              {columns.map((c) => (
                <td key={c} className="py-3 pr-4 text-slate-600 whitespace-nowrap">
                  {renderCell ? renderCell(c, row) : row[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================= Sample Data ============================= */

const opsData = [
  { time: "00:00", scheduled: 32, running: 12, delayed: 5 },
  { time: "04:00", scheduled: 35, running: 18, delayed: 10 },
  { time: "08:00", scheduled: 78, running: 42, delayed: 18 },
  { time: "12:00", scheduled: 80, running: 45, delayed: 20 },
  { time: "16:00", scheduled: 78, running: 55, delayed: 25 },
  { time: "20:00", scheduled: 80, running: 52, delayed: 24 },
  { time: "24:00", scheduled: 80, running: 48, delayed: 25 },
];

const statusData = [
  { name: "On Time", value: 78, color: "#22C55E" },
  { name: "Delayed", value: 32, color: "#F59E0B" },
  { name: "Cancelled", value: 8, color: "#EF4444" },
  { name: "Running", value: 10, color: "#3B82F6" },
];

const trains = [
  { id: "12301", name: "Rajdhani Express", route: "New Delhi → Howrah", type: "Superfast", status: "On Time", speed: "92 km/h", coaches: 18 },
  { id: "12951", name: "Mumbai Rajdhani", route: "Mumbai → New Delhi", type: "Superfast", status: "On Time", speed: "88 km/h", coaches: 16 },
  { id: "12007", name: "Shatabdi Express", route: "Chennai → Bengaluru", type: "Express", status: "Delayed", speed: "0 km/h", coaches: 12 },
  { id: "22691", name: "Garib Rath Express", route: "Lucknow → Delhi", type: "Express", status: "Running", speed: "76 km/h", coaches: 14 },
  { id: "22416", name: "Vande Bharat Express", route: "Varanasi → New Delhi", type: "Semi-High Speed", status: "On Time", speed: "110 km/h", coaches: 8 },
  { id: "12618", name: "Mangala Express", route: "Ernakulam → Nizamuddin", type: "Superfast", status: "Delayed", speed: "0 km/h", coaches: 20 },
  { id: "12259", name: "Sealdah Duronto", route: "Sealdah → New Delhi", type: "Duronto", status: "Cancelled", speed: "—", coaches: 15 },
];

const schedules = [
  { train: "12301 - Rajdhani Express", departure: "New Delhi", arrival: "Howrah", depTime: "16:55", arrTime: "10:00", days: "Daily" },
  { train: "12951 - Mumbai Rajdhani", departure: "Mumbai Central", arrival: "New Delhi", depTime: "17:00", arrTime: "08:35", days: "Daily" },
  { train: "12007 - Shatabdi Express", departure: "Chennai Central", arrival: "Bengaluru", depTime: "06:00", arrTime: "11:00", days: "Mon-Sat" },
  { train: "22691 - Garib Rath Express", departure: "Lucknow", arrival: "Delhi", depTime: "22:00", arrTime: "05:30", days: "Tue, Thu, Sat" },
  { train: "22416 - Vande Bharat", departure: "Varanasi", arrival: "New Delhi", depTime: "15:00", arrTime: "23:00", days: "Daily except Tue" },
];

const resourceCategories = [
  { label: "Locomotives", used: 45, total: 60, color: "#3B82F6", icon: TrainFront },
  { label: "Coaches", used: 120, total: 150, color: "#22C55E", icon: TrainFront },
  { label: "Crew Members", used: 80, total: 100, color: "#F97316", icon: Users2 },
  { label: "Maintenance Units", used: 25, total: 35, color: "#8B5CF6", icon: Wrench },
];

const crewList = [
  { name: "Ramesh Kumar", role: "Loco Pilot", corridor: "Corridor A1", status: "Active", shift: "Day" },
  { name: "Suresh Yadav", role: "Guard", corridor: "Corridor B2", status: "Active", shift: "Night" },
  { name: "Anita Sharma", role: "Station Master", corridor: "Corridor C3", status: "Active", shift: "Day" },
  { name: "Vikram Singh", role: "Signal Technician", corridor: "Corridor B2", status: "Maintenance", shift: "Day" },
  { name: "Pooja Verma", role: "Loco Pilot", corridor: "Corridor A1", status: "Active", shift: "Night" },
];

const initialMaintenanceTasks = [
  { id: "MT-1024", task: "Track Inspection", asset: "Corridor A1", priority: "High", status: "In Progress", due: "30 Aug 2026" },
  { id: "MT-1025", task: "Signal Maintenance", asset: "Signal S-245", priority: "Medium", status: "Pending", due: "31 Aug 2026" },
  { id: "MT-1026", task: "Engine Check", asset: "Train 12301", priority: "High", status: "In Progress", due: "30 Aug 2026" },
  { id: "MT-1027", task: "Coach Cleaning", asset: "Coach C-12", priority: "Low", status: "Completed", due: "29 Aug 2026" },
  { id: "MT-1028", task: "Brake Inspection", asset: "Train 12951", priority: "High", status: "Pending", due: "01 Sep 2026" },
  { id: "MT-1029", task: "Rail Grinding", asset: "Corridor D4", priority: "Medium", status: "In Progress", due: "02 Sep 2026" },
];

// Cycles a task forward through its workflow: Pending -> In Progress -> Completed
const nextStatus = { Pending: "In Progress", "In Progress": "Completed", Completed: "Pending" };

const corridors = [
  { id: "A1", name: "Corridor A1", route: "Delhi - Kanpur", length: "440 km", trains: 12, status: "Active", signal: "Normal" },
  { id: "B2", name: "Corridor B2", route: "Mumbai - Pune", length: "150 km", trains: 8, status: "Blocked", signal: "Fault" },
  { id: "C3", name: "Corridor C3", route: "Chennai - Bengaluru", length: "360 km", trains: 6, status: "Active", signal: "Normal" },
  { id: "D4", name: "Corridor D4", route: "Kolkata - Bhubaneswar", length: "440 km", trains: 5, status: "Maintenance", signal: "Caution" },
  { id: "E5", name: "Corridor E5", route: "Lucknow - Varanasi", length: "300 km", trains: 4, status: "Active", signal: "Normal" },
];

const reports = [
  { name: "Monthly Punctuality Report", type: "PDF", date: "01 Aug 2026", size: "2.4 MB" },
  { name: "Maintenance Cost Summary", type: "XLSX", date: "28 Jul 2026", size: "1.1 MB" },
  { name: "Corridor Utilization Report", type: "PDF", date: "25 Jul 2026", size: "3.8 MB" },
  { name: "Crew Attendance Log", type: "CSV", date: "20 Jul 2026", size: "540 KB" },
  { name: "Safety Incident Report", type: "PDF", date: "15 Jul 2026", size: "1.9 MB" },
];

const reportChartData = [
  { month: "Mar", onTime: 82 }, { month: "Apr", onTime: 79 }, { month: "May", onTime: 85 },
  { month: "Jun", onTime: 76 }, { month: "Jul", onTime: 81 }, { month: "Aug", onTime: 79 },
];

const allAlerts = [
  { icon: "danger", text: "Signal failure detected on Corridor B2", time: "10:15 AM", severity: "Critical" },
  { icon: "warning", text: "Train 12618 is delayed by 45 minutes", time: "09:50 AM", severity: "Warning" },
  { icon: "info", text: "Maintenance task MT-1024 is due today", time: "09:30 AM", severity: "Info" },
  { icon: "success", text: "Track inspection on Corridor A1 completed", time: "08:45 AM", severity: "Resolved" },
  { icon: "danger", text: "Unauthorized access attempt at Signal S-245", time: "08:10 AM", severity: "Critical" },
  { icon: "warning", text: "Coach C-12 requires cleaning before next trip", time: "07:55 AM", severity: "Warning" },
  { icon: "info", text: "New crew member added to Corridor C3", time: "07:30 AM", severity: "Info" },
];

const alertIcon = {
  danger: <AlertTriangle size={16} className="text-red-500" />,
  warning: <AlertTriangle size={16} className="text-amber-500" />,
  info: <Info size={16} className="text-blue-500" />,
  success: <CheckCircle2 size={16} className="text-emerald-500" />,
};

const navItems = [
  { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { key: "trains", icon: TrainFront, label: "Trains" },
  { key: "schedules", icon: CalendarDays, label: "Schedules" },
  { key: "resources", icon: Users2, label: "Resources" },
  { key: "maintenance", icon: Wrench, label: "Maintenance" },
  { key: "corridors", icon: GitBranch, label: "Corridors" },
  { key: "reports", icon: FileText, label: "Reports" },
  { key: "alerts", icon: Bell, label: "Alerts" },
  { key: "settings", icon: SettingsIcon, label: "Settings" },
];

/* ============================= Pages ============================= */

function DashboardPage({ goTo, maintenanceTasks, cycleTaskStatus, notifications, markAsRead }) {
  const [deptQuery, setDeptQuery] = useState("");
  const filteredDepartures = schedules.filter(
    (d) =>
      d.train.toLowerCase().includes(deptQuery.toLowerCase()) ||
      d.departure.toLowerCase().includes(deptQuery.toLowerCase()) ||
      d.arrival.toLowerCase().includes(deptQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={TrainFront} iconBg="#3B82F6" label="Total Trains" value="128" delta="+5" deltaUp caption="Active on network" />
        <StatCard icon={GitBranch} iconBg="#22C55E" label="Active Corridors" value="32" delta="+2" deltaUp caption="In operation" />
        <StatCard icon={Wrench} iconBg="#8B5CF6" label="Maintenance Tasks" value="18" delta="-2" deltaUp={false} caption="Pending tasks" />
        <StatCard icon={Users2} iconBg="#F59E0B" label="Resources" value="245" delta="+12" deltaUp caption="Available resources" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel title="Train Operations">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={opsData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip />
                <Line type="monotone" dataKey="scheduled" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="running" stroke="#22C55E" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="delayed" stroke="#EF4444" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Train Status Distribution">
          <div className="flex items-center gap-4">
            <div className="w-40 h-40 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={2}>
                    {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold">128</span>
                <span className="text-[11px] text-slate-400">Total</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-500">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel
          title="Upcoming Departures"
          action={
            <button onClick={() => goTo("schedules")} className="text-xs font-medium text-blue-600 hover:text-blue-700">
              View All
            </button>
          }
        >
          <input
            value={deptQuery}
            onChange={(e) => setDeptQuery(e.target.value)}
            placeholder="Search train or route..."
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 mb-3 outline-none placeholder:text-slate-400 focus:border-blue-400"
          />
          <div className="space-y-4">
            {filteredDepartures.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No matching departures</p>
            ) : (
              filteredDepartures.slice(0, 5).map((d) => (
                <div key={d.train} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{d.train}</p>
                    <p className="text-xs text-slate-400 truncate">{d.departure} → {d.arrival}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 shrink-0">{d.depTime}</p>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel
          title="Maintenance Overview"
          action={
            <button onClick={() => goTo("maintenance")} className="text-xs font-medium text-blue-600 hover:text-blue-700">
              View All
            </button>
          }
        >
          <p className="text-xs text-slate-400 mb-2">Click a row to advance its status</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
                  <th className="pb-3 font-medium pr-4">id</th>
                  <th className="pb-3 font-medium pr-4">task</th>
                  <th className="pb-3 font-medium pr-4">asset</th>
                  <th className="pb-3 font-medium pr-4">priority</th>
                  <th className="pb-3 font-medium pr-4">status</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceTasks.slice(0, 4).map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => cycleTaskStatus(r.id)}
                    className="border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50"
                  >
                    <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">{r.id}</td>
                    <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">{r.task}</td>
                    <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">{r.asset}</td>
                    <td className="py-3 pr-4 whitespace-nowrap"><PriorityLabel priority={r.priority} /></td>
                    <td className="py-3 pr-4 whitespace-nowrap"><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel
          title="Alerts & Notifications"
          action={
            <button onClick={() => goTo("alerts")} className="text-xs font-medium text-blue-600 hover:text-blue-700">
              View All
            </button>
          }
        >
          <div className="space-y-4">
            {notifications.slice(0, 4).map((a) => (
              <button
                key={a.id}
                onClick={() => markAsRead(a.id)}
                className={`w-full flex items-start gap-3 text-left transition-opacity ${a.read ? "opacity-50" : ""}`}
              >
                {alertIcon[a.icon]}
                <p className="text-sm text-slate-700 leading-snug flex-1">{a.text}</p>
                <span className="text-xs text-slate-400 shrink-0">{a.time}</span>
                {!a.read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="Resource Availability" action={<button className="text-xs font-medium text-blue-600">View All</button>}>
          <div className="space-y-5">
            {resourceCategories.map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-600">{r.label}</span>
                  <span className="text-sm font-medium text-slate-700">{r.used} / {r.total}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(r.used / r.total) * 100}%`, backgroundColor: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function TrainsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBar placeholder="Search trains by name or number..." />
        <div className="flex gap-3">
          <GhostButton icon={Filter}>Filter</GhostButton>
          <PrimaryButton icon={Plus}>Add Train</PrimaryButton>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <StatCard icon={TrainFront} iconBg="#3B82F6" label="Total Trains" value="128" caption="On network" />
        <StatCard icon={CheckCircle2} iconBg="#22C55E" label="On Time" value="78" caption="60.9% of fleet" />
        <StatCard icon={AlertTriangle} iconBg="#F59E0B" label="Delayed" value="32" caption="25.0% of fleet" />
        <StatCard icon={ArrowDown} iconBg="#EF4444" label="Cancelled" value="8" caption="6.3% of fleet" />
      </div>
      <Panel title="All Trains">
        <DataTable
          columns={["id", "name", "route", "type", "speed", "coaches", "status"]}
          rows={trains}
          renderCell={(c, r) => (c === "status" ? <StatusPill status={r.status} /> : r[c])}
        />
      </Panel>
    </div>
  );
}

function SchedulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBar placeholder="Search by train or route..." />
        <div className="flex gap-3">
          <GhostButton icon={Calendar}>This Week</GhostButton>
          <PrimaryButton icon={Plus}>New Schedule</PrimaryButton>
        </div>
      </div>
      <Panel title="Train Schedules">
        <DataTable
          columns={["train", "departure", "depTime", "arrival", "arrTime", "days"]}
          rows={schedules}
        />
      </Panel>
      <Panel title="Weekly Departure Load">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { day: "Mon", trains: 24 }, { day: "Tue", trains: 30 }, { day: "Wed", trains: 26 },
              { day: "Thu", trains: 32 }, { day: "Fri", trains: 38 }, { day: "Sat", trains: 20 }, { day: "Sun", trains: 18 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip />
              <Bar dataKey="trains" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {resourceCategories.map((r) => (
          <div key={r.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: r.color }}>
                <r.icon size={18} className="text-white" />
              </div>
              <p className="text-sm text-slate-500">{r.label}</p>
            </div>
            <p className="text-2xl font-semibold text-slate-800 mb-2">{r.used} / {r.total}</p>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(r.used / r.total) * 100}%`, backgroundColor: r.color }} />
            </div>
          </div>
        ))}
      </div>
      <Panel title="Crew Roster" action={<PrimaryButton icon={Plus}>Add Member</PrimaryButton>}>
        <DataTable
          columns={["name", "role", "corridor", "shift", "status"]}
          rows={crewList}
          renderCell={(c, r) => (c === "status" ? <StatusPill status={r.status} /> : r[c])}
        />
      </Panel>
    </div>
  );
}

function MaintenancePage({ maintenanceTasks, cycleTaskStatus }) {
  const [query, setQuery] = useState("");
  const columns = [
    { key: "Pending", color: "#F59E0B", nextLabel: "Start" },
    { key: "In Progress", color: "#3B82F6", nextLabel: "Complete" },
    { key: "Completed", color: "#22C55E", nextLabel: "Reopen" },
  ];
  const filtered = maintenanceTasks.filter(
    (t) =>
      t.task.toLowerCase().includes(query.toLowerCase()) ||
      t.asset.toLowerCase().includes(query.toLowerCase()) ||
      t.id.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-64">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search maintenance tasks..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
          />
        </div>
        <PrimaryButton icon={Plus}>New Task</PrimaryButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {columns.map((col) => (
          <div key={col.key} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
              <h3 className="font-semibold text-slate-700 text-sm">{col.key}</h3>
              <span className="text-xs text-slate-400 ml-auto">
                {filtered.filter((t) => t.status === col.key).length}
              </span>
            </div>
            <div className="space-y-3">
              {filtered.filter((t) => t.status === col.key).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No tasks</p>
              ) : (
                filtered.filter((t) => t.status === col.key).map((t) => (
                  <div key={t.id} className="border border-slate-100 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">{t.id}</span>
                      <PriorityLabel priority={t.priority} />
                    </div>
                    <p className="text-sm font-medium text-slate-800">{t.task}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.asset}</p>
                    <p className="text-xs text-slate-400 mt-1">Due {t.due}</p>
                    <button
                      onClick={() => cycleTaskStatus(t.id)}
                      className="mt-2 w-full text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg py-1.5 transition-colors"
                    >
                      {col.nextLabel} →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CorridorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchBar placeholder="Search corridors..." />
        <PrimaryButton icon={Plus}>Add Corridor</PrimaryButton>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {corridors.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                  <MapPin size={16} className="text-blue-600" />
                </div>
                <p className="font-semibold text-slate-800">{c.name}</p>
              </div>
              <StatusPill status={c.status} />
            </div>
            <p className="text-sm text-slate-500 mb-1">{c.route}</p>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-50">
              <span>{c.length}</span>
              <span>{c.trains} trains</span>
              <span className="flex items-center gap-1"><Signal size={12} /> {c.signal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="On-Time Performance Trend">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip />
                <Line type="monotone" dataKey="onTime" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Report Summary">
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={BarChart3} iconBg="#3B82F6" label="Reports Generated" value="42" caption="This month" />
            <StatCard icon={FileText} iconBg="#8B5CF6" label="Scheduled Reports" value="6" caption="Weekly / monthly" />
          </div>
        </Panel>
      </div>
      <Panel title="Recent Reports" action={<PrimaryButton icon={Plus}>Generate Report</PrimaryButton>}>
        <DataTable
          columns={["name", "type", "date", "size"]}
          rows={reports}
          renderCell={(c, r) =>
            c === "name" ? (
              <span className="flex items-center gap-2 text-slate-700 font-medium">
                <FileText size={14} className="text-slate-400" /> {r.name}
              </span>
            ) : c === "date" ? (
              r.date
            ) : c === "size" ? (
              <span className="flex items-center gap-2">
                {r.size}
                <Download size={14} className="text-blue-500 cursor-pointer" />
              </span>
            ) : (
              r[c]
            )
          }
        />
      </Panel>
    </div>
  );
}

function AlertsPage({ notifications, markAsRead, markAllAsRead }) {
  const [filter, setFilter] = useState("All");
  const severityStyle = {
    Critical: "bg-red-50 text-red-600",
    Warning: "bg-amber-50 text-amber-600",
    Info: "bg-blue-50 text-blue-600",
    Resolved: "bg-emerald-50 text-emerald-600",
  };
  const counts = {
    Critical: notifications.filter((n) => n.severity === "Critical").length,
    Warning: notifications.filter((n) => n.severity === "Warning").length,
    Info: notifications.filter((n) => n.severity === "Info").length,
    Resolved: notifications.filter((n) => n.severity === "Resolved").length,
  };
  const filtered = filter === "All" ? notifications : notifications.filter((n) => n.severity === filter);
  const filterTabs = ["All", "Critical", "Warning", "Info", "Resolved"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <StatCard icon={AlertTriangle} iconBg="#EF4444" label="Critical" value={counts.Critical} caption="Needs attention" />
        <StatCard icon={AlertTriangle} iconBg="#F59E0B" label="Warnings" value={counts.Warning} caption="Monitor closely" />
        <StatCard icon={Info} iconBg="#3B82F6" label="Info" value={counts.Info} caption="For awareness" />
        <StatCard icon={CheckCircle2} iconBg="#22C55E" label="Resolved" value={counts.Resolved} caption="Last 24 hours" />
      </div>
      <Panel
        title="All Alerts"
        action={
          <button onClick={markAllAsRead} className="text-xs font-medium text-blue-600 hover:text-blue-700">
            Mark all as read
          </button>
        }
      >
        <div className="flex gap-2 mb-4">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                filter === tab ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No alerts in this category</p>
          ) : (
            filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => markAsRead(a.id)}
                className={`w-full flex items-start gap-3 text-left border-b border-slate-50 last:border-0 pb-4 last:pb-0 transition-opacity ${
                  a.read ? "opacity-50" : ""
                }`}
              >
                {alertIcon[a.icon]}
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-snug">{a.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
                {!a.read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${severityStyle[a.severity]}`}>
                  {a.severity}
                </span>
              </button>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}

function SettingsPage() {
  const sections = [
    {
      icon: User,
      title: "Profile",
      desc: "Manage your account details and password.",
      fields: [
        { label: "Full Name", value: "Admin User" },
        { label: "Email", value: "admin@railblock.ai" },
        { label: "Role", value: "Administrator" },
      ],
    },
    {
      icon: BellIcon,
      title: "Notifications",
      desc: "Choose which alerts you want to receive.",
      toggles: ["Signal failures", "Train delays over 30 min", "Maintenance due reminders", "Weekly summary email"],
    },
    {
      icon: Lock,
      title: "Security",
      desc: "Manage login and access controls.",
      fields: [
        { label: "Two-Factor Authentication", value: "Enabled" },
        { label: "Last Login", value: "30 Aug 2026, 09:12 AM" },
      ],
    },
    {
      icon: Globe,
      title: "System Preferences",
      desc: "Language, timezone and display preferences.",
      fields: [
        { label: "Language", value: "English" },
        { label: "Time Zone", value: "IST (UTC +5:30)" },
        { label: "Date Format", value: "DD MMM YYYY" },
      ],
    },
  ];
  return (
    <div className="space-y-6 max-w-3xl">
      {sections.map((s) => (
        <Panel key={s.title}>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <s.icon size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{s.title}</h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </div>
          </div>
          {s.fields && (
            <div className="space-y-3">
              {s.fields.map((f) => (
                <div key={f.label} className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <span className="text-sm text-slate-500">{f.label}</span>
                  <span className="text-sm font-medium text-slate-700">{f.value}</span>
                </div>
              ))}
            </div>
          )}
          {s.toggles && (
            <div className="space-y-3">
              {s.toggles.map((t, i) => (
                <div key={t} className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <span className="text-sm text-slate-600">{t}</span>
                  <button
                    className={`w-10 h-5.5 h-6 rounded-full relative transition-colors ${i < 2 ? "bg-blue-600" : "bg-slate-200"}`}
                    style={{ width: 40, height: 22 }}
                  >
                    <span
                      className="absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-all"
                      style={{ width: 18, height: 18, left: i < 2 ? 20 : 2, top: 2 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Panel>
      ))}
      <div className="flex justify-end">
        <PrimaryButton>Save Changes</PrimaryButton>
      </div>
    </div>
  );
}

const pageMap = {
  dashboard: { title: "Dashboard", subtitle: "Overview of railway operations", component: DashboardPage },
  trains: { title: "Trains", subtitle: "Manage and monitor all trains", component: TrainsPage },
  schedules: { title: "Schedules", subtitle: "Plan and track train schedules", component: SchedulesPage },
  resources: { title: "Resources", subtitle: "Track locomotives, coaches and crew", component: ResourcesPage },
  maintenance: { title: "Maintenance", subtitle: "Track and manage maintenance tasks", component: MaintenancePage },
  corridors: { title: "Corridors", subtitle: "Monitor corridor status and load", component: CorridorsPage },
  reports: { title: "Reports", subtitle: "Generate and download operational reports", component: ReportsPage },
  alerts: { title: "Alerts", subtitle: "All system alerts and notifications", component: AlertsPage },
  settings: { title: "Settings", subtitle: "Manage your account and preferences", component: SettingsPage },
};

/* ============================= App Shell ============================= */

export default function RailBlockApp() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(
    allAlerts.map((a, i) => ({ ...a, id: i, read: false }))
  );
  const [maintenanceTasks, setMaintenanceTasks] = useState(initialMaintenanceTasks);
  const [now, setNow] = useState(new Date());
  const Current = pageMap[page].component;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Advances a maintenance task to its next workflow stage: Pending -> In Progress -> Completed -> Pending
  const cycleTaskStatus = (id) => {
    setMaintenanceTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus[t.status] } : t))
    );
  };

  const goTo = (key) => setPage(key);

  // Live clock - ticks every second using the real system date/time
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      {/* Backdrop - click to close sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-20"
        />
      )}

      {/* Sidebar - hidden by default, slides in as overlay when menu is clicked */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 shrink-0 bg-[#0B1740] text-white flex flex-col z-30 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <TrainFront size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold leading-tight">RailBlock AI</p>
            <p className="text-[11px] text-slate-400 leading-tight">Railway Management System</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => {
                setPage(key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                page === key ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-500 flex items-center justify-center text-sm font-medium">AU</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">Administrator</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </aside>

      {/* Main content - takes full width, sidebar overlays on top */}
      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-100 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-500 hover:text-slate-800">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">{pageMap[page].title}</h1>
              <p className="text-sm text-slate-400">{pageMap[page].subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Calendar size={16} /> {formattedDate}</span>
            <span className="flex items-center gap-2"><Clock size={16} /> {formattedTime}</span>
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative text-slate-500 hover:text-slate-800"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-9 w-80 bg-white rounded-2xl shadow-lg border border-slate-100 z-30 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <p className="font-semibold text-slate-800 text-sm">Notifications</p>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-8">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`w-full flex items-start gap-3 text-left px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${
                              n.read ? "opacity-50" : ""
                            }`}
                          >
                            {alertIcon[n.icon]}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-700 leading-snug">{n.text}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                            </div>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
                          </button>
                        ))
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setPage("alerts");
                        setNotifOpen(false);
                      }}
                      className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 py-2.5 border-t border-slate-100"
                    >
                      View All Alerts
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          <Current
            goTo={goTo}
            maintenanceTasks={maintenanceTasks}
            cycleTaskStatus={cycleTaskStatus}
            notifications={notifications}
            markAsRead={markAsRead}
            markAllAsRead={markAllAsRead}
          />
          <p className="text-center text-xs text-slate-400 pt-8">© 2026 RailBlock AI. All rights reserved.</p>
        </main>
      </div>
    </div>
  );
}
