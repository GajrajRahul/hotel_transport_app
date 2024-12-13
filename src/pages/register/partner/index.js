import { useRouter } from 'next/router';
import React from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout';

import Register from 'src/components/Register'

const PartnerRegister = () => {
  const router = useRouter();
  return <Register registerUrl={router.pathname} />
}

PartnerRegister.getLayout = page => <BlankLayout>{page}</BlankLayout>;
PartnerRegister.guestGuard = true;

export default PartnerRegister
