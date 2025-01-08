import { NextResponse } from 'next/server';

const API_URL = process.env.WO_TICKET_LIST;

async function getToken(username, password) {
  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, payload } = body;


    if (!username || !password) {
      throw new Error('username and password are required!');
    }

    const token = await getToken(username, password);
    const apiResponse = await fetch(`${API_URL}/create_ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: apiResponse.status });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}