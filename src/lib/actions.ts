"use server";

import { suggestStoryStart } from "@/ai/flows/suggest-story-start";
import { generateNewStoryline } from "@/ai/flows/generate-new-storyline";
import type { Story, StoryNode } from "@/types";

interface ContinueStoryResult {
  newStoryPart: string;
  newBranchingPaths: string[];
}

export async function startStory(
  topic: string,
  genre: string
): Promise<Omit<Story, "id">> {
  const { characters, storyline, branchingPaths } = await suggestStoryStart({ topic, genre });
  const rootNodeId = crypto.randomUUID();
  const rootNode: StoryNode = {
    id: rootNodeId,
    storyPart: storyline,
    parentId: null,
    choice: null,
    branchingPaths: branchingPaths,
  };

  return {
    title: topic,
    genre,
    characters: characters,
    nodes: {
      [rootNodeId]: rootNode,
    },
    rootNodeId,
    currentNodeId: rootNodeId,
  };
}

export async function continueStory(
  story: Story,
  choice: string
): Promise<ContinueStoryResult> {
  const currentNode = story.nodes[story.currentNodeId];
  if (!currentNode) {
    throw new Error("Current node not found");
  }

  const { newStoryline } = await generateNewStoryline({
    previousStory: currentNode.storyPart,
    userChoice: choice,
    storyGenre: story.genre,
  });
  
  // We can call a different, simpler flow here that only generates branching paths.
  // For now, we'll reuse suggestStoryStart and just take its branching paths.
  const { branchingPaths } = await suggestStoryStart({ topic: newStoryline, genre: story.genre });

  return {
    newStoryPart: newStoryline,
    newBranchingPaths: branchingPaths,
  };
}
