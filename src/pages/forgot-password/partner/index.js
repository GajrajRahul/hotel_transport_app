import { useRouter } from 'next/router'
import React from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import ForgotPassword from 'src/components/ForgotPassword'

const PartnerForgotPassword = () => {
  const router = useRouter()
  return (
    <div>
      <ForgotPassword registerUrl={router.pathname} />
    </div>
  )
}

PartnerForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
PartnerForgotPassword.guestGuard = true

export default PartnerForgotPassword
