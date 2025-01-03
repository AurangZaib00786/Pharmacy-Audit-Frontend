import React from 'react'
import backbutton from '../assets/icons/back-button.png'
import { Link } from 'react-router-dom'

const GlobalBackTab = () => {
  return (
    <div>
        <div className='w-full h-12 mt-6 flex justify-between rounded-lg bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] shadow-xl'>
          <div className='flex items-center'>
            <Link to="/home">
            <img className='w-10 cursor-pointer' src={backbutton}/>
            </Link>
          </div>
          <div className='flex items-center '>
            <span className='text-2xl font-bold '>          Vendor file formate
            </span>

          </div>
          <div></div>
        </div>
      
    </div>
  )
}

export default GlobalBackTab
