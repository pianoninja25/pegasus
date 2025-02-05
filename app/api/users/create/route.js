import bcrypt from 'bcrypt';
import dbConnect from "@/utils/db-connection";
import { getServerSession } from 'next-auth';
import options from '../../auth/[...nextauth]/options';
import mysql from 'mysql2';

const saltRounds = 12;

async function checkSession(session) {
  if (!session) {
    throw new Error("You don't have the authorization!");
  }

  if (session.role !== 'superadmin' && session.role !== 'admin') {
    throw new Error('You are not authorized to perform this action');
  }
}

async function validateUserData(username, password) {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
}

async function validateTenantData(username, name, email, token, auth_id, radius_meter, prefix) {
  if (!username || !name || !email || !token || !auth_id || !radius_meter || !prefix) {
    throw new Error('All field is required');
  }
}

async function checkExistence(connection, username, type) {
  // Validate the 'type' parameter
  if (!['users', 'tenants'].includes(type)) {
    throw new Error('Invalid type specified');
  }

  const query = mysql.format('SELECT * FROM ?? WHERE username = ?', [type, username]);
  const [existingUser] = await connection.execute(query);

  if (existingUser.length > 0) {
    throw new Error(`${username} already exists.`);
  }
}

async function createUser(connection, { username, name, password, tenant, role }) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await connection.execute(
    'INSERT INTO users (username, name, password, tenant, role) VALUES (?, ?, ?, ?, ?)',
    [username, name, hashedPassword, tenant, role]
  );

  const [newUser] = await connection.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );

  return newUser[0];
}

async function createTenant(connection, { username, name, email, token, auth_id, radius_meter, prefix }) {
  try {
    // Insert tenant data into the database
    await connection.execute(
      'INSERT INTO tenants (username, name, email, token, auth_id, radius_meter, prefix) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, name, email, token, auth_id, radius_meter, prefix]
    );

    // Retrieve the newly created tenant from the database
    const [newTenant] = await connection.execute(
      'SELECT * FROM tenants WHERE username = ?',
      [username]
    );

    return newTenant[0];
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error(`The prefix '${prefix}' is already taken. Please choose another one.`);
    }
    throw new Error('An error occurred while creating the tenant.');
  }
}

export async function POST(req) {
  let connection;

  try {
    const session = await getServerSession(options);
    await checkSession(session.user);

    const { 
      type, 
      username, 
      name,
      password,
      tenant, 
      role, 
      email, 
      token, 
      auth_id, 
      radius_meter,
      prefix
    } = await req.json();

    connection = dbConnect('pegasus');

    if (type === 'users') {
      await validateUserData(username, password);
      await checkExistence(connection, username, type);

      const newUser = await createUser(connection, { username, name, password, tenant, role });

      // Omit password from response
      const { password: _, ...userWithoutPassword } = newUser;
      return new Response(JSON.stringify(userWithoutPassword), { status: 201 });

    } else if (type === 'tenants') {
      await validateTenantData(username, name, email, token, auth_id, radius_meter, prefix);
      await checkExistence(connection, username, type);

      const newTenant = await createTenant(connection, { username, name, email, token, auth_id, radius_meter, prefix });

      return new Response(JSON.stringify(newTenant), { status: 201 });

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid type' }),
        { status: 400 }
      );
    }

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: error.message ? 400 : 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
