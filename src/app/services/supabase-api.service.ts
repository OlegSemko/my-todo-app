import { inject, Injectable } from '@angular/core';
import { from } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class SupabaseApiService {
  private supabase = inject(SupabaseService);

  getUserBoards(userId: string | undefined) {
    const promise = this.supabase.client
      .from('boards')
      .select(`
        id,
        title,
        owner_id,
        board_members(user_id)
      `)
      .eq('board_members.user_id', userId);

    return from(promise);
  }
}
