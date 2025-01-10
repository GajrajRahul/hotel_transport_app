import React, { useState } from 'react'

import MuiTabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import Tab from '@mui/material/Tab'

import { styled } from '@mui/material/styles'

import QuotationsHistory from 'src/components/history/QuotationsHistory'
import TaxisHistory from 'src/components/history/TaxisHistory'

const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: `${theme.palette.primary.dark} !important`,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    // minHeight: 38,
    // minWidth: 130,
    borderRadius: '15px 15px 0px 0px',
    backgroundColor: 'rgba(61, 61, 61, 0.15)',
    // color: `${theme.palette.common.white} !important`
  }
}))

const History = () => {
  const clientType = localStorage.getItem('clientType') || 'admin'
  const [tabValue, setTabValue] = useState('quotation')

  const handleTabValue = (event, newValue) => {
    setTabValue(newValue)
  }

  return clientType != 'employee' ? (
    <TabContext value={tabValue}>
      <TabList onChange={handleTabValue} aria-label='customized tabs example'>
        <Tab sx={{ minWidth: 1 / 2 }} value='quotation' label='Quotations History' />
        <Tab sx={{ minWidth: 1 / 2 }} value='taxi' label='Taxis History' />
      </TabList>
      <TabPanel sx={{ p: 0 }} value='quotation'>
        <QuotationsHistory />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} value='taxi'>
        {/* <TaxisHistory /> */}
      </TabPanel>
    </TabContext>
  ) : (
    <QuotationsHistory />
  )
}

export default History
