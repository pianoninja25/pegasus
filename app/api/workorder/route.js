import { NextResponse } from 'next/server';

const TOKEN_URL = process.env.WO_TOKEN_URL
const API_URL = process.env.WO_CREATE

async function getToken(email, password) {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password
    }),
  });

  if (!response.ok) {
    return NextResponse.json({
      returnMessage: 'You are not authorized to create an order. Please check your token.',
      statusCode: response.status,
    }, { status: response.status });
  }

  const data = await response.json();
  return data.body.accessToken;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, payload } = body;


    if (!email || !password) {
      throw new Error('Email and password are required!');
    }

    const token = await getToken(email, password);

    const apiResponse = await fetch(API_URL, {
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