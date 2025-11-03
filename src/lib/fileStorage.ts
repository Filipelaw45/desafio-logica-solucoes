import fs from 'fs';
import path from 'path';
import { User } from '@/types/user';
import { userToCSV, csvToUser, getCSVHeader } from './csv';

const CSV_FILE_PATH = path.join(process.cwd(), 'data', 'users.csv');

function ensureDataDirectory() {
  const dataDir = path.dirname(CSV_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function ensureCSVFile() {
  ensureDataDirectory();
  if (!fs.existsSync(CSV_FILE_PATH)) {
    fs.writeFileSync(CSV_FILE_PATH, getCSVHeader() + '\n', 'utf-8');
  }
}

export function readUsers(): User[] {
  ensureCSVFile();
  const content = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
  const lines = content.split('\n').slice(1);
  
  return lines
    .map(line => csvToUser(line))
    .filter((user): user is User => user !== null);
}

export function writeUsers(users: User[]): void {
  ensureCSVFile();
  const content = [
    getCSVHeader(),
    ...users.map(user => userToCSV(user))
  ].join('\n');
  
  fs.writeFileSync(CSV_FILE_PATH, content + '\n', 'utf-8');
}

export function addUser(user: User): void {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

export function addUsers(newUsers: User[]): void {
  const users = readUsers();
  users.push(...newUsers);
  writeUsers(users);
}

export function updateUser(id: string, updatedUser: User): boolean {
  const users = readUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) return false;
  
  users[index] = updatedUser;
  writeUsers(users);
  return true;
}

export function deleteUser(id: string): boolean {
  const users = readUsers();
  const filteredUsers = users.filter(u => u.id !== id);
  
  if (filteredUsers.length === users.length) return false;
  
  writeUsers(filteredUsers);
  return true;
}

export function getUserById(id: string): User | null {
  const users = readUsers();
  return users.find(u => u.id === id) || null;
}

export function searchUsers(searchTerm: string, searchFields: string[] = ['firstName', 'lastName', 'email', 'city']): User[] {
  const users = readUsers();
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return users.filter(user => {
    return searchFields.some(field => {
      const value = user[field as keyof User];
      return String(value).toLowerCase().includes(lowerSearchTerm);
    });
  });
}
