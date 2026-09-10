import React from 'react';
import { HiUser } from 'react-icons/hi2';
import { useTenant } from '../context/TenantContext';

export default function UserAvatar({ 
  src, 
  name, 
  className = "w-10 h-10", 
  iconClassName = "w-5 h-5",
  roundedClassName = "rounded-full" 
}) {
  const { primaryColor, secondaryColor } = useTenant();

  // If a valid custom photo url is provided (not the old static asset)
  const hasValidPhoto = src && typeof src === 'string' && src.trim() !== '' && !src.includes('profile_avatar.jpg');

  // Compute 1 or 2 letter initials from name
  const getInitials = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  if (hasValidPhoto) {
    return (
      <div className={`${className} ${roundedClassName} overflow-hidden bg-gray-100 flex items-center justify-center shrink-0`}>
        <img 
          src={src} 
          alt={name || 'User Avatar'} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
          }}
        />
      </div>
    );
  }

  // Fallback Modern Dynamic Avatar with Initials or User Icon themed to Tenant
  return (
    <div 
      className={`${className} ${roundedClassName} text-white flex items-center justify-center font-bold tracking-tight shadow-xs select-none shrink-0`}
      style={{
        background: `linear-gradient(135deg, ${primaryColor || '#f37920'}, ${secondaryColor || primaryColor || '#e25d14'})`
      }}
    >
      {initials ? (
        <span className="text-xs sm:text-sm uppercase">{initials}</span>
      ) : (
        <HiUser className={`${iconClassName} text-white opacity-95`} />
      )}
    </div>
  );
}

