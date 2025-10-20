// 'use client'

// import { useAuth } from '@/context/auth-content'
// import React from 'react'

// type ProtectedProps = React.PropsWithChildren<{ isAuthRoute?: boolean }>

// const Protected: React.FC<ProtectedProps> = ({ children, isAuthRoute = false }) => {
//     const { user } = useAuth()

//     if ((!user && !isAuthRoute) || (user && isAuthRoute)) {
        
//         return <div className='text-center mt-12 text-xl'></div>
//     }

//     return <>{children}</>
// }

// export default Protected
