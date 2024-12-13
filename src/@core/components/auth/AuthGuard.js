import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { useAuth } from 'src/hooks/useAuth'

const AuthGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  const { user, loading } = auth

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      if (user === null && !loading && router.asPath !== '/login') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router, router.asPath, user, loading]
  )
  if (loading || user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
