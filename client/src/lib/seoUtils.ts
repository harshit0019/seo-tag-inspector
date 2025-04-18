import type { Tag } from "@shared/schema";

export function getOgTagValue(ogTags: Tag[], propertyName: string): string | undefined {
  const tag = ogTags.find(tag => tag.name === propertyName);
  return tag?.value;
}

export function getTwitterTagValue(twitterTags: Tag[], propertyName: string): string | undefined {
  const tag = twitterTags.find(tag => tag.name === propertyName);
  return tag?.value;
}

export function calculateSeoScore(
  hasMandatoryTags: boolean,
  hasTitle: boolean, 
  hasDescription: boolean,
  hasCanonical: boolean,
  hasOgTags: boolean,
  hasTwitterTags: boolean,
  titleLength?: number,
  descriptionLength?: number,
  issuesCount: number = 0
): number {
  // Base score starts at 100 and we subtract for issues
  let score = 100;
  
  // Missing mandatory tags is a big problem
  if (!hasMandatoryTags) score -= 40;
  
  // Title related scoring
  if (!hasTitle) {
    score -= 20;
  } else if (titleLength) {
    // Title length checks (optimal is 50-60 chars)
    if (titleLength < 30) score -= 5;
    if (titleLength > 70) score -= 5;
  }
  
  // Description related scoring
  if (!hasDescription) {
    score -= 15;
  } else if (descriptionLength) {
    // Description length checks (optimal is 120-158 chars)
    if (descriptionLength < 80) score -= 5;
    if (descriptionLength > 170) score -= 5;
  }
  
  // Canonical URL is important for SEO
  if (!hasCanonical) score -= 10;
  
  // Social media tags
  if (!hasOgTags) score -= 10;
  if (!hasTwitterTags) score -= 5;
  
  // Additional deduction for each issue (capped)
  score -= Math.min(15, issuesCount * 5);
  
  // Ensure score doesn't go below 0
  return Math.max(0, Math.round(score));
}
