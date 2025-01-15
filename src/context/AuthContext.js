import { createContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/router'

import { getRequest, postRequest } from 'src/api-main-file/APIServices'
import axios from 'axios'
import { replaceHotelData } from 'src/store/HotelDataSlice'
import { replaceTransportData } from 'src/store/TransportDataSlice'
import { replaceMonumentData } from 'src/store/MonumentDataSlice'
import { transformHotelData, transformMonumentsData, transformTransportData } from 'src/utils/function'
import { replaceHotelSheetData } from 'src/store/quotations/HotelsInfoSlice'

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
  const dispatch = useDispatch()

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
            [`${clientType}Id`]: clientId,
            gender,
            designation,
            tagline,
            title,
            about
          } = response.data
          setUser({
            logo,
            name,
            email,
            address,
            companyName,
            mobile,
            referringAgent,
            gender,
            designation,
            tagline,
            title,
            about
          })
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

  useEffect(() => {
    if (user) {
      fetchSheetData()
    }
  }, [user])

  const fetchSheetData = async () => {
    setLoading(true)

    const [hotelData, transportData, monumentData] = await Promise.all([
      fetchHotelData(),
      fetchTransportData(),
      fetchMonumentsData()
    ])

    if (hotelData) {
      dispatch(replaceHotelData(hotelData))
    }

    if (transportData) {
      // console.log('transportData: ', transportData)
      dispatch(replaceTransportData(transportData))
    }

    if (monumentData) {
      dispatch(replaceMonumentData(monumentData))
    }
    setLoading(false)
  }

  const fetchHotelData = async () => {
    const HOTEL_SHEET_ID = process.env.NEXT_PUBLIC_HOTEL_SHEET_ID
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const HOTEL_URL = `https://sheets.googleapis.com/v4/spreadsheets/${HOTEL_SHEET_ID}/values/Sheet1?key=${API_KEY}`

    try {
      const response = await axios.get(HOTEL_URL)
      const myData = getProperHotelData(response.data.values)
      return transformHotelData(response.data.values)
    } catch (error) {
      toast.error('Failded fetching quotation data')
      return { hotelsRate: null, roomsList: [], stateList: [] }
    }
  }

  const fetchTransportData = async () => {
    const TRANSPORT_SHEET_ID = process.env.NEXT_PUBLIC_TRANSPORT_SHEET_ID
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    // const TRANSPORT_URL = `https://sheets.googleapis.com/v4/spreadsheets/${TRANSPORT_SHEET_ID}/values/Sheet1?key=${API_KEY}`
    const TRANSPORT_URL = `https://sheets.googleapis.com/v4/spreadsheets/1fDSoIJenm9OVHSBmAm9qojgLHapQ1od_m5zfB7gDkH0/values/Sheet1?key=${API_KEY}`

    try {
      const response = await axios.get(TRANSPORT_URL)
      // console.log('response.data.values: ', response.data.values)
      // return transformTransportData(response.data.values)
      return getProparTransformData(response.data.values)
    } catch (error) {
      toast.error('Failded fetching quotation data')
      return {}
    }
  }

  const getProperHotelData = async data => {
    const headers = data[0] // Extract headers
    let finalResult = []

    data.slice(1).forEach(item => {
      const rowData = Object.fromEntries(headers.map((key, index) => [key, item[index]]))

      let meals = []
      if (rowData.breakfast) {
        meals.push({ meal: 'Breakfast', price: rowData.breakfast })
      }
      if (rowData.lunch) {
        meals.push({ meal: 'Lunch', price: rowData.lunch })
      }
      if (rowData.dinner) {
        meals.push({ meal: 'Dinner', price: rowData.dinner })
      }

      let rooms = []
      if (rowData.room_type_1_tag) {
        rooms.push({ type: rowData.room_type_1_tag, price: rowData.room_type_1 })
      }
      if (rowData.room_type_2_tag) {
        rooms.push({ type: rowData.room_type_2_tag, price: rowData.room_type_2 })
      }
      if (rowData.room_type_3_tag) {
        rooms.push({ type: rowData.room_type_3_tag, price: rowData.room_type_3 })
      }
      if (rowData.room_type_4_tag) {
        rooms.push({ type: rowData.room_type_4_tag, price: rowData.room_type_4 })
      }

      const existingCityDataIndex = finalResult.findIndex(cityData => cityData.city == rowData.city)
      if (existingCityDataIndex != -1) {
        finalResult[existingCityDataIndex] = {
          ...finalResult[existingCityDataIndex],
          hotels: [
            ...finalResult[existingCityDataIndex]['hotels'],
            {
              name: rowData.hotel_name,
              image: rowData.hotel_img_link || '',
              type: rowData.type_of_hotel,
              minMaxRoomPrice: [rooms[0], rooms[rooms.length - 1]],
              rooms,
              extraBedPrice: rowData.extrabed,
              meals,
              roomCapacity: rowData.room_capacity,
              isPrime: rowData.prim_hotels == 'TRUE'
            }
          ]
        }
      } else {
        finalResult.push({
          city: rowData.city,
          state: rowData.destination,
          hotels: [
            {
              name: rowData.hotel_name,
              image: rowData.hotel_img_link || '',
              type: rowData.type_of_hotel,
              minMaxRoomPrice: [rooms[0], rooms[rooms.length - 1]],
              rooms,
              extraBedPrice: rowData.extrabed,
              meals,
              roomCapacity: rowData.room_capacity,
              isPrime: rowData.prim_hotels == 'TRUE'
            }
          ]
        })
      }
    })
    dispatch(replaceHotelSheetData(finalResult))
    // console.log("finalResult: ", finalResult)
  }

  const getProparTransformData = async data => {
    const headers = data[0] // Extract headers
    const result = {}
    let states = []

    data.slice(1).forEach(row => {
      if (row.length > 0) {
        const rowData = Object.fromEntries(headers.map((key, index) => [key, row[index]]))
        // console.log('rowData.state: ', rowData.state)

        const state = rowData.state // Default state if not specified
        const carName = `${rowData.car_name}`

        if (state.length != 0 && !states.includes(state)) {
          if (!result[state]) result[state] = {}
          if (!result[state][carName]) result[state][carName] = {}
          states.push(state)
          headers.forEach(item => {
            if (item !== 'car_name' && item !== 'state') {
              result[state][carName][item] = rowData[item]
            }
          })
        } else {
          if (!result[states[states.length - 1]][carName]) result[states[states.length - 1]][carName] = {}
          headers.forEach(item => {
            if (item !== 'car_name' && item !== 'state') {
              result[states[states.length - 1]][carName][item] = rowData[item]
            }
          })
        }
      }
    })

    // console.log('result: ', result)
    return result
  }

  const fetchMonumentsData = async () => {
    const MONUMENTS_SHEET_ID = process.env.NEXT_PUBLIC_MONUMENTS_SHEET_ID
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const MONUMENTS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${MONUMENTS_SHEET_ID}/values/Sheet1?key=${API_KEY}`

    try {
      const response = await axios.get(MONUMENTS_URL)
      return transformMonumentsData(response.data.values)
    } catch (error) {
      toast.error('Failed fetching monuments data')
      console.error('Error fetching data:', error)
      return []
    }
  }

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
      const { user_data } = response.data
      if (!user_data) {
        toast.error(response.error)
        return
      }
      if (user_data && user_data.status != 'approved') {
        toast.error(response.error)
        return
      }

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
