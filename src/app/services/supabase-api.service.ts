import { inject, Injectable } from '@angular/core';
import { from, map } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class SupabaseApiService {
  private supabase = inject(SupabaseService);

  getUserBoards(userId: string | undefined) {
    const promise = this.supabase.client
    .from('boards_with_owner')
  .select('*');
      // .from('boards')
      // .select(`
      //   id,
      //   title,
      //   owner_id,
      //   board_members(user_id)
      // `)
      // .eq('board_members.user_id', userId);
      // .or(`owner_id.eq.${userId},board_members.user_id.eq.${userId}`);

    return from(promise);
  }

  getBoardTodos(boardId: number) {
    const promise = this.supabase.client
    .from('tasks')
  .select('*');
      // .from('boards')
      // .select(`
      //   id,
      //   title,
      //   owner_id,
      //   board_members(user_id)
      // `)
      // .eq('board_members.user_id', userId);
      // .or(`owner_id.eq.${userId},board_members.user_id.eq.${userId}`);

    return from(promise);
  }
}
