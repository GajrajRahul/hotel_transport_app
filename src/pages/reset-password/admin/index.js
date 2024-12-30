import { useRouter } from 'next/router'
import React from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import ResetPassword from 'src/components/ResetPassword'

const AdminResetPassword = () => {
  const router = useRouter()

  return (
    <div>
      <ResetPassword registerUrl={router.pathname} />
    </div>
  )
}

AdminResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
AdminResetPassword.guestGuard = true

export default AdminResetPassword
