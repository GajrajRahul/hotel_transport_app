import { createContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { useRouter } from 'next/router'

import { getRequest, postRequest } from 'src/api-main-file/APIServices'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  clientId: null,
  authToken: null,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(defaultProvider.authToken)
  const [clientId, setClientId] = useState(defaultProvider.clientId)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [user, setUser] = useState(defaultProvider.user)

  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken')
      const clientType = localStorage.getItem('clientType')
      const api_url = `${BASE_URL}/${clientType}`

      if (storedToken) {
        setLoading(true)
        const response = await getRequest(`${api_url}/fetch-profile`)
        setLoading(false)

        if (response.status) {
          const {
            logo,
            name,
            email,
            address,
            companyName,
            mobile,
            referringAgent,
            [`${clientType}Id`]: clientId
          } = response.data
          setUser({ logo, name, email, address, companyName, mobile, referringAgent })
          setClientId(clientId)
          setAuthToken(storedToken)
        } else {
          setLoading(false)
          if (response.statusCode == 401) {
            logoutHandler()
          } else if (response.statusCode == 500) {
            // router.push("/500");
            setUser(null)
            setClientId(null)
          } else {
            toast.error(response.error)
          }
        }
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchUserDataHandler = async data => {
    const { token, clientType, user_data } = data
    const api_url = `${BASE_URL}/${clientType}`

    localStorage.setItem('authToken', token)
    localStorage.setItem('clientId', user_data[`${clientType}Id`])
    localStorage.setItem('clientType', clientType)

    setLoading(true)

    const response = await getRequest(`${api_url}/fetch-profile`)

    setLoading(false)

    if (response.status) {
      setUser(user_data)
    } else {
    // return;
      logoutHandler()
      return
    }

    setAuthToken(token)

    toast.success('Login Successful')
  }

  const handleLogin = async params => {
    setLoading(true)
    const { email, password, clientType } = params
    const api_url = `${BASE_URL}/${clientType}`
    const response = await postRequest(`${api_url}/login`, { email, password })
    setLoading(false)

    if (response.status) {
      fetchUserDataHandler({ ...response.data, clientType })
    } else {
      toast.error(response.error)
    }
  }

  const logoutHandler = () => {
    localStorage.clear()
    setClientId(defaultProvider.clientId)
    window.globalClinetId = ''
    setAuthToken(defaultProvider.authToken)
    setUser(defaultProvider.user)

    router.push('/login')
  }

  const handleLogout = async () => {
    const clientType = localStorage.getItem('clientType')
    const api_url = `${BASE_URL}/${clientType}`
    setLoading(true)
    const response = await getRequest(`${api_url}/logout`)
    setLoading(false)

    if (response.status) {
      logoutHandler()
    } else {
      toast.error(response.error)
    }
  }

  const values = {
    user,
    authToken,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
