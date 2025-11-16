import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { IToDo } from '../intrefaces';

@Injectable({ providedIn: 'root' })
export class SupabaseApiService {
  private supabase = inject(SupabaseService);

  getUserBoards(userId: string | undefined) {
    const promise = this.supabase.client
      .from('boards_with_owner')
      .select('*');

    return from(promise);
  }

  getBoardDetails(boardId: number) {
    const promise = this.supabase.client
      .from('boards_with_members')
      .select('*')
      .eq('id', boardId)
      .single();

    return from(promise);
  }

  getBoardsWithMembers() {
    const promise = this.supabase.client
      .from('boards_with_members')
      .select('*')
  //     .or(`owner_id.eq.${userId}`)
  // .contains('members', [{ id: userId }]);
      // .or(`owner_id.eq.${userId},members->>id.eq.${userId}`); // works but not returns members

    return from(promise);
  }

  getBoardTodos(boardId: number) {
    const promise = this.supabase.client
      .from('tasks_with_owner')
      .select('*')
      .eq('board_id', boardId);

    return from(promise);
  }

  addBoard(userId: string, title: string) {
    const promise = this.supabase.client
      .from('boards')
      .insert([
        {
          title,
          owner_id: userId,
        },
      ])
      .select();

    return from(promise);
  }

  addTodo(userId: string, boardId: number, title: string, description: string) {
    const promise = this.supabase.client
      .from('tasks')
      .insert([
        {
          title,
          description,
          created_by: userId,
          board_id: boardId,
        },
      ])
      .select();

    return from(promise);
  }

  updateTodo(taskId: number, body: Partial<IToDo>) {
    const promise = this.supabase.client
      .from('tasks')
      .update(body)
      .eq('id', taskId)
      .select();

    return from(promise);
  }

  deleteTodo(taskId: number) {
    const promise = this.supabase.client
      .from('tasks')
      .delete()
      .eq('id', taskId);

    return from(promise);
  }

  addUserToBoard(boardId: number, userId: string) {
    const promise = this.supabase.client
      .from('board_members')
      .insert([
        {
          board_id: boardId,
          user_id: userId,
        },
      ])
      .select();

    return from(promise);
  }

  getAllUsers(): Observable<any> {
    const promise = this.supabase.client
      .from('user_profiles')
      .select('*');

    return from(promise);
  }

  // insert into board_members (board_id, user_id, role) values (...);
  // delete from board_members where board_id = ... and user_id = ...;
}
