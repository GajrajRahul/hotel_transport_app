import { useRouter } from 'next/router'
import React from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout'

import Register from 'src/components/Register'

const EmployeeRegister = () => {
  const router = useRouter()

  return <Register registerUrl={router.pathname} />
}

EmployeeRegister.getLayout = page => <BlankLayout>{page}</BlankLayout>
EmployeeRegister.guestGuard = true

export default EmployeeRegister
