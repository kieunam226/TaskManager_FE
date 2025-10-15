import React from 'react'

const AvatarGroup = ({ avatars, maxVisible=3 }) => {
  const displayAvatars = avatars.slice(0, maxVisible);
  const remaining = avatars.length - maxVisible;

  return (
    <div className="flex -space-x-2">
      {displayAvatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`User ${index + 1}`}
          className="w-8 h-8 rounded-full border-2 border-white"
        />
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup