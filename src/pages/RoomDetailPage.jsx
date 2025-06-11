import React from 'react'
import RoomDetails from '../components/RoomDetails'
import { useParams } from 'react-router-dom'

const RoomDetailPage = () => {
  const { id } = useParams();
  return (
    <div>
        <RoomDetails key={id} />
    </div>
  )
}

export default RoomDetailPage