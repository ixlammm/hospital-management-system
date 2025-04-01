"use client"

import { Activity, ArrowDown, ArrowUp, Calendar, DollarSign, Users } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const revenueData = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 2300 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 2800 },
  { name: "Jun", total: 3200 },
  { name: "Jul", total: 3800 },
]

const patientData = [
  { name: "Mon", total: 45 },
  { name: "Tue", total: 38 },
  { name: "Wed", total: 52 },
  { name: "Thu", total: 41 },
  { name: "Fri", total: 35 },
  { name: "Sat", total: 22 },
  { name: "Sun", total: 15 },
]

export function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,853</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" />
                12%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" />
                8%
              </span>{" "}
              from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32/42</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-rose-500 flex items-center">
                <ArrowDown className="mr-1 h-3 w-3" />
                3%
              </span>{" "}
              from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$38,254</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" />
                18%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Patient Visits</CardTitle>
            <CardDescription>Daily patient visits for the current week</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={patientData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest activities in the hospital</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {i === 1 && "Dr. Johnson completed surgery"}
                      {i === 2 && "New patient admitted to Ward B"}
                      {i === 3 && "Lab results updated for Patient #28492"}
                      {i === 4 && "Emergency room capacity at 65%"}
                      {i === 5 && "Staff meeting scheduled for tomorrow"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i === 1 && "2 hours ago"}
                      {i === 2 && "3 hours ago"}
                      {i === 3 && "5 hours ago"}
                      {i === 4 && "6 hours ago"}
                      {i === 5 && "Yesterday at 4:30 PM"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Department Status</CardTitle>
            <CardDescription>Current status of hospital departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Emergency</p>
                  <p className="text-sm font-medium text-rose-500">High</p>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-full w-[85%] rounded-full bg-rose-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Surgery</p>
                  <p className="text-sm font-medium text-amber-500">Medium</p>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-full w-[60%] rounded-full bg-amber-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Pediatrics</p>
                  <p className="text-sm font-medium text-emerald-500">Low</p>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-full w-[35%] rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Cardiology</p>
                  <p className="text-sm font-medium text-amber-500">Medium</p>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-full w-[55%] rounded-full bg-amber-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Neurology</p>
                  <p className="text-sm font-medium text-emerald-500">Low</p>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-full w-[30%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

