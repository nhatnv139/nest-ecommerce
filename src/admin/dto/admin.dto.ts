export class CreateAdminDto {
    name: string;
    email: string;
    password: string;
    role: number;
  }
  
  export class UpdateAdminDto {
    name?: string;
    email?: string;
    // password?: string;
    role?: number;
  }