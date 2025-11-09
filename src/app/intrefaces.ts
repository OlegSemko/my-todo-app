export interface IOwnerBoard {
  id: number;
  owner_id: string;
  created_at: string;
  owner_email: string;
  title: string;
  raw_user_meta_data: {
    email: string;
    username: string;
  }
}

export interface IMemberBoard {
  id: number;
  owner: IUser;
  members: IUser[];
  created_at: string;
  owner_id: string;
  title: string;
}

export interface IUser {
  email: string;
  id: string;
  metadata: IUserMetaData;
}

export interface IUserMetaData {
  email: string;
  username: string;
  email_verified: boolean;
  sub: string;
  phone_verified: boolean;
}

export interface IToDo {
  board_id: number;
  id: number;
  description: string;
  title: string;
  created_by: string;
  created_at: string;
  owner_email: string;
  owner_metadata: IUserMetaData;
  status: string | null;
}
