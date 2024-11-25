import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
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
    const totalRoom = roomInfoRef.current.reduce((acc, obj) => {
      const value = Object.values(obj)[0]
      return acc + Number(value)
    }, 0)

    if (totalRoom != Number(rooms)) {
      onChange(`${Number(currRoom) + 1}`)
      if (roomInfoRef.current.length == 0) {
        roomInfoRef.current = [{ [room]: `${Number(currRoom) + 1}` }]
      } else {
        let isExist = false
        roomInfoRef.current = roomInfoRef.current.map(obj => {
          if (obj[room] != undefined) {
            isExist = true
            return { [room]: `${Number(currRoom) + 1}` }
          }
          return obj
        })
        if (!isExist) {
          let existingRooms = [...roomInfoRef.current]
          existingRooms.push({ [room]: `${Number(currRoom) + 1}` })
          roomInfoRef.current = existingRooms
        }
      }
    }
  }

  const decrementRoom = onChange => {
    if (Number(currRoom) != 0) {
      onChange(`${Number(currRoom) - 1}`)
      let existingRooms = [...roomInfoRef.current]
      let roomToUpdateIndex = existingRooms.findIndex(r => Object.keys(r)[0] == room)
      if (roomToUpdateIndex != -1) {
        existingRooms.splice(roomToUpdateIndex, 1, { [room]: `${Number(currRoom) - 1}` })
      }
      roomInfoRef.current = existingRooms
    }
  }

  return (
    <Box>
      <Typography>{`${room[0].toUpperCase()}${room.slice(1)}`}</Typography>
      <Controller
        name={room}
        control={roomControl}
        rules={{ required: false }}
        render={({ field: { value, onChange } }) => (
          <Box>
            <IconButton
              edge='end'
              onClick={e => {
                e.stopPropagation()
                decrementRoom(onChange)
              }}
              aria-label='toggle minus visibility'
              size='small'
              sx={{
                mr: 3,
                backgroundColor: theme => theme.palette.primary.main,
                color: 'white',
                '&.MuiIconButton-root:hover': {
                  backgroundColor: theme => theme.palette.primary.main
                }
              }}
            >
              <Icon icon='mdi:minus' />
            </IconButton>
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
                ml: 3,
                backgroundColor: theme => theme.palette.primary.main,
                color: 'white',
                '&.MuiIconButton-root:hover': {
                  backgroundColor: theme => theme.palette.primary.main
                }
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

const RoomDialog = ({
  open,
  handleClose,
  rooms,
  selectedHotel,
  selectedHotelDetail,
  roomsList,
  hotelRate,
  totalRooms
}) => {
  const roomInfoRef = useRef([])

  const roomTypes = useMemo(() => {
    if (selectedHotel) {
      const { location, type, name } = selectedHotel
      let roomsTypeList = []
      Object.keys(hotelRate[location][type][name]).map(k => {
        if (roomsList.includes(k)) {
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
          roomsDetail.push({ [d]: selectedHotelDetail[d] })
        }
      })
      roomInfoRef.current = roomsDetail
    }
  }, [selectedHotelDetail])

  const onSubmit = () => {
    const totalRoom = roomInfoRef.current.reduce((acc, obj) => {
      const value = Object.values(obj)[0]
      return acc + Number(value)
    }, 0)

    if (totalRoom != Number(rooms)) {
      return
    }

    let roomInfo = {}
    roomInfoRef.current.map(data => {
      roomInfo = { ...roomInfo, [Object.keys(data)[0]]: Object.values(data)[0] }
    })

    resetFields(selectedHotel, roomInfo, true)
  }

  const resetFields = (selectedHotelInfo, roomInfo, isSubmit) => {
    roomInfoRef.current = []
    handleClose(selectedHotelInfo, roomInfo, isSubmit)
  }

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={resetFields}>
      <DialogTitle
        sx={{
          '&.MuiDialogTitle-root': {
            pb: 3
          }
        }}
        textAlign='center'
      >
        Rooms
      </DialogTitle>
      <DialogContent>
        <DialogContentText textAlign='center'>Select {totalRooms == 0 ? rooms : totalRooms} rooms</DialogContentText>
        <Box sx={{ mt: 5, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
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
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={resetFields}>
          Cancel
        </Button>
        <Button variant='contained' onClick={onSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoomDialog
