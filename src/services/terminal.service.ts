import { Injectable, signal } from '@angular/core';
import { writeStdout, writeStderr, getStdout, getStderr } from '../bridge/terminal-bridge.js';

@Injectable({ providedIn: 'root' })
export class TerminalService {
  readonly columns = signal<number>(process.stdout.columns ?? 80);
  readonly rows    = signal<number>(process.stdout.rows    ?? 24);

  constructor() {
    process.stdout.on('resize', () => {
      this.columns.set(process.stdout.columns ?? 80);
      this.rows.set(process.stdout.rows    ?? 24);
    });
  }

  write(text: string): void      { writeStdout(text); }
  writeError(text: string): void { writeStderr(text); }

  get stdout(): NodeJS.WriteStream | null { return getStdout(); }
  get stderr(): NodeJS.WriteStream | null { return getStderr(); }
}
