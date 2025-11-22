'use server'

import { createClient } from '@/supabase/server'
import { DutyLocation, Personnel, DutyAssignment, DutyLocationWithPersonnel } from '@/types/duty-roster'
import { isAdmin } from './auth.service'

interface Response<T> {
    success: boolean
    data?: T
    error?: string
}

// Get all duty locations with assigned personnel
export async function getDutyRoster(): Promise<Response<DutyLocationWithPersonnel[]>> {
    const supabase = await createClient()

    try {
        // Get all duty locations
        const { data: locations, error: locationsError } = await supabase
            .from('duty_locations')
            .select('*')
            .order('order_index', { ascending: true })

        if (locationsError) throw locationsError

        // Get all assignments with personnel details
        const { data: assignments, error: assignmentsError } = await supabase
            .from('duty_assignments')
            .select(`
        *,
        personnel:personnel_id (*)
      `)
            .order('position_index', { ascending: true })

        if (assignmentsError) throw assignmentsError

        // Combine locations with their personnel
        const roster: DutyLocationWithPersonnel[] = (locations || []).map((location) => ({
            ...location,
            personnel: (assignments || [])
                .filter((a: any) => a.location_id === location.id)
                .sort((a: any, b: any) => a.position_index - b.position_index)
                .map((a: any) => a.personnel)
        }))

        return { success: true, data: roster }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Get all personnel (for admin to assign)
export async function getAllPersonnel(): Promise<Response<Personnel[]>> {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('personnel')
            .select('*')
            .order('name', { ascending: true })

        if (error) throw error

        return { success: true, data: data || [] }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Create a new duty location (admin only)
export async function createDutyLocation(
    location: Omit<DutyLocation, 'id' | 'created_at' | 'updated_at'>
): Promise<Response<DutyLocation>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('duty_locations')
            .insert(location)
            .select()
            .single()

        if (error) throw error

        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Update duty location (admin only)
export async function updateDutyLocation(
    id: string,
    updates: Partial<Omit<DutyLocation, 'id' | 'created_at' | 'updated_at'>>
): Promise<Response<DutyLocation>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('duty_locations')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Delete duty location (admin only)
export async function deleteDutyLocation(id: string): Promise<Response<null>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()

    try {
        // Delete all assignments for this location first
        await supabase
            .from('duty_assignments')
            .delete()
            .eq('location_id', id)

        const { error } = await supabase
            .from('duty_locations')
            .delete()
            .eq('id', id)

        if (error) throw error

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Assign personnel to a duty location (admin only)
export async function assignPersonnel(
    locationId: string,
    personnelId: string,
    positionIndex: number,
    assignedDate: string = new Date().toISOString().split('T')[0]
): Promise<Response<DutyAssignment>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()

    try {
        // Check if person is already assigned to this location at this position
        const { data: existing } = await supabase
            .from('duty_assignments')
            .select('id')
            .eq('location_id', locationId)
            .eq('position_index', positionIndex)
            .single()

        if (existing) {
            // Update existing assignment
            const { data, error } = await supabase
                .from('duty_assignments')
                .update({ personnel_id: personnelId, assigned_date: assignedDate })
                .eq('id', existing.id)
                .select()
                .single()

            if (error) throw error
            return { success: true, data }
        } else {
            // Create new assignment
            const { data, error } = await supabase
                .from('duty_assignments')
                .insert({
                    location_id: locationId,
                    personnel_id: personnelId,
                    position_index: positionIndex,
                    assigned_date: assignedDate
                })
                .select()
                .single()

            if (error) throw error
            return { success: true, data }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Remove personnel from duty location (admin only)
export async function removePersonnelAssignment(
    assignmentId: string
): Promise<Response<null>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('duty_assignments')
            .delete()
            .eq('id', assignmentId)

        if (error) throw error

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Remove personnel from specific position (admin only)
export async function removePersonnelFromPosition(
    locationId: string,
    positionIndex: number
): Promise<Response<null>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('duty_assignments')
            .delete()
            .eq('location_id', locationId)
            .eq('position_index', positionIndex)

        if (error) throw error

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Create a new personnel record (admin only)
export async function createPersonnel(
    personnel: Omit<Personnel, 'id'>
): Promise<Response<Personnel>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('personnel')
            .insert(personnel)
            .select()
            .single()

        if (error) throw error

        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Update personnel record (admin only)
export async function updatePersonnel(
    id: string,
    updates: Partial<Omit<Personnel, 'id'>>
): Promise<Response<Personnel>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('personnel')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Delete personnel record (admin only)
export async function deletePersonnel(id: string): Promise<Response<null>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()

    try {
        // First delete all assignments
        await supabase
            .from('duty_assignments')
            .delete()
            .eq('personnel_id', id)

        const { error } = await supabase
            .from('personnel')
            .delete()
            .eq('id', id)

        if (error) throw error

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
