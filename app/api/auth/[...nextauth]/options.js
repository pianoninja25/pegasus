import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "../../../../utils/db-connection";
import axios from "axios";

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username :",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "Password :",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        try {
          const [results] = await dbConnect("pegasus").query(
            `
            SELECT 
              a.username,
              tenant,
              a.name,
              role,
              email,
              pass_id,
              auth_id,
              radius_meter,
              prefix,
              password
            FROM users a
            LEFT JOIN tenants b ON a.tenant = b.username
            WHERE a.username = ?`,
            [credentials.username]
          );

          if (results.length === 0) {
            return null; // User not found
          }

          const user = results[0];

          // Compare password using bcrypt
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch) {
            return null; // Invalid password
          }



          // Get token from the backend server
          const response = await axios.post(`${process.env.PEGASUS_API}/token`, {
            username: credentials.username,
            password: credentials.password,
          });
          if (response.status !== 200) {
            return null;
          }
          const { access_token, refresh_token } = response.data;

          // Successful authentication
          return {
            username: user.username,
            tenant: user.tenant,
            name: user.name,
            role: user.role,
            email: user.email,
            pass_id: user.pass_id,
            auth_id: user.auth_id,
            access_token: access_token,
            refresh_token: refresh_token,


          };
        } catch (error) {
          console.error("Error occurred during authorization:", error);
          return null;
        } finally {
          dbConnect("pegasus").releaseConnection();
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          username: user.username,
          tenant: user.tenant,
          name: user.name,
          role: user.role,
          email: user.email,
          pass_id: user.pass_id,
          auth_id: user.auth_id,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    updateAge: 60 * 60,
    maxAge: 60 * 60 * 8,
  },
};

export default options;
