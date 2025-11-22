export type DriveCategory =
    | 'sop'
    | 'a_officer'
    | 'a_jco'
    | 'a_or'
    | 'q_officer'
    | 'q_jco'
    | 'q_or'
    | 'g_officer'
    | 'g_jco'
    | 'g_or'
    | 'co_officer'
    | 'staff_officer'
    | 'branch_clerk'
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