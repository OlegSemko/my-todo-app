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
  assignee_metadata: IUserMetaData;
  assignee_id: string;
  assignee_email: string;
  status: string | null;
  priority: number;
  due_date: string;
}

export interface IToDoComment {
  id: any;
  task_id: any;
  user_id: any;
  comment: string;
  created_at: string;
  user_email: string;
  user_metadata: IUserMetaData;
}
