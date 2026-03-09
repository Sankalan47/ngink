import { useStdout, useStderr } from 'ink';

type StdoutStream = ReturnType<typeof useStdout>['stdout'];
type StderrStream = ReturnType<typeof useStderr>['stderr'];

let writeStdoutFn: ((data: string) => void) | null = null;
let writeStderrFn: ((data: string) => void) | null = null;
let stdoutStream: StdoutStream | null = null;
let stderrStream: StderrStream | null = null;

export function writeStdout(data: string): void { writeStdoutFn?.(data); }
export function writeStderr(data: string): void { writeStderrFn?.(data); }
export function getStdout(): StdoutStream | null { return stdoutStream; }
export function getStderr(): StderrStream | null { return stderrStream; }

export function TerminalBridge(): null {
  const { stdout, write: writeOut } = useStdout();
  const { stderr, write: writeErr } = useStderr();
  writeStdoutFn = writeOut;
  writeStderrFn = writeErr;
  stdoutStream  = stdout;
  stderrStream  = stderr;
  return null;
}
