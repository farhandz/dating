export type userType = {
  id: number;
  username: string;
  email: string;
  password: string;
  premium: boolean;
  verified: boolean;
  created_at: Date;
};

export type UserRes = Omit<userType, 'password'>;

export type BasicAuthRes = Pick<userType, 'password' | 'email' | 'id'>;

export type UserMiddleware = {
  user: UserRes;
};
