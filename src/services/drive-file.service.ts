"use server"

import { createClient } from '@/supabase/server'
import { isAdmin } from '@/services/auth.service'
import type { DriveCategory, DriveFile } from '@/types/drive'

interface Response<T> {
    success: boolean
    data?: T
    error?: string
}

export async function listDriveFiles(category: DriveCategory): Promise<Response<DriveFile[]>> {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase
            .from('drive_file')
            .select('id, title, file_id, category, created_at')
            .eq('category', category)
            .order('created_at', { ascending: true })

        if (error) throw error

        const files: DriveFile[] = (data || []).map((row: any) => ({
            id: row.id,
            title: row.title,
            fileId: row.file_id,
            category: row.category,
            created_at: row.created_at,
        }))

        return { success: true, data: files }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function addDriveFile(input: { title: string; fileId: string; category: DriveCategory }): Promise<Response<DriveFile>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()
    try {
        const { data, error } = await supabase
            .from('drive_file')
            .insert({ title: input.title.trim(), file_id: input.fileId.trim(), category: input.category })
            .select('id, title, file_id, category, created_at')
            .single()

        if (error) throw error

        const file: DriveFile = {
            id: data.id,
            title: data.title,
            fileId: data.file_id,
            category: data.category,
            created_at: data.created_at,
        }
        return { success: true, data: file }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function updateDriveFile(input: { id: string; title: string; fileId: string }): Promise<Response<DriveFile>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()
    try {
        const { data, error } = await supabase
            .from('drive_file')
            .update({ title: input.title.trim(), file_id: input.fileId.trim() })
            .eq('id', input.id)
            .select('id, title, file_id, category, created_at')
            .single()

        if (error) throw error

        const file: DriveFile = {
            id: data.id,
            title: data.title,
            fileId: data.file_id,
            category: data.category,
            created_at: data.created_at,
        }
        return { success: true, data: file }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function deleteDriveFile(id: string): Promise<Response<null>> {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const supabase = await createClient()
    try {
        const { error } = await supabase
            .from('drive_file')
            .delete()
            .eq('id', id)

        if (error) throw error
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function searchDriveFiles(query: string): Promise<Response<DriveFile[]>> {
  try {
    if (!query || query.trim().length === 0) {
      return { success: true, data: [] }
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('drive_file')
      .select('id, title, file_id, category, created_at')
      .ilike('title', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        error: error.message,
        data: [],
      }
    }

    // Transform the response to match DriveFile interface
    const transformedData: DriveFile[] = (data || []).map((file: any) => ({
      id: file.id,
      fileId: file.file_id, // Convert snake_case to camelCase
      title: file.title,
      category: file.category,
      createdAt: file.created_at,
    }))

    return {
      success: true,
      data: transformedData,
    }
  } catch (error) {
    console.error('Search error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
      data: [],
    }
  }
}
