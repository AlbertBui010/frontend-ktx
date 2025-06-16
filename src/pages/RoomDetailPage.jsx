import React from 'react'
import RoomDetails from '../components/RoomDetails'
import Banner from '../components/Banner'
import { useParams } from 'react-router-dom'

const RoomDetailPage = () => {
  const { id } = useParams();
  return (
    <div>
      <Banner />
      <RoomDetails key={id} />
    </div>
  )
}

export default RoomDetailPage