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
  nodes: Record<string, StoryNode>;
  rootNodeId: string;
  currentNodeId: string;
}
