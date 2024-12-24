// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'

// ** Icons Imports
// import Close from 'mdi-material-ui/Close'

const ImgStyled = styled('img')(({ theme }) => ({
    width: 120,
    // height: 120,
    marginRight: theme.spacing(6.25),
    borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        textAlign: 'center'
    }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(4.5),
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginLeft: 0,
        textAlign: 'center',
        marginTop: theme.spacing(4)
    }
}))

const UserBasicInfo = () => {
    // ** State

    const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')

    const onChange = file => {
        const reader = new FileReader()
        const { files } = file.target
        if (files && files.length !== 0) {
            reader.onload = () => setImgSrc(reader.result)
            reader.readAsDataURL(files[0])
        }
    }

    return (
        <CardContent>
            <form>
                <Grid container spacing={7}>
                    <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ImgStyled src={imgSrc} alt='Profile Pic' />
                            <Box>
                                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                                    Upload New Photo
                                    <input
                                        hidden
                                        type='file'
                                        onChange={onChange}
                                        accept='image/png, image/jpeg'
                                        id='account-settings-upload-image'
                                    />
                                </ButtonStyled>
                                <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/1.png')}>
                                    Reset
                                </ResetButtonStyled>
                                <Typography variant='body2' sx={{ marginTop: 5 }}>
                                    Allowed PNG, JPG or JPEG. Max size of 800K.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* <Grid item xs={12} sm={6}>
                        <TextField fullWidth label='Username' placeholder='johnDoe' defaultValue='johnDoe' />
                    </Grid> */}

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label='Name' placeholder='John Doe' defaultValue='John Doe' />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type='email'
                            label='Email'
                            placeholder='Enter your email id'
                            defaultValue='Vikas@vivaninfosoft@gmail.com'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth type='number' label='Phone' placeholder='(123) 456-7890' defaultValue='9898989898' />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl>
                            <FormLabel sx={{ fontSize: '0.875rem' }}>Gender</FormLabel>
                            <RadioGroup row defaultValue='male' aria-label='gender' name='account-settings-info-radio'>
                                <FormControlLabel value='male' label='Male' control={<Radio />} />
                                <FormControlLabel value='female' label='Female' control={<Radio />} />
                                <FormControlLabel value='other' label='Other' control={<Radio />} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type='Address'
                            label='Address'
                            placeholder='Enter your Address'
                            defaultValue='Jagdamba colony, naya khoda vidhyadhar nagar, naya khoda jaipur - 302023'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label='Company' placeholder='Enter Company Name' defaultValue='Vivan Infosoft' />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label='Designation' placeholder='Enter Your Designation' defaultValue='Senior Sales Officer' />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth disabled>
                            <InputLabel>Referring Agent Name</InputLabel>
                            <Select label='Referring Agent Name' defaultValue='nehasharma'>
                                <MenuItem value='nehasharma'>Neha Sharma</MenuItem>
                                <MenuItem value='author'>Author</MenuItem>
                                <MenuItem value='editor'>Editor</MenuItem>
                                <MenuItem value='maintainer'>Maintainer</MenuItem>
                                <MenuItem value='subscriber'>Subscriber</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                   

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label='Tagline' placeholder='Enter Your Tagline' defaultValue='Your Adventure, Our Passion.' />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label='Title' placeholder='Enter Your Title' defaultValue='Adventure Richa Holidays' />
                    </Grid>

                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            multiline
                            label='About'
                            minRows={2}
                            placeholder='Bio'
                            defaultValue='We specialize in curating bespoke travel experiences that suit every traveler’s dream. Whether you’re looking for thrilling adventures, serene getaways, or corporate retreats, we offer custom domestic and international tours for individuals, groups, and businesses. With expert planning and a personal touch, your journey is in great hands—creating memories that last a lifetime.'
                        />
                    </Grid>

                   


                    <Grid item xs={12}>
                        <Button variant='contained' sx={{ marginRight: 3.5 }}>
                            Save Changes
                        </Button>
                        <Button type='reset' variant='outlined' color='secondary'>
                            Reset
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </CardContent>
    )
}

export default UserBasicInfo
