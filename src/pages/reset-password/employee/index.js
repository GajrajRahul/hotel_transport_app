import { useRouter } from 'next/router'
import React from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import ResetPassword from 'src/components/ResetPassword'

const EmployeeResetPassword = () => {
  const router = useRouter()

  return (
    <div>
      <ResetPassword registerUrl={router.pathname} />
    </div>
  )
}

EmployeeResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
EmployeeResetPassword.guestGuard = true

export default EmployeeResetPassword
