'use client';

import { useState, useMemo } from 'react';
import { User } from '@/types/user';
import Navbar from '@/components/Navbar';
import UserCard from '@/components/UserCard';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 9;

export default function FetchUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const fetchRandomUsers = async () => {
    const validQuantity = quantity === '' ? 10 : quantity;

    if (validQuantity < 1 || validQuantity > 100) {
      setError('A quantidade deve ser entre 1 e 100');
      return;
    }

    setLoading(true);
    setError(null);
    setSaveMessage(null);
    setCurrentPage(1);
    try {
      const response = await fetch(`/api/random-users?results=${validQuantity}`);

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

  const saveUserToCSV = async (user: User) => {
    setSavingUserId(user.id);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users: [user] }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      await response.json();
      setSaveMessage(`Usuário ${user.firstName} ${user.lastName} salvo com sucesso!`);

      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));

      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setSavingUserId(null);
    }
  };

  const saveAllUsersToCSV = async () => {
    if (users.length === 0) {
      alert('Nenhum usuário para salvar');
      return;
    }

    setSavingUserId('all');
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users }),
      });

      if (!response.ok) {
        throw new Error('Failed to save users');
      }

      const data = await response.json();
      setSaveMessage(data.message);
      setUsers([]);

      setTimeout(() => {
        setSaveMessage(null);
      }, 5000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save users');
    } finally {
      setSavingUserId(null);
    }
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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity('');
    } else {
      const num = parseInt(value);
      if (!isNaN(num)) {
        setQuantity(num);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
      e.preventDefault();
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Buscar Novos Usuários</h1>
          <p className='text-gray-600'>
            Obtenha usuários aleatórios da API Random User e salve no arquivo CSV
          </p>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <div className='flex flex-col sm:flex-row gap-4 items-end '>
            <div className='flex-1 w-full'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Quantidade de usuários
              </label>
              <input
                type='number'
                min='1'
                max='100'
                value={quantity}
                onChange={handleQuantityChange}
                onKeyDown={handleKeyDown}
                placeholder='Digite a quantidade (1-100)'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              />
            </div>
            <button
              onClick={fetchRandomUsers}
              disabled={loading}
              className='px-6 py-2 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              {loading ? 'Buscando...' : 'Buscar Usuários'}
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6'>
            <p className='font-semibold'>✓ Sucesso!</p>
            <p>{saveMessage}</p>
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6'>
            <p className='font-semibold'>Erro:</p>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className='text-center py-12'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent'></div>
            <p className='mt-4 text-gray-600'>Buscando usuários...</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
              <div className='text-gray-600'>
                Usuários encontrados: <span className='font-semibold'>{users.length}</span>
                {users.length > ITEMS_PER_PAGE && (
                  <span className='text-sm ml-2'>
                    (Página {currentPage} de {Math.ceil(users.length / ITEMS_PER_PAGE)})
                  </span>
                )}
              </div>
              <button
                onClick={saveAllUsersToCSV}
                disabled={savingUserId === 'all'}
                className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                {savingUserId === 'all' ? '💾 Salvando...' : '💾 Salvar Todos no CSV'}
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {paginatedUsers.map((user) => (
                <div key={user.id} className='relative bg-gray-200 p-4 rounded-lg shadow-md'>
                  <UserCard user={user} showActions={false} />
                  <button
                    onClick={() => saveUserToCSV(user)}
                    disabled={savingUserId === user.id}
                    className='mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed'
                  >
                    {savingUserId === user.id ? '💾 Salvando...' : '💾 Salvar no CSV'}
                  </button>
                </div>
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

        {!loading && users.length === 0 && !error && (
          <div className='text-center py-12 bg-white rounded-lg shadow'>
            <p className='text-gray-600 text-lg'>
              Clique em &quot;Buscar Usuários&quot; para obter dados da API
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
