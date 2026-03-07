import { Component, signal, computed, OnDestroy } from '@angular/core';
import { Box, Text, Newline } from '../../src/components/index.js';

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

@Component({
  standalone: true,
  selector: 'app-todo',
  template: `
    <Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'" [borderColor]="'cyan'">
      <Text [bold]="true" [color]="'cyan'">ngink — Phase 4: &#64;if / &#64;for</Text>
      <Text [dimColor]="true">{{ done() }}/{{ todos().length }} complete</Text>
      <Newline />

      @if (todos().length === 0) {
        <Text [dimColor]="true">No todos yet — adding shortly...</Text>
      } @else {
        @for (todo of todos(); track todo.id) {
          <Box>
            <Text [color]="todo.done ? 'green' : 'white'">
              {{ todo.done ? '✓' : '○' }} {{ todo.text }}
            </Text>
          </Box>
        }
      }

      <Newline />
      <Text [dimColor]="true">Ctrl+C to exit</Text>
    </Box>
  `,
  imports: [Box, Text, Newline],
})
export class TodoComponent implements OnDestroy {
  todos = signal<TodoItem[]>([]);
  done = computed(() => this.todos().filter((t) => t.done).length);

  private id = 0;

  // Add a new todo every 1.5s, then mark the oldest undone one complete after 0.5s
  private addTimer = setInterval(() => {
    this.id++;
    const text = ['Build ngink', 'Add signals', 'Support if/for', 'Keyboard input', 'Publish to npm'][
      (this.id - 1) % 5
    ];
    this.todos.update((list) => [...list, { id: this.id, text, done: false }]);

    setTimeout(() => {
      this.todos.update((list) => {
        const firstUndone = list.findIndex((t) => !t.done);
        if (firstUndone === -1) return list;
        return list.map((t, i) => (i === firstUndone ? { ...t, done: true } : t));
      });
    }, 800);
  }, 1500);

  ngOnDestroy(): void {
    clearInterval(this.addTimer);
  }
}
