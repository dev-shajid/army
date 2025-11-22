'use server'

import { createClient } from '@/supabase/server'
import { isAdmin } from './auth.service'

interface Response<T> {
    success: boolean
    data?: T
    error?: string
}

export interface DutyPerson {
    duty_column: string // 'rp' | 'first' | 'second' | 'third'
    name: string
}

export interface DutyColumn {
    rp: DutyPerson[] // Array of person objects
    first: DutyPerson[]
    second: DutyPerson[]
    third: DutyPerson[]
}

// Get all duty assignments organized by column (ordered by insertion time)
export async function getDutyRoster(): Promise<Response<DutyColumn>> {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('duty_roster')
            .select('*')

        if (error) throw error

        // Organize data by columns in insertion order
        const roster: DutyColumn = {
            rp: [],
            first: [],
            second: [],
            third: []
        }

        data?.forEach((person: DutyPerson) => {
            if (person.duty_column === 'rp') {
                roster.rp.push(person)
            } else if (person.duty_column === 'first') {
                roster.first.push(person)
            } else if (person.duty_column === 'second') {
                roster.second.push(person)
            } else if (person.duty_column === 'third') {
                roster.third.push(person)
            }
        })

        return { success: true, data: roster }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Add a person to a column (appended to end in order)
export async function addPersonToDuty(
    name: string,
    column: 'rp' | 'first' | 'second' | 'third'
): Promise<Response<DutyPerson>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    if (!name.trim()) {
        return { success: false, error: 'Name is required' }
    }

    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('duty_roster')
            .insert({
                name: name.trim(),
                duty_column: column
            })
            .select()
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Update a person's name
export async function updatePersonName(oldName: string, column: string, newName: string): Promise<Response<DutyPerson>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    if (!newName.trim()) {
        return { success: false, error: 'Name is required' }
    }

    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('duty_roster')
            .update({ name: newName.trim() })
            .eq('name', oldName)
            .eq('duty_column', column)
            .select()
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Remove a person by name and column
export async function removePersonFromDuty(name: string, column: string): Promise<Response<null>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('duty_roster')
            .delete()
            .eq('name', name)
            .eq('duty_column', column)

        if (error) throw error
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
