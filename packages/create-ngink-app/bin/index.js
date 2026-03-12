#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const arg = process.argv[2];

if (!arg) {
  console.error('Usage: create-ngink-app <project-name>');
  console.error('       create-ngink-app .');
  process.exit(1);
}

const isDot = arg === '.';
const targetDir = isDot ? process.cwd() : path.resolve(process.cwd(), arg);
const projectName = isDot ? path.basename(process.cwd()) : arg;

// Validate project name
if (!/^[a-z0-9_-][a-z0-9._-]*$/i.test(projectName)) {
  console.error(`Invalid project name: "${projectName}"`);
  process.exit(1);
}

// Check if target dir is empty (only check when creating a new named dir)
if (!isDot) {
  if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir).filter(f => f !== '.git');
    if (files.length > 0) {
      console.error(`Error: directory "${arg}" already exists and is not empty.`);
      process.exit(1);
    }
  }
} else {
  // For `.`, warn if non-empty
  const files = fs.readdirSync(targetDir).filter(f => f !== '.git');
  if (files.length > 0) {
    console.error(`Error: current directory is not empty.`);
    process.exit(1);
  }
}

const templatesDir = path.join(__dirname, '..', 'templates');

function copyDir(src, dest, transformFn) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    // Rename gitignore -> .gitignore
    const destName = entry.name === 'gitignore' ? '.gitignore' : entry.name;
    const destPath = path.join(dest, destName);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, transformFn);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      if (transformFn) content = transformFn(srcPath, content);
      fs.writeFileSync(destPath, content);
    }
  }
}

console.log(`\nCreating ng-ink app: ${projectName}\n`);

fs.mkdirSync(targetDir, { recursive: true });

copyDir(templatesDir, targetDir, (filePath, content) => {
  // Only substitute in package.json template
  if (path.basename(filePath) === 'package.json') {
    return content.replace(/\{\{projectName\}\}/g, projectName);
  }
  return content;
});

console.log('Installing dependencies...\n');
execSync('npm install', { cwd: targetDir, stdio: 'inherit' });

const rel = isDot ? '.' : arg;
console.log(`
  Done! Your ng-ink app is ready.

  ${isDot ? 'Get started:' : `Get started:\n\n    cd ${rel}`}
${isDot ? '' : ''}
    npm run dev   # start with hot-reload
    npm start     # run once

  Press q (on empty input) or Ctrl+C to exit the app.
`);
