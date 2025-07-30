
import { DefaultSession, DefaultJWT } from 'next-auth';

// Extend the Session interface
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string; // Add the id property here
    } & DefaultSession['user'];
  }

  // Extend the JWT interface if you also want 'id' directly on the token for other uses
  interface JWT extends DefaultJWT {
    id?: string; // This ensures token.sub is correctly mapped to token.id if you use it later
  }
}