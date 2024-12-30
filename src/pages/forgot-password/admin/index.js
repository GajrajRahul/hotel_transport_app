import React from 'react'
import { useRouter } from 'next/router'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import ForgotPassword from 'src/components/ForgotPassword'

const AdminForgotPassword = () => {
  const router = useRouter()

  return (
    <div>
      <ForgotPassword registerUrl={router.pathname} />
    </div>
  )
}

AdminForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
AdminForgotPassword.guestGuard = true

export default AdminForgotPassword
