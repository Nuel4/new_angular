export class UserSchedule {
    PhysicianFacilityWeeklyScheduleId?: number;
    FacilityId: number;
    WeekOfMonth: string;
    DayOfWeek?: string;
    StartTime?: any;
    LunchBreakStartTime?: any;
    LunchBreakEndTime?: any;
    EndTime?: any;
    DateCreated: string;
    CreatedByUserId: string;
    DateLastUpdated: string;
    LastUpdatedByUserId: string;
    UserId: number;
    active?: boolean;
}