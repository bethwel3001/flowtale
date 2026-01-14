'use server';

/**
 * @fileOverview A flow that generates new storylines based on user choices using the Gemini API.
 *
 * - generateNewStoryline - A function that generates new storylines.
 * - GenerateNewStorylineInput - The input type for the generateNewStoryline function.
 * - GenerateNewStorylineOutput - The return type for the generateNewStoryline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNewStorylineInputSchema = z.object({
  previousStory: z.string().describe('The previous story content.'),
  userChoice: z.string().describe('The user choice that influences the new storyline.'),
  storyGenre: z.string().describe('The genre of the story.'),
});
export type GenerateNewStorylineInput = z.infer<typeof GenerateNewStorylineInputSchema>;

const GenerateNewStorylineOutputSchema = z.object({
  newStoryline: z.string().describe('The newly generated storyline.'),
});
export type GenerateNewStorylineOutput = z.infer<typeof GenerateNewStorylineOutputSchema>;

export async function generateNewStoryline(input: GenerateNewStorylineInput): Promise<GenerateNewStorylineOutput> {
  return generateNewStorylineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNewStorylinePrompt',
  input: {schema: GenerateNewStorylineInputSchema},
  output: {schema: GenerateNewStorylineOutputSchema},
  prompt: `You are a creative story writer. Based on the previous story, the user's choice, and the story genre, generate a new storyline that expands the narrative.

Previous Story: {{{previousStory}}}
User Choice: {{{userChoice}}}
Story Genre: {{{storyGenre}}}

New Storyline:`, 
});

const generateNewStorylineFlow = ai.defineFlow(
  {
    name: 'generateNewStorylineFlow',
    inputSchema: GenerateNewStorylineInputSchema,
    outputSchema: GenerateNewStorylineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
