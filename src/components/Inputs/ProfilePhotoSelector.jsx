import React,{useRef, useState} from 'react'
import { LuUser,LuTrash,LuUpload } from "react-icons/lu";

const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef();
    const[previewURL, setPreviewURL] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            //update image preview url form the file
            setImage(file);

            const previewURL = URL.createObjectURL(file);
            setPreviewURL(previewURL);
        }
    };
    const handleRemoveImage = () => {
        setImage(null);
        setPreviewURL(null);
      
    };
    const onChooseImage = () => {
        inputRef.current.click();
    };


  return <div className='flex justify-center mb-6'>
      <input
        type="file"
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />

      {!image ? (
        <div className=' w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer' >
          <LuUser className='text-4xl text-primary' />
          
          <button
            type='button'
            className=' w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute bottom-1 right-1 cursor-pointer'
            onClick={onChooseImage}
          >
            <LuUpload  />        
          </button>
        </div>
      ) : (
        <div className='relative'>
          <img 
            src={previewURL} 
            alt="profile photo"
            className='w-20 h-20 rounded-full object-cover' 
          />
          
          <button 
            type='button'
            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute bottom-1 right-1 '
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  
  
};

export default ProfilePhotoSelector