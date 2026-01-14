export interface StoryCharacter {
  name: string;
  description: string;
}

export interface StoryNode {
  id: string;
  storyPart: string;
  parentId: string | null;
  choice: string | null;
  branchingPaths: string[];
}

export interface Story {
  id: string;
  title: string;
  genre: string;
  characters: StoryCharacter[];
  nodes: Record<string, StoryNode>;
  rootNodeId: string;
  currentNodeId: string;
}
