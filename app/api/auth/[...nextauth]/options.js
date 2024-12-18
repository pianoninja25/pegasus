import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "../../../../utils/db-connection";

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
            "SELECT * FROM users WHERE username = ?",
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

          // Successful authentication
          return {
            name: user.name,
            email: user.email,
            token: user.token,
            auth_id: user.auth_id,
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
          name: user.name,
          email: user.email,
          token: user.token,
          auth_id: user.auth_id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          name: token.user.name,
          email: token.user.email,
          token: token.user.token,
          auth_id: token.user.auth_id,
        };
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
