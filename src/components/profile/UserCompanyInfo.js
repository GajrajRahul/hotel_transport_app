// ** React Imports
import { forwardRef, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import RadioGroup from '@mui/material/RadioGroup'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const CustomInput = forwardRef((props, ref) => {
    return <TextField inputRef={ref} label='Birth Date' fullWidth {...props} />
})

const UserCompanyInfo = () => {
    // ** State
    const [date, setDate] = useState(null)

    return (
        <CardContent>
            <form>
                <Grid container spacing={7}>
                    

                    <Grid item xs={12} sx={{ marginTop: 4.8 }}>
                        <TextField
                            fullWidth
                            multiline
                            label='About'
                            minRows={2}
                            placeholder='Bio'
                            defaultValue='We specialize in curating bespoke travel experiences that suit every traveler’s dream. Whether you’re looking for thrilling adventures, serene getaways, or corporate retreats, we offer custom domestic and international tours for individuals, groups, and businesses. With expert planning and a personal touch, your journey is in great hands—creating memories that last a lifetime.'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label='Tagline' placeholder='Enter Your Tagline' defaultValue='Your Adventure, Our Passion.' />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label='Title' placeholder='Enter Your Title' defaultValue='Adventure Richa Holidays' />
                    </Grid>

                    
                    <Grid item xs={12}>
                        <Button variant='contained' sx={{ marginRight: 3.5 }}>
                            Save Changes
                        </Button>
                        <Button type='reset' variant='outlined' color='secondary' onClick={() => setDate(null)}>
                            Reset
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </CardContent>
    )
}

export default UserCompanyInfo
