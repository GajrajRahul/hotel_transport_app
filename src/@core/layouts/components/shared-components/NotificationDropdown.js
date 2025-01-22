// ** React Imports
import { useState, Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import { io } from 'socket.io-client'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Import
import { getInitials } from 'src/@core/utils/get-initials'
import { getRequest, putRequest } from 'src/api-main-file/APIServices'

// ** Styled Menu component
const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 349
})

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)({
  width: 38,
  height: 38,
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const socket = io("https://crm.adventurerichaholidays.com")
// const socket = io("http://localhost:4000")
// const socket = io('http://localhost:4000/api')

const NotificationDropdown = props => {
  const clientType = localStorage.getItem('clientType') || 'admin'
  const clientId = localStorage.getItem('clientId') || 'admin'
  // const createdQuoteClientId = localStorage.getItem('createdQuoteClientId')
  // ** Props
  const { settings } = props

  // ** States
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(null)
  const [totalNotifications, setTotalNotifications] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()

  // ** Hook
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  // ** Vars
  const { direction } = settings

  useEffect(() => {
    fetchNotifications();
  }, [])

  useEffect(() => {
    // Listen for new employee signup notifications
    if (clientType === 'admin') {
      socket.emit('joinRoom', 'admin')
      // if(createdQuoteClientId) {
      //   socket.emit('joinUserRoom', createdQuoteClientId)
      // }
      // else {
      socket.emit('joinUserRoom', 'admin')
      // }

      socket.on('signup', data => {
        // console.log(data)
        setNotifications(prev => [data, ...prev])
      })
      socket.on('quotation', data => {
        // console.log(data)
        setNotifications(prev => [data, ...prev])
      })

      return () => {
        socket.off('signup')
        socket.off('quotation')
      }
    } else if (clientId != 'admin') {
      socket.emit('joinUserRoom', clientId)
      socket.on('quotation', data => {
        // console.log(data)
        setNotifications(prev => [data, ...prev])
      })
      return () => {
        socket.off('quotation')
      }
    }
  }, [])

  const fetchNotifications = async () => {
    // const BASE_URL = 'http://localhost:4000/api'
    const clientType = localStorage.getItem('clientType')
    const api_url = `${BASE_URL}/${clientType}`

    const response = await getRequest(`${api_url}/fetch-notifications`)

    if (response.status) {
      setNotifications(response.data.map((data, idx) => ({ ...data, id: idx + 1 })))
    } else {
      toast.error(response.error)
    }
  }

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const updateNotificationStatus = async id => {
    // const BASE_URL = 'http://localhost:4000/api'
    const clientType = localStorage.getItem('clientType')
    const api_url = `${BASE_URL}/${clientType}`

    const response = await putRequest(`${api_url}/update-notification-status`, { id })

    if (!response.status) {
      toast.error(response.error)
    }
  }

  const handleNotification = notification => {
    handleDropdownClose()
    console.log("notification: ", notification)
    // return;
    updateNotificationStatus(notification.notificationId)
    router.push({
      pathname: notification.type == 'signup' ? '/user-management' : '/quotations-history',
      query: {
        filter: JSON.stringify(notification)
      }
    })
  }

  const RenderAvatar = ({ notification }) => {
    const { logo, name } = notification
    if (logo) {
      return <Avatar alt={name} src={logo} />
    } else {
      return (
        <Avatar skin='light' color='primary'>
          {getInitials(name)}
        </Avatar>
      )
    }
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge
          color='error'
          variant='dot'
          invisible={!notifications.length}
          sx={{
            '& .MuiBadge-badge': { top: 4, right: 4, boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}` }
          }}
        >
          <Icon icon='mdi:bell-outline' />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ cursor: 'text', fontWeight: 600 }}>Notifications</Typography>
            <CustomChip
              skin='light'
              size='small'
              color='primary'
              label={`${notifications.length} New`}
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>
        <ScrollWrapper hidden={hidden}>
          {notifications.map((notification, index) => (
            <MenuItem key={index} onClick={() => handleNotification(notification)}>
              {/* {console.log(notification)} */}
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <RenderAvatar notification={notification} />
                <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                  <MenuItemTitle>{notification.title}</MenuItemTitle>
                  <MenuItemSubtitle sx={{ textWrap: 'wrap' }} variant='body2'>
                    {notification.description}
                  </MenuItemSubtitle>
                </Box>
                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                  {format(new Date(notification.createdAt), 'dd MMM yy')}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </ScrollWrapper>
        {/* <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            py: 3.5,
            borderBottom: 0,
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
            borderTop: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            Read All Notifications
          </Button>
        </MenuItem> */}
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
