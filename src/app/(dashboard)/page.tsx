import { getCurrentUser } from '@/services/auth.service'
import React from 'react'

export default async function HomePage() {

  const user = await getCurrentUser()
  console.log('Current User:', user)
  return (
    <>
      <div>HomePage</div>
      {JSON.stringify(user, null, 2)}
    </>
  )
}
