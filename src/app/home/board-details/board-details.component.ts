import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { SupabaseApiService } from "../../services/supabase-api.service";
import { IToDo } from "../../intrefaces";

@Component({
    selector: 'app-board-details',
    templateUrl: './board-details.component.html',
    styleUrl: './board-details.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BoardDetailsComponent implements OnInit {
    supabaseAliService = inject(SupabaseApiService);
    readonly todos: WritableSignal<IToDo[]> = signal<IToDo[]>([]);

    ngOnInit(): void {
        this.getUsersBoards();
    }

    private getUsersBoards(): void {
        this.supabaseAliService.getBoardTodos(1).subscribe((result) => {
            if (result.error) {
                console.log('error',result.error?.message);
            } else {
                console.log('success', result);
                this.todos.set(result.data);
            }
        })
    }
}
