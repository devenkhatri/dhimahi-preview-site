import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

export async function GET() {
  try {
    const settingsPath = join(process.cwd(), 'content/settings/general.yml');
    const fileContents = readFileSync(settingsPath, 'utf8');
    const settings = yaml.load(fileContents);
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error loading general settings:', error);
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}