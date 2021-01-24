import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),

    // ...add more providers here
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    redirect: async (url, baseUrl) => {
      return Promise.resolve(baseUrl + "/editor");
    },
  },
  // A database is optional, but required to persist accounts in a database
  database: process.env.DB_URL,
};

export default (req, res) => NextAuth(req, res, options);
