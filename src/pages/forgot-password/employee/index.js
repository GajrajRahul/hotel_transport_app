import { useRouter } from 'next/router'
import React from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import ForgotPassword from 'src/components/ForgotPassword'

const EmployeeForgotPassword = () => {
  const router = useRouter()

  return (
    <div>
      <ForgotPassword registerUrl={router.pathname} />
    </div>
  )
}

EmployeeForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
EmployeeForgotPassword.guestGuard = true

export default EmployeeForgotPassword
