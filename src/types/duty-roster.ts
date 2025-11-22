export interface Personnel {
    id: string
    name: string
    rank?: string
    email?: string
    user_id?: string
}

export interface DutyLocation {
    id: string
    name: string
    time?: string
    order_index: number
    created_at?: string
    updated_at?: string
}

export interface DutyAssignment {
    id: string
    location_id: string
    personnel_id: string
    position_index: number
    assigned_date: string
    created_at?: string
    updated_at?: string
    personnel?: Personnel
}

export interface DutyLocationWithPersonnel extends DutyLocation {
    personnel: Personnel[]
}
