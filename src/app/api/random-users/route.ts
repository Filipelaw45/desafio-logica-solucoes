import { NextResponse } from 'next/server';
import { RandomUserResponse, User } from '@/types/user';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const results = searchParams.get('results') || '10';

  try {
    const response = await fetch(`https://randomuser.me/api/?results=${results}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch users from Random User API');
    }

    const data: RandomUserResponse = await response.json();
    
    const users: User[] = data.results.map(result => ({
      id: result.login.uuid,
      firstName: result.name.first,
      lastName: result.name.last,
      email: result.email,
      phone: result.phone,
      city: result.location.city,
      country: result.location.country,
      picture: result.picture.large,
      gender: result.gender,
      age: result.dob.age,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching random users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
