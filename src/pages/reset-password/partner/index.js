import { useRouter } from 'next/router'
import React from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import ResetPassword from 'src/components/ResetPassword'

const PartnerResetPassword = () => {
  const router = useRouter()

  return (
    <div>
      <ResetPassword registerUrl={router.pathname} />
    </div>
  )
}

PartnerResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
PartnerResetPassword.guestGuard = true

export default PartnerResetPassword
