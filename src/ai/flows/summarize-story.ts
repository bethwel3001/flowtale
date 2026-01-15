'use server';

/**
 * @fileOverview A flow that summarizes a story and provides a final title and conclusion.
 *
 * - summarizeStory - A function that generates a story summary.
 * - SummarizeStoryInput - The input type for the summarizeStory function.
 * - SummarizeStoryOutput - The return type for the summarizeStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeStoryInputSchema = z.object({
  storyHistory: z.array(z.string()).describe('An array of all the story parts in chronological order.'),
  storyTitle: z.string().describe('The original title/topic of the story.'),
  storyGenre: z.string().describe('The genre of the story.'),
});
export type SummarizeStoryInput = z.infer<typeof SummarizeStoryInputSchema>;

const SummarizeStoryOutputSchema = z.object({
  finalTitle: z.string().describe('A new, catchy title for the completed story, based on the narrative.'),
  conclusion: z.string().describe('A concluding paragraph that wraps up the entire story arc.'),
});
export type SummarizeStoryOutput = z.infer<typeof SummarizeStoryOutputSchema>;

export async function summarizeStory(input: SummarizeStoryInput): Promise<SummarizeStoryOutput> {
  return summarizeStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeStoryPrompt',
  input: {schema: SummarizeStoryInputSchema},
  output: {schema: SummarizeStoryOutputSchema},
  prompt: `You are an expert storyteller. The user has completed their interactive story. Your task is to provide a satisfying conclusion.

Based on the entire story history provided, write a final concluding paragraph that brings the narrative to a close.
Then, create a new, more descriptive title for the story that reflects the journey the user took.

Original Title: {{{storyTitle}}}
Genre: {{{storyGenre}}}
Story History:
{{#each storyHistory}}
- {{{this}}}
{{/each}}
`,
});

const summarizeStoryFlow = ai.defineFlow(
  {
    name: 'summarizeStoryFlow',
    inputSchema: SummarizeStoryInputSchema,
    outputSchema: SummarizeStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
