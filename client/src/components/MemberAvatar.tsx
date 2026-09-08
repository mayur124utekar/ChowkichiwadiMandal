import React, { useState } from 'react';

interface MemberAvatarProps {
  photoUrl?: string | null;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MemberAvatar: React.FC<MemberAvatarProps> = ({
  photoUrl,
  name,
  className = '',
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  const initial = name ? name.trim().charAt(0) : 'म';

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 sm:w-28 sm:h-28 text-2xl sm:text-3xl',
    xl: 'w-32 h-32 text-4xl',
  };

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt={name}
        onError={() => setImgError(true)}
        className={`object-cover rounded-full ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`bg-gradient-to-tr from-orange-400 via-amber-500 to-orange-600 text-white font-bold rounded-full flex items-center justify-center shadow-inner select-none ${sizeClasses[size]} ${className}`}
    >
      {initial}
    </div>
  );
};
