// typescript enum
export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export type User = {
  userId: number;
  username: string;
  role: UserRoles;
}