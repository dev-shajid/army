export type DriveCategory =
    | 'preci'
    | 'routing-orders'
    | 'sop'
    | 'policy'
    | 'training'
    | 'other'

export interface DriveFile {
    id?: string
    title: string
    fileId: string
    category: DriveCategory
    created_at?: string
}

export const DRIVE_CATEGORIES: DriveCategory[] = [
    'preci',
    'routing-orders',
    'sop',
    'policy',
    'training',
    'other',
]
