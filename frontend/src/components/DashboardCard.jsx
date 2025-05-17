import React from 'react'

function DashboardCard({cardHeading, cardNumber, cardIcon, iconStyle}) {
  return (
    <div className='flex border-gray-200 rounded-lg border w-full justify-between px-4 py-8'>
        <div className='flex flex-col gap-2'>
            <p className='text-md font-semibold'>{cardHeading}</p>
            <p className='text-2xl font-bold'>{cardNumber}</p>
        </div>
        <div className= {`${iconStyle}`}>
            {cardIcon}
        </div>
    </div>
  )
}

export default DashboardCard