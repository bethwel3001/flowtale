import { config } from 'dotenv';
config();

import '@/ai/flows/generate-new-storyline.ts';
import '@/ai/flows/suggest-story-start.ts';
import '@/ai/flows/summarize-story.ts';
