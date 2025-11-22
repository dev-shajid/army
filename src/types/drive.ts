export type DriveCategory =
    | 'sop'
    | 'a_or'
    | 'q_or'
    | 'g_or'
    | 'co_officer'
    | 'staff_officer'
    | 'appointment_holders'
    | 'other_sop'
    | 'policy'
    | 'routine_orders'
    | 'preci'

export interface DriveFile {
    id?: string
    title: string
    fileId: string
    category: DriveCategory
    created_at?: string
}