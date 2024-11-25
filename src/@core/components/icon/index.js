// ** Icon Imports
import { Icon } from '@iconify/react'

const IconifyIcon = ({ icon, fontSize = '1.5rem', ...rest }) => {
  return <Icon icon={icon} fontSize={fontSize} {...rest} />
}

export default IconifyIcon
