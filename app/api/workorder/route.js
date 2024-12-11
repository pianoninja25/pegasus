import { NextResponse } from 'next/server';

const API_URL = 'http://10.10.4.2/amt/1.1/eda/productOrderManagement/v4/productOrder';
const TOKEN_URL = 'http://10.10.4.2/amt/1.1/atm/generateToken';

async function getToken() {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'Pramana@ioh.co.id',
      password: 'ltsm321Q@',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve token');
  }

  const data = await response.json();
  console.log(data.body.accessToken)
  return data.body.accessToken;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const token = await getToken();

    const apiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
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
