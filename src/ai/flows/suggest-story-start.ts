'use server';

/**
 * @fileOverview Genkit flow for suggesting a starting storyline and initial branching paths based on a user prompt.
 *
 * - `suggestStoryStart`:  A function that takes a topic or prompt and returns a suggested starting storyline with initial branching paths.
 * - `SuggestStoryStartInput`: The input type for the `suggestStoryStart` function.
 * - `SuggestStoryStartOutput`: The return type for the `suggestStoryStart` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStoryStartInputSchema = z.object({
  topic: z.string().describe('A topic or prompt for the story.'),
});

export type SuggestStoryStartInput = z.infer<typeof SuggestStoryStartInputSchema>;

const SuggestStoryStartOutputSchema = z.object({
  storyline: z.string().describe('A suggested starting storyline.'),
  branchingPaths: z.array(z.string()).describe('Initial branching paths for the story.'),
});

export type SuggestStoryStartOutput = z.infer<typeof SuggestStoryStartOutputSchema>;

export async function suggestStoryStart(input: SuggestStoryStartInput): Promise<SuggestStoryStartOutput> {
  return suggestStoryStartFlow(input);
}

const suggestStoryStartPrompt = ai.definePrompt({
  name: 'suggestStoryStartPrompt',
  input: {schema: SuggestStoryStartInputSchema},
  output: {schema: SuggestStoryStartOutputSchema},
  prompt: `You are a creative story writer. Given a topic, generate a storyline and suggest branching paths.

Topic: {{{topic}}}

Storyline:
Branching Paths:`, // Instructions to generate initial branching paths for the story.
});

const suggestStoryStartFlow = ai.defineFlow(
  {
    name: 'suggestStoryStartFlow',
    inputSchema: SuggestStoryStartInputSchema,
    outputSchema: SuggestStoryStartOutputSchema,
  },
  async input => {
    const {output} = await suggestStoryStartPrompt(input);
    return output!;
  }
);
