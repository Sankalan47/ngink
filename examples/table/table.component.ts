import { Component } from '@angular/core';
import { Box, Text } from '../../src/index.js';

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 0, name: 'alice_wonder', email: 'alice@example.com' },
  { id: 1, name: 'bob_builder', email: 'bob@example.com' },
  { id: 2, name: 'carol_danvers', email: 'carol@example.com' },
  { id: 3, name: 'dave_grohl', email: 'dave@example.com' },
  { id: 4, name: 'eve_online', email: 'eve@example.com' },
  { id: 5, name: 'frank_castle', email: 'frank@example.com' },
  { id: 6, name: 'grace_hopper', email: 'grace@example.com' },
  { id: 7, name: 'hank_pym', email: 'hank@example.com' },
  { id: 8, name: 'iris_west', email: 'iris@example.com' },
  { id: 9, name: 'jack_sparrow', email: 'jack@example.com' },
];

@Component({
  standalone: true,
  selector: 'app-table',
  template: `
    <Box [flexDirection]="'column'" [width]="80">
      <Box>
        <Box [width]="'10%'">
          <Text [bold]="true">ID</Text>
        </Box>
        <Box [width]="'50%'">
          <Text [bold]="true">Name</Text>
        </Box>
        <Box [width]="'40%'">
          <Text [bold]="true">Email</Text>
        </Box>
      </Box>

      @for (user of users; track user.id) {
        <Box>
          <Box [width]="'10%'">
            <Text [dimColor]="true">{{ user.id }}</Text>
          </Box>
          <Box [width]="'50%'">
            <Text>{{ user.name }}</Text>
          </Box>
          <Box [width]="'40%'">
            <Text [color]="'cyan'">{{ user.email }}</Text>
          </Box>
        </Box>
      }
    </Box>
  `,
  imports: [Box, Text],
})
export class TableComponent {
  users = users;
}
