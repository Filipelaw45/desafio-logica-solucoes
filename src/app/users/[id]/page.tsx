'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import Navbar from '@/components/Navbar';
import EditUserModal from '@/components/EditUserModal';
import Image from 'next/image';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export default function UserDetailPage({ params }: Params) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { id } = await params;
      try {
        const response = await fetch(`/api/users/${id}`);
        
        if (!response.ok) {
          throw new Error('Usuário não encontrado');
        }
        
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar usuário');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [params]);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSave = async (updatedUser: User) => {
    try {
      const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar usuário');
      }

      setUser(updatedUser);
      setIsModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Falha ao atualizar usuário');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir usuário');
      }

      router.push('/');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Falha ao excluir usuário');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando usuário...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Erro:</p>
            <p>{error || 'Usuário não encontrado'}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar para lista
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="text-xl mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          <span>←</span> Voltar
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 mt-16 mb-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                <Image
                  src={user.picture}
                  alt={`${user.firstName} ${user.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="mt-4 sm:mt-0 sm:mb-2 flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 capitalize mt-1">
                  {user.gender} • {user.age} anos
                </p>
              </div>

              <div className="flex gap-3 mt-4 sm:mt-0 sm:mb-2">
                <button
                  onClick={handleEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Informações de Contato
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Telefone
                  </label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Localização
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Cidade
                  </label>
                  <p className="text-gray-900">{user.city}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    País
                  </label>
                  <p className="text-gray-900">{user.country}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  ID do Usuário
                </label>
                <p className="text-gray-900 font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {user && (
        <EditUserModal
          user={user}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
