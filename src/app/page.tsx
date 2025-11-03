'use client';

import { useState, useEffect, useMemo } from 'react';
import { User } from '@/types/user';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import UserCard from '@/components/UserCard';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async (searchTerm: string = '') => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const url = searchTerm 
        ? `/api/users?search=${encodeURIComponent(searchTerm)}`
        : '/api/users';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (term: string) => {
    fetchUsers(term);
  };

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return users.slice(startIndex, endIndex);
  }, [users, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Usuários Salvos
          </h1>
          <p className="text-gray-600">
            Gerencie os usuários salvos no arquivo CSV
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando usuários...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Erro:</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg mb-4">
              Nenhum usuário encontrado
            </p>
            <p className="text-gray-500 text-sm">
              Vá para &quot;Buscar Novos Usuários&quot; para adicionar usuários ao sistema
            </p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-gray-600">
                Total de usuários: <span className="font-semibold">{users.length}</span>
              </div>
              <div className="text-gray-600 text-sm">
                Página {currentPage} de {Math.ceil(users.length / ITEMS_PER_PAGE)}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  clickable={true}
                />
              ))}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalItems={users.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
}
