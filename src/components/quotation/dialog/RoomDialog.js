import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import FormHelperText from '@mui/material/FormHelperText'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import Icon from 'src/@core/components/icon'

const Room = ({ room, roomInfoRef, rooms, selectedHotelDetail }) => {
  const {
    reset,
    watch,
    setValue,
    control: roomControl,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      [room]: selectedHotelDetail ? (selectedHotelDetail[room] != undefined ? selectedHotelDetail[room] : '0') : '0'
    }
  })

  const currRoom = watch(room)

  const incrementRoom = onChange => {
    // console.log("roomInfoRef.current: ", roomInfoRef.current)
    const totalRoom = roomInfoRef.current.reduce((acc, obj) => {
      // const value = Object.values(obj)[0]
      // console.log("obj is: ", obj)
      const value = obj.roomCount
      return acc + Number(value)
    }, 0)
    // console.log(totalRoom)

    if (totalRoom != Number(rooms)) {
      onChange(`${Number(currRoom) + 1}`)
      if (roomInfoRef.current.length == 0) {
        // roomInfoRef.current = [{ [room]: `${Number(currRoom) + 1}` }]
        roomInfoRef.current = [{ roomName: room, roomCount: `${Number(currRoom) + 1}` }]
      } else {
        let isExist = false
        roomInfoRef.current = roomInfoRef.current.map(obj => {
          // if (obj[room] != undefined) {
          // console.log("obj in loop: ", obj)
          if (obj.roomName == room) {
            isExist = true
            // return { [room]: `${Number(currRoom) + 1}` }
            return { roomName: room, roomCount: `${Number(currRoom) + 1}` }
          }
          // return obj
          return obj
        })
        if (!isExist) {
          let existingRooms = [...roomInfoRef.current]
          // existingRooms.push({ [room]: `${Number(currRoom) + 1}` })
          existingRooms.push({ roomName: room, roomCount: `${Number(currRoom) + 1}` })
          // console.log("existingRooms: ", existingRooms)
          roomInfoRef.current = existingRooms
        }
      }
    }
  }

  const decrementRoom = onChange => {
    if (Number(currRoom) != 0) {
      onChange(`${Number(currRoom) - 1}`)
      let existingRooms = [...roomInfoRef.current]
      // let roomToUpdateIndex = existingRooms.findIndex(r => Object.keys(r)[0] == room)
      let roomToUpdateIndex = existingRooms.findIndex(r => r.roomName == room)
      if (roomToUpdateIndex != -1) {
        // existingRooms.splice(roomToUpdateIndex, 1, { [room]: `${Number(currRoom) - 1}` })
        existingRooms.splice(roomToUpdateIndex, 1, { roomName: room, roomCount: `${Number(currRoom) - 1}` })
      }
      roomInfoRef.current = existingRooms
    }
  }

  return (
    <Box
      sx={{ border: '1px solid #9A9A9A', borderRadius: '6px', position: 'relative', height: '56px', width: '125px' }}
    >
      <Typography
        variant='caption'
        sx={{ position: 'absolute', top: -11.5, left: 6, background: 'white', px: 1 }}
      >{`${room[0].toUpperCase()}${room.slice(1)}`}</Typography>
      <Controller
        name={room}
        control={roomControl}
        rules={{ required: false }}
        render={({ field: { value, onChange } }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', width: '100%', mt: 3.5 }}>
            <IconButton
              edge='end'
              onClick={e => {
                e.stopPropagation()
                decrementRoom(onChange)
              }}
              aria-label='toggle minus visibility'
              size='small'
              sx={{
                backgroundColor: theme => theme.palette.primary.main,
                color: 'white',
                '&.MuiIconButton-root:hover': {
                  backgroundColor: theme => theme.palette.primary.main
                },
                width: '25px',
                height: '25px'
              }}
            >
              <Icon icon='mdi:minus' />
            </IconButton>
            {/* {console.log("value: ", value)} */}
            {value.length == 0 ? 0 : value}
            <IconButton
              edge='end'
              onClick={e => {
                e.stopPropagation()
                incrementRoom(onChange)
              }}
              aria-label='toggle plus visibility'
              size='small'
              sx={{
                backgroundColor: theme => theme.palette.primary.main,
                color: 'white',
                '&.MuiIconButton-root:hover': {
                  backgroundColor: theme => theme.palette.primary.main
                },
                width: '25px',
                height: '25px'
              }}
            >
              <Icon icon='mdi:plus' />
            </IconButton>
          </Box>
        )}
      />
    </Box>
  )
}

