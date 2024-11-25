import { useSelector } from 'react-redux'

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

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}

        <Breadcrumbs aria-label='breadcrumb'>
          {breadcrumb.map((data, index) => {
            return (
              <Typography key={index} fontWeight={800} variant='body2'>
                {data.label}
              </Typography>
            )
            // if (index + 1 === breadcrumb.length) {
            //   return (
            //     <Typography key={index} fontWeight={800} variant='body2'>
            //       {data.label}
            //     </Typography>
            //   )
            // } else {
            //   if (LINK_OBJ[data.label]) {
            //     return (
            //       <Link key={index} href={LINK_OBJ[data.label]}>
            //         <Typography variant='body2'>{data.label}</Typography>
            //       </Link>
            //     )
            //   } else {
            //     return (
            //       <Typography key={index} variant='body2'>
            //         {data.label}
            //       </Typography>
            //     )
            //   }
            // }
          })}
        </Breadcrumbs>
        {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
