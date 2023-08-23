export enum EUserRole {
  user = "user",
  admin = "admin",
}

export interface IUser {
  _id: string;
  userName: string;
  roles: EUserRole[];
}
