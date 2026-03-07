import React from 'react';
import { useStdout, useStderr } from 'ink';

let writeStdoutFn: ((data: string) => void) | null = null;
let writeStderrFn: ((data: string) => void) | null = null;
let stdoutStream: NodeJS.WriteStream | null = null;
let stderrStream: NodeJS.WriteStream | null = null;

export function writeStdout(data: string): void { writeStdoutFn?.(data); }
export function writeStderr(data: string): void { writeStderrFn?.(data); }
export function getStdout(): NodeJS.WriteStream | null { return stdoutStream; }
export function getStderr(): NodeJS.WriteStream | null { return stderrStream; }

export function TerminalBridge(): null {
  const { stdout, write: writeOut } = useStdout();
  const { stderr, write: writeErr } = useStderr();
  writeStdoutFn = writeOut;
  writeStderrFn = writeErr;
  stdoutStream  = stdout as unknown as NodeJS.WriteStream;
  stderrStream  = stderr as unknown as NodeJS.WriteStream;
  return null;
}
