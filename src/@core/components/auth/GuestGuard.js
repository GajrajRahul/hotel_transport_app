import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { useAuth } from 'src/hooks/useAuth'

const GuestGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  const { user, loading } = auth

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (user && !loading) {
      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
      router.replace(redirectURL)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route, user, loading])

  if (loading || user !== null) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
