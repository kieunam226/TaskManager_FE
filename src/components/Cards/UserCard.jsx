import React from 'react'

const UserCard = ({userInfo}) => {
  return (
    <div className="user-card p-2">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <img
        src={userInfo?.profileImageUrl}
        alt={'Avatar'}
        className="w-12 h-12 rounded-full border-2 border-white"
      />

      <div>
        <p className="text-sm font-medium">{userInfo?.name}</p>
        <p className="text-xs text-gray-500">{userInfo?.email}</p>
      </div>
    </div>
  </div>

  <div className="flex items-end gap-3 mt-5">
    <StartCard 
    label= "pending"
    count = {userInfo?.pendingTasks ||0}
    status= "pending"
    />
    <StartCard 
    label= "in-progress"
    count = {userInfo?.inProcessTasks ||0}
    status= "in-progress"
    />
    <StartCard 
    label= "completed"
    count = {userInfo?.completeTasks ||0}
    status= "completed"
    />
  </div>
</div>
  )
}

export default UserCard;
const StartCard =({label,count,status}) =>{
    const getStatusTagColor = () => {
    switch (status) {
      case "in-progress":
        return "text-cyan-500 bg-gray-50 ";
      case "completed":
        return "text-indigo-500 bg-gray-50";
      default:
        return "text-violet-500 bg-gray-50";
    }
  };
   return(
    <div
    className={`flex-1 text-[13px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
    >
        <span className='text-[12px] font-medium'> {count}</span>
        <br />
        {label}
    </div>
   )
};