const RoomDialog = ({ open, handleClose, rooms, selectedHotel, selectedHotelDetail }) => {
  const roomInfoRef = useRef([])
  const [roomError, setRoomError] = useState('')
  const hotelSheetData = useSelector(state => state.hotelRateData)
  // console.log('rooms is: ', rooms)
  // console.log('selectedHotel is: ', selectedHotel)
  // console.log('selectedHotelDetail is: ', selectedHotelDetail)

  const roomTypes = useMemo(() => {
    if (selectedHotel) {
      const { location, type, name } = selectedHotel
      let roomsTypeList = []
      Object.keys(hotelSheetData.hotelsRate[location][type][name]).map(k => {
        // console.log('hotelSheetData.roomsList: ', hotelSheetData.roomsList)
        // console.log('k: ', k)
        if (hotelSheetData.roomsList.includes(k)) {
          roomsTypeList.push(k)
        }
      })
      return roomsTypeList
    }
    return []
  }, [selectedHotel])

  useEffect(() => {
    if (selectedHotelDetail) {
      let roomsDetail = []
      Object.keys(selectedHotelDetail).map(d => {
        if (!['id', 'name', 'location', 'price', 'selected', 'type', 'image'].includes(d)) {
          // console.log('d: ', d)
          // console.log('selectedHotelDetail: ', selectedHotelDetail)
          // roomsDetail.push({ [d]: selectedHotelDetail[d] })
          roomsDetail.push({ roomName: d, roomCount: selectedHotelDetail[d] })
        }
      })
      roomInfoRef.current = roomsDetail
    }
  }, [selectedHotelDetail])

  const onSubmit = () => {
    // console.log('roomInfoRef.current are: ', roomInfoRef.current)
    const totalRoom = roomInfoRef.current.reduce((acc, obj) => {
      // const value = Object.values(obj)[0]
      // console.log('obj: ', obj)
      const value = obj.roomCount
      return acc + Number(value)
    }, 0)
    // console.log('totalRoom are: ', totalRoom)
    // console.log('rooms are: ', rooms)

    if (totalRoom != Number(rooms)) {
      setRoomError('Would you like to add another room or modify your selection?')
      return
    }
    // console.log('roomInfoRef.current: ', roomInfoRef.current)
    // return;

    let roomInfo = {}
    roomInfoRef.current.map(data => {
      // roomInfo = { ...roomInfo, [Object.keys(data)[0]]: Object.values(data)[0] }
      roomInfo = { ...roomInfo, [data['roomName']]: data['roomCount'] }
    })
    // console.log('roomInfo: ', roomInfo)
    // return

    resetFields(selectedHotel, roomInfo, true)
  }

  const resetFields = (selectedHotelInfo, roomInfo, isSubmit) => {
    roomInfoRef.current = []
    setRoomError('')
    handleClose(selectedHotelInfo, roomInfo, isSubmit)
  }

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={resetFields}>
      <DialogTitle
        sx={{
          '&.MuiDialogTitle-root': {
            pb: 1
          }
        }}
        textAlign='center'
      >
        Select Room Type
      </DialogTitle>
      <DialogContent>
        <DialogContentText textAlign='center'>
          Select Rooms in {selectedHotel ? selectedHotel.name : ''}
        </DialogContentText>
        <Box sx={{ mt: 7, display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center' }}>
          {roomTypes.map(room => (
            <Room
              key={room}
              room={room}
              roomInfoRef={roomInfoRef}
              rooms={rooms}
              selectedHotelDetail={selectedHotelDetail}
            />
          ))}
        </Box>
        <FormHelperText>{roomError}</FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button size='small' variant='outlined' onClick={resetFields}>
          Cancel
        </Button>
        <Button size='small' variant='contained' onClick={onSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoomDialog
