export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  };

  export const jwtAdminConstants = {
    secret: process.env.JWT_SECRET_ADMIN || 'your-secret-key_admin',
  };