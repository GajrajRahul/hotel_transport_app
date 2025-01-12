import { useRouter } from 'next/router'
import React from 'react'

const index = () => {
  const router = useRouter();
  router.push('/book-taxi/add')
  return <div></div>
}

export default index
