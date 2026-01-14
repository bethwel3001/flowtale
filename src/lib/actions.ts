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
  const { storyline, branchingPaths } = await suggestStoryStart({ topic });
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

  const { branchingPaths } = await suggestStoryStart({ topic: newStoryline });

  return {
    newStoryPart: newStoryline,
    newBranchingPaths: branchingPaths,
  };
}
