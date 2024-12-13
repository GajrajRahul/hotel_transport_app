import { useRouter } from 'next/router'
import React from 'react'

import Register from 'src/components/Register'

const EmployeeRegister = () => {
    const router = useRouter();

  return <Register registerUrl={router.pathname} />
}

export default EmployeeRegister
