export interface EligibilityResult {
  isEligible: boolean;
  reason?: string;
  missingDependencies?: string[];
  completedDependencies?: string[];
}

export interface DependencyChain {
  puzzleId: string;
  dependencies: string[];
  level: number;
}
