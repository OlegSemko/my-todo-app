export interface IBoard {
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

export interface IToDo {
  id: number;
  text: string;
  title: string;
}
