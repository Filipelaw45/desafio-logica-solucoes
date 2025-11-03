import { NextResponse } from 'next/server';
import { readUsers, addUsers, searchUsers } from '@/lib/fileStorage';
import { User } from '@/types/user';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');

    let users: User[];
    
    if (searchTerm) {
      users = searchUsers(searchTerm);
    } else {
      users = readUsers();
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error reading users:', error);
    return NextResponse.json(
      { error: 'Failed to read users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { users } = await request.json();

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid users data' },
        { status: 400 }
      );
    }

    addUsers(users);

    return NextResponse.json(
      { message: `${users.length} user(s) saved successfully` },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving users:', error);
    return NextResponse.json(
      { error: 'Failed to save users' },
      { status: 500 }
    );
  }
}
