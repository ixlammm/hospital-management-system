"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, Download, Filter, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useDatabase } from "@/lib/database"
import { useI18n } from "@/lib/i18n"
import { Skeleton } from "../ui/skeleton"
import { toast } from "@/hooks/use-toast"

export function RoomsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const database = useDatabase()
  const { t } = useI18n()
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)

  const [newRoom, setNewRoom] = useState({
    name: "",
    floor: "1st",
    type: "general",
    beds: 2,
    status: "available",
    equipment: "",
    notes: "",
    patientId: null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewRoom((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (field: string, value: any) => {
    setNewRoom((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddRoom = async () => {
    // Here you would typically send this data to your backend
    console.log("Adding new room:", newRoom)

    // Add the patient to the database
    await database.doAddRoom(newRoom)

    toast({
      title: t("patients.addSuccess"),
      description: t("patients.addSuccessMessage"),
    })

    // For demo purposes, we'll just close the dialog
    setDialogOpen(false)

    // Reset the form
    setNewRoom({
      name: "",
      floor: "1st",
      type: "general",
      beds: 2,
      status: "available",
      equipment: "",
      notes: "",
      patientId: null
    })
  }

  const filteredRooms = database.rooms.data.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.patient && room.patient.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Calculate occupancy statistics
  const totalRooms = database.rooms.data.length
  const occupiedRooms = database.rooms.data.filter((room) => room.status === "Occupied").length
  const availableRooms = database.rooms.data.filter((room) => room.status === "Available").length
  const maintenanceRooms = database.rooms.data.filter((room) => room.status === "Maintenance").length

  const occupiedPercentage = Math.round((occupiedRooms / totalRooms) * 100)
  const availablePercentage = Math.round((availableRooms / totalRooms) * 100)
  const maintenancePercentage = Math.round((maintenanceRooms / totalRooms) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Rooms & Beds</h2>
          <Badge variant="outline" className="ml-2">
            {database.rooms.data.length} total
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="outline">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-3.5 w-3.5" />
                <span>Add Room</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>Enter room details to add a new room to the system.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("rooms.name")}</Label>
                    <Input
                      id="name"
                      placeholder="e.g., 101, 202, etc."
                      value={newRoom.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">{t("rooms.floor")}</Label>
                    <Select value={newRoom.floor} onValueChange={(value) => handleSelectChange("floor", value)}>
                      <SelectTrigger id="floor">
                        <SelectValue placeholder="Select floor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st Floor</SelectItem>
                        <SelectItem value="2nd">2nd Floor</SelectItem>
                        <SelectItem value="3rd">3rd Floor</SelectItem>
                        <SelectItem value="4th">4th Floor</SelectItem>
                        <SelectItem value="5th">5th Floor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">{t("rooms.type")}</Label>
                    <Select value={newRoom.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">{t("rooms.general")}</SelectItem>
                        <SelectItem value="private">{t("rooms.private")}</SelectItem>
                        <SelectItem value="icu">{t("rooms.icu")}</SelectItem>
                        <SelectItem value="maternity">{t("rooms.maternity")}</SelectItem>
                        <SelectItem value="pediatric">{t("rooms.pediatric")}</SelectItem>
                        <SelectItem value="operating">{t("rooms.operatingRoom")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beds">{t("rooms.beds")}</Label>
                    <Select value={newRoom.beds.toString()} onValueChange={(value) => handleSelectChange("beds", parseInt(value))}>
                      <SelectTrigger id="beds">
                        <SelectValue placeholder="Select number of beds" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Bed</SelectItem>
                        <SelectItem value="2">2 Beds</SelectItem>
                        <SelectItem value="3">3 Beds</SelectItem>
                        <SelectItem value="4">4 Beds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">{t("rooms.status")}</Label>
                  <Select value={newRoom.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">{t("rooms.available")}</SelectItem>
                      <SelectItem value="maintenance">{t("rooms.maintenance")}</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment">{t("rooms.equipment")}</Label>
                  <Textarea
                    id="equipment"
                    placeholder="List any special equipment in the room"
                    value={newRoom.equipment}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">{t("rooms.notes")}</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional notes"
                    value={newRoom.notes}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleAddRoom}>{t("rooms.addRoom")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="border-[#E5E7EB] shadow-sm py-0 gap-0">
            <CardHeader className="p-4 border-b border-[#E5E7EB] gap-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search rooms..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px] h-8">
                      <SelectValue placeholder="Room Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="icu">ICU</SelectItem>
                      <SelectItem value="maternity">Maternity</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">View</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Beds</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Patient</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    database.patients.loading ?
                      new Array(4).fill(0).map((_, index) => (
                        <TableRow key={index}>
                          {
                            new Array(7).fill(0).map((_, index) => (
                              <TableCell key={index} className="table-cell">
                                <Skeleton className="h-4 w-full" />
                              </TableCell>
                            ))
                          }
                        </TableRow>
                      ))
                      :
                      filteredRooms.map((room) => (
                        <TableRow key={room.name}>
                          <TableCell className="font-medium">{room.name}</TableCell>
                          <TableCell>{room.type}</TableCell>
                          <TableCell>{room.floor}</TableCell>
                          <TableCell>{room.beds}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                room.status === "Available"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : room.status === "Occupied"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }
                            >
                              {room.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{room.patient?.name || "—"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View details</DropdownMenuItem>
                                <DropdownMenuItem>Assign patient</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Mark as unavailable</DropdownMenuItem>
                                <DropdownMenuItem>Schedule maintenance</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Summary</CardTitle>
              <CardDescription>Current room and bed occupancy status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Total Rooms</div>
                    <div className="text-sm font-medium">{totalRooms}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Occupied</div>
                    <div className="text-sm font-medium">
                      {occupiedRooms} ({occupiedPercentage}%)
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Available</div>
                    <div className="text-sm font-medium">
                      {availableRooms} ({availablePercentage}%)
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Maintenance</div>
                    <div className="text-sm font-medium">
                      {maintenanceRooms} ({maintenancePercentage}%)
                    </div>
                  </div>
                </div>

                <div className="h-4 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="flex h-full">
                    <div className="h-full bg-primary" style={{ width: `${occupiedPercentage}%` }}></div>
                    <div className="h-full bg-green-500" style={{ width: `${availablePercentage}%` }}></div>
                    <div className="h-full bg-yellow-500" style={{ width: `${maintenancePercentage}%` }}></div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="text-sm font-medium">Room Types</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs">General</div>
                      <div className="text-xs font-medium">{database.rooms.data.filter((r) => r.type === "General").length}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">Private</div>
                      <div className="text-xs font-medium">{database.rooms.data.filter((r) => r.type === "Private").length}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">ICU</div>
                      <div className="text-xs font-medium">{database.rooms.data.filter((r) => r.type === "ICU").length}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs">Maternity</div>
                      <div className="text-xs font-medium">{database.rooms.data.filter((r) => r.type === "Maternity").length}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="text-sm font-medium">Floor Occupancy</div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-xs">1st Floor</div>
                        <div className="text-xs font-medium">
                          {database.rooms.data.filter((r) => r.floor === "1st Floor" && r.status === "Occupied").length}/
                          {database.rooms.data.filter((r) => r.floor === "1st Floor").length}
                        </div>
                      </div>
                      <Progress
                        value={
                          (database.rooms.data.filter((r) => r.floor === "1st Floor" && r.status === "Occupied").length /
                            Math.max(1, database.rooms.data.filter((r) => r.floor === "1st Floor").length)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-xs">2nd Floor</div>
                        <div className="text-xs font-medium">
                          {database.rooms.data.filter((r) => r.floor === "2nd Floor" && r.status === "Occupied").length}/
                          {database.rooms.data.filter((r) => r.floor === "2nd Floor").length}
                        </div>
                      </div>
                      <Progress
                        value={
                          (database.rooms.data.filter((r) => r.floor === "2nd Floor" && r.status === "Occupied").length /
                            Math.max(1, database.rooms.data.filter((r) => r.floor === "2nd Floor").length)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-xs">3rd Floor</div>
                        <div className="text-xs font-medium">
                          {database.rooms.data.filter((r) => r.floor === "3rd Floor" && r.status === "Occupied").length}/
                          {database.rooms.data.filter((r) => r.floor === "3rd Floor").length}
                        </div>
                      </div>
                      <Progress
                        value={
                          (database.rooms.data.filter((r) => r.floor === "3rd Floor" && r.status === "Occupied").length /
                            Math.max(1, database.rooms.data.filter((r) => r.floor === "3rd Floor").length)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

