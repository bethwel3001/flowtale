'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBranchingPathsInputSchema = z.object({
  storyline: z.string().describe('The current storyline.'),
  genre: z.string().describe('The genre of the story.'),
});

export type GenerateBranchingPathsInput = z.infer<typeof GenerateBranchingPathsInputSchema>;

const GenerateBranchingPathsOutputSchema = z.object({
  branchingPaths: z.array(z.string()).describe('Branching paths for the story.'),
});

export type GenerateBranchingPathsOutput = z.infer<typeof GenerateBranchingPathsOutputSchema>;

export async function generateBranchingPaths(input: GenerateBranchingPathsInput): Promise<GenerateBranchingPathsOutput> {
  return generateBranchingPathsFlow(input);
}

const generateBranchingPathsPrompt = ai.definePrompt({
  name: 'generateBranchingPathsPrompt',
  input: {schema: GenerateBranchingPathsInputSchema},
  output: {schema: GenerateBranchingPathsOutputSchema},
  prompt: `You are a creative story writer. Given a storyline and genre, create a few branching paths for the user to choose from.

Storyline: {{{storyline}}}
Genre: {{{genre}}}

Branching Paths:`, 
});

const generateBranchingPathsFlow = ai.defineFlow(
  {
    name: 'generateBranchingPathsFlow',
    inputSchema: GenerateBranchingPathsInputSchema,
    outputSchema: GenerateBranchingPathsOutputSchema,
  },
  async input => {
    const {output} = await generateBranchingPathsPrompt(input);
    return output!;
  }
);
