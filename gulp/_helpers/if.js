import ifPlugin from 'gulp-if';
import { argv } from 'node:process';

export const IF = ifPlugin;
export const isBuild = argv.includes('--build');
