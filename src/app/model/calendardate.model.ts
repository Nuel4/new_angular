export class CalendarDate {
  CalendarDateId?: number
  ScheduledDate: string
  PhysicianId: number
  ResourceId: number
  RoomId: number
  DateCreated: string
  CreatedByUserId: number
  DateLastUpdated: string
  LastUpdatedByUserId: number
  UserId: number
  ScheduledSlots: [
    {
      ScheduledSlotId?: number
      CalendarDateId?: number
      AppointmentId: number
      EventDescription: string
      StartTime: string
      EndTime: string
      DateCreated: string
      CreatedByUserId: number
      DateLastUpdated: string
      LastUpdatedByUserId: number
      PhysicianId: number
      UserId: number
    }
  ]
}