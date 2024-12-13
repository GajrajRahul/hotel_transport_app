import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  const breadcrumb = useSelector(state => state.breadcrumb)
  const router = useRouter()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <img
        style={{ width: '180px', height: '100px', objectFit: 'contain', marginTop: '0px', cursor: 'pointer' }}
        src='/images/logo_full.png'
        alt='logo'
        onClick={() => router.push('/')}
      />
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
