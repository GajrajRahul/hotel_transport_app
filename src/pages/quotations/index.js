import { Fragment, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'

import FormHelperText from '@mui/material/FormHelperText'
import OutlinedInput from '@mui/material/OutlinedInput'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import StepLabel from '@mui/material/StepLabel'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// import { useJsApiLoader } from '@react-google-maps/api'

import StepperWrapper from 'src/@core/styles/mui/stepper'

import { getDayNightCount } from 'src/utils/function'
import AmountDisplayDialog from 'src/components/quotation/dialog/AmountDisplayDialog'
import TravelInfoStep from 'src/components/quotation/quotation_steps/TravelInfoStep'
import HotelInfoStep from 'src/components/quotation/quotation_steps/HotelInfoStep'
import TransportInfoStep from 'src/components/quotation/quotation_steps/TransportInfoStep'
import StepperCustomDot from 'src/components/common/StepperCustomDot'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

const steps = [
  {
    title: 'Travel Info',
    subtitle: 'Enter your Travel Details'
  },
  {
    title: 'Select Hotel',
    subtitle: 'Hotel Information'
  },
  {
    title: 'Select Transport',
    subtitle: 'Transport Details'
  }
]

function loadScript(src, position, id) {
  if (!position) {
    return
  }

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  position.appendChild(script)
}

const Quotations = () => {
  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false)
  const [calculatedAmount, setCalculatedAmount] = useState(null)
  const [quotationNameError, setQuotationNameError] = useState('')
  const [activeStep, setActiveStep] = useState(0)

  const loaded = useRef(false)
  const router = useRouter()

  const {
    reset,
    watch,
    getValues,
    setValue,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { quotationName: localStorage.getItem('quotationName') ?? '' }
  })

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps'
      )
    }

    loaded.current = true
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const onSubmit = data => {
    if (activeStep == 0) {
      const quotation_name = getValues('quotationName')
      if (quotation_name.length == 0) {
        setQuotationNameError('This field is required')
        return
      } else {
        localStorage.setItem('quotationName', quotation_name)
        setQuotationNameError('')
      }
    }
    if (activeStep != steps.length - 1) {
      setActiveStep(activeStep + 1)
    } else {
      localStorage.setItem('transport', JSON.stringify(data))
      router.push('/quotations/preview')
      // window.open('/quotations/preview', '_blank')
    }
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return <TravelInfoStep onSubmit={onSubmit} />
      case 1:
        return <HotelInfoStep handleBack={handleBack} onSubmit={onSubmit} />
      case 2:
        return <TransportInfoStep handleBack={handleBack} onSubmit={onSubmit} />
      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained'>
              Reset
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      {activeStep == 0 && (
        <Grid container spacing={6}>
          <Grid item xs={12} sx={{ m: 7 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor='stepper-linear-quotation-name'>Quotation Name</InputLabel>
              <Controller
                name='quotationName'
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field: { value, onChange } }) => (
                  <OutlinedInput
                    value={value}
                    error={Boolean(quotationNameError)}
                    label='Quotation Name'
                    id='stepper-linear-quotation-name'
                    onChange={onChange}
                  />
                )}
              />
              {quotationNameError.length > 0 && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-persons'>
                  {quotationNameError}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      )}
      {activeStep == 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            p: 5,
            pb: 3,
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Typography variant='h4'>Design Your Customized Travel Experience</Typography>
          <Divider sx={{ width: '100px' }} />
          <Typography>
            Craft a travel package uniquely tailored to your preferences. Specify destinations, activities, and
            accommodations to create an itinerary that aligns perfectly with your vision. Elevate your journey with a
            personalized touch, designed exclusively for you.
          </Typography>
        </Box>
      )}
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              return (
                <Step key={index}>
                  <StepLabel StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography sx={{ color: '#3A3541DE !important' }} className='step-number'>{`0${
                        index + 1
                      }`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <CardContent sx={{ height: '100%' }}>{renderContent()}</CardContent>
      <AmountDisplayDialog
        open={isAmountDialogOpen}
        handleClose={() => setIsAmountDialogOpen(false)}
        amounts={calculatedAmount}
      />
    </Card>
  )
}

export default Quotations
