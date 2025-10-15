import React from 'react'

const DeleteAlert = ({content, onDelete}) => {
  return (
  <div>
    <p className='text-sm'>{content}</p>
    <div className='flex justify-end mt-6'>
        <button
        type='button'
        className='flex items-center justify-center gap-1.5 text-sm md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 px-4 py-2 cursor-pointer rounded hover:bg-rose-100 transition-colors'
        onClick={onDelete}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" x2="10" y1="11" y2="17"/>
              <line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
            Delete
        </button>
    </div>
  </div>
  )
}

export default DeleteAlert