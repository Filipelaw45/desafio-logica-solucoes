'use client';

import { User } from '@/types/user';
import Image from 'next/image';
import Link from 'next/link';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  clickable?: boolean;
}

export default function UserCard({ 
  user, 
  onEdit, 
  onDelete, 
  showActions = false,
  clickable = false
}: UserCardProps) {
  const cardContent = (
    <div className="flex items-start gap-4">
      <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
        <Image
          src={user.picture}
          alt={`${user.firstName} ${user.lastName}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-semibold text-gray-900 truncate">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm text-gray-500 capitalize">{user.gender}, {user.age} anos</p>
        
        <div className="mt-3 space-y-1">
          <p className="text-sm text-gray-700 truncate">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-sm text-gray-700 truncate">
            <span className="font-medium">Telefone:</span> {user.phone}
          </p>
          <p className="text-sm text-gray-700 truncate">
            <span className="font-medium">Localização:</span> {user.city}, {user.country}
          </p>
        </div>

        {showActions && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit?.(user);
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(user.id);
              }}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link href={`/users/${user.id}`}>
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]">
          {cardContent}
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {cardContent}
    </div>
  );
}
