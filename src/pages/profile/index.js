// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

// ** Icons Imports
import { PrfileEditIcon, ProfileDocIcon, ProfileLockIcon } from 'src/utils/icons'
// import AccountOutline from 'mdi-material-ui/AccountOutline'
// import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
// import InformationOutline from 'mdi-material-ui/InformationOutline'

// ** Demo Tabs Imports
import UserBasicInfo from 'src/components/profile/UserBasicInfo'
import UserSecurityInfo from 'src/components/profile/UserSecurityInfo'
import UserCompanyInfo from 'src/components/profile/UserCompanyInfo'
// import TabInfo from 'src/views/account-settings/TabInfo'
// import TabAccount from 'src/views/account-settings/TabAccount'
// import TabSecurity from 'src/views/account-settings/TabSecurity'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const AccountSettings = () => {
  // ** State
  const [value, setValue] = useState('account')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='account-settings tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='account'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
               {PrfileEditIcon}
                <TabName>Personal Info</TabName>
              </Box>
            }
          />
          <Tab
            value='security'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                             {ProfileDocIcon}
                <TabName>Basic Info</TabName>
              </Box>
            }
          />
          <Tab
            value='info'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
               {ProfileLockIcon}
                <TabName>Security</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='account'>
          <UserBasicInfo />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='security'>
          <UserCompanyInfo />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='info'>
          <UserSecurityInfo />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default AccountSettings
