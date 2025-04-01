"use client"

import { ArrowDown, ArrowUp, Download, FileText, Filter, Printer, SlidersHorizontal } from "lucide-react"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const departmentData = [
  { name: "Cardiology", value: 28 },
  { name: "Neurology", value: 22 },
  { name: "Pediatrics", value: 18 },
  { name: "Orthopedics", value: 15 },
  { name: "Emergency", value: 12 },
  { name: "Other", value: 5 },
]

const patientAgeData = [
  { name: "0-18", value: 15 },
  { name: "19-35", value: 25 },
  { name: "36-50", value: 30 },
  { name: "51-65", value: 20 },
  { name: "65+", value: 10 },
]

const monthlyPatientData = [
  { name: "Jan", total: 450 },
  { name: "Feb", total: 520 },
  { name: "Mar", total: 480 },
  { name: "Apr", total: 550 },
  { name: "May", total: 620 },
  { name: "Jun", total: 590 },
  { name: "Jul", total: 650 },
]

const revenueData = [
  { name: "Jan", total: 18500 },
  { name: "Feb", total: 22300 },
  { name: "Mar", total: 19800 },
  { name: "Apr", total: 24400 },
  { name: "May", total: 28800 },
  { name: "Jun", total: 32200 },
  { name: "Jul", total: 38800 },
]

export function ReportsTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">View and analyze hospital performance data</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
            <span className="sr-only">Print</span>
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
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
                <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24 min</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    <ArrowDown className="mr-1 h-3 w-3" />
                    8%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-rose-500 flex items-center">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    3%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
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
                <CardTitle>Patient Admissions</CardTitle>
                <CardDescription>Monthly patient admissions for the current year</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyPatientData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Patient distribution by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#0ea5e9"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Patient Admissions Trend</CardTitle>
                <CardDescription>Monthly patient admissions for the current year</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyPatientData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Patient Age Distribution</CardTitle>
                <CardDescription>Distribution of patients by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={patientAgeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#0ea5e9"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Patient Statistics</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filter</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Customize</span>
                  </Button>
                </div>
              </div>
              <CardDescription>Detailed patient statistics and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Average Length of Stay</p>
                  <p className="text-2xl font-bold">4.2 days</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Readmission Rate</p>
                  <p className="text-2xl font-bold">8.7%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Patient Satisfaction</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">New Patients (Monthly)</p>
                  <p className="text-2xl font-bold">124</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$184,854</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    18%
                  </span>{" "}
                  from last year
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Revenue per Patient</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,245</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    5%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operational Costs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$92,450</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-rose-500 flex items-center">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    7%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$92,404</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    12%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Performance metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Cardiology</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Revenue: $58,450</p>
                      <p className="text-sm font-medium text-emerald-500">+12%</p>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-full w-[85%] rounded-full bg-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Neurology</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Revenue: $42,320</p>
                      <p className="text-sm font-medium text-emerald-500">+8%</p>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-full w-[70%] rounded-full bg-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Pediatrics</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Revenue: $35,780</p>
                      <p className="text-sm font-medium text-emerald-500">+5%</p>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-full w-[60%] rounded-full bg-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Orthopedics</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Revenue: $28,950</p>
                      <p className="text-sm font-medium text-rose-500">-3%</p>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-full w-[50%] rounded-full bg-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Emergency</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Revenue: $19,354</p>
                      <p className="text-sm font-medium text-emerald-500">+15%</p>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-full w-[40%] rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Patient distribution by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#0ea5e9"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

