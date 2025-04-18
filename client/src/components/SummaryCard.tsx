import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import type { SeoAnalysisResult, Tag } from "@shared/schema";

interface SummaryCardProps {
  data: SeoAnalysisResult;
}

export default function SummaryCard({ data }: SummaryCardProps) {
  // Calculate meta tag category scores
  const basicTagsTotal = 5; // title, description, canonical, robots, viewport
  const basicTagsPresent = [
    data.title, 
    data.description, 
    data.canonical, 
    data.robots, 
    data.viewport
  ].filter(tag => tag.value).length;
  const basicTagsScore = Math.round((basicTagsPresent / basicTagsTotal) * 100);

  // Calculate OG tags score - check if essential ones are present
  const essentialOgTags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
  const presentOgTags = essentialOgTags.filter(essential => 
    data.ogTags.some(tag => tag.name === essential && tag.value)
  );
  const ogTagsScore = Math.round((presentOgTags.length / essentialOgTags.length) * 100);

  // Calculate Twitter tags score
  const essentialTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
  const presentTwitterTags = essentialTwitterTags.filter(essential => 
    data.twitterTags.some(tag => tag.name === essential && tag.value)
  );
  const twitterTagsScore = Math.round((presentTwitterTags.length / essentialTwitterTags.length) * 100);

  // Helper to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  // Helper to get background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-100';
    if (score >= 50) return 'bg-amber-50 border-amber-100';
    return 'bg-red-50 border-red-100';
  };

  // Helper to get progress color based on score
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-primary-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3v18h18" />
          <path d="M18.4 9a9 9 0 0 0-9.1 8.8" />
          <path d="M13 17.8a9 9 0 0 0-8.8-8.8" />
        </svg>
        SEO Score Dashboard
      </h2>

      {/* Overall Score with Circular Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`text-center p-4 rounded-lg border ${getScoreBgColor(data.score)} col-span-1 flex flex-col items-center justify-center`}>
          <div className="relative w-24 h-24 mb-2">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                className="stroke-[2.5] fill-none stroke-gray-200"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`stroke-[2.5] fill-none ${getScoreColor(data.score)}`}
                strokeDasharray={`${data.score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-3xl font-bold ${getScoreColor(data.score)}`}>{data.score}%</div>
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-800">Overall SEO Score</div>
          <div className="text-xs text-gray-600 mt-1">
            {data.score >= 80 ? "Excellent" : 
             data.score >= 60 ? "Good" : 
             data.score >= 40 ? "Needs Improvement" : 
             "Poor"}
          </div>
        </div>

        {/* Category Scores */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Basic Meta Tags */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`p-4 rounded-lg border ${getScoreBgColor(basicTagsScore)}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-gray-700">Basic Meta Tags</div>
                    <div className={`text-lg font-bold ${getScoreColor(basicTagsScore)}`}>{basicTagsScore}%</div>
                  </div>
                  <Progress className="h-2 bg-gray-200" value={basicTagsScore}>
                    <div className={`h-full ${getProgressColor(basicTagsScore)} rounded-full`}></div>
                  </Progress>
                  <div className="text-xs text-gray-600 mt-2">
                    {basicTagsPresent} of {basicTagsTotal} tags present
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="p-2 max-w-xs">
                <p>Basic meta tags include title, description, canonical link, robots, and viewport settings.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Open Graph Tags */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`p-4 rounded-lg border ${getScoreBgColor(ogTagsScore)}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-gray-700">Open Graph</div>
                    <div className={`text-lg font-bold ${getScoreColor(ogTagsScore)}`}>{ogTagsScore}%</div>
                  </div>
                  <Progress className="h-2 bg-gray-200" value={ogTagsScore}>
                    <div className={`h-full ${getProgressColor(ogTagsScore)} rounded-full`}></div>
                  </Progress>
                  <div className="text-xs text-gray-600 mt-2">
                    {presentOgTags.length} of {essentialOgTags.length} tags present
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="p-2 max-w-xs">
                <p>Open Graph tags control how your content appears when shared on Facebook, LinkedIn and other platforms.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Twitter Card Tags */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`p-4 rounded-lg border ${getScoreBgColor(twitterTagsScore)}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-gray-700">Twitter Cards</div>
                    <div className={`text-lg font-bold ${getScoreColor(twitterTagsScore)}`}>{twitterTagsScore}%</div>
                  </div>
                  <Progress className="h-2 bg-gray-200" value={twitterTagsScore}>
                    <div className={`h-full ${getProgressColor(twitterTagsScore)} rounded-full`}></div>
                  </Progress>
                  <div className="text-xs text-gray-600 mt-2">
                    {presentTwitterTags.length} of {essentialTwitterTags.length} tags present
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="p-2 max-w-xs">
                <p>Twitter Card tags control how your content appears when shared on Twitter.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
        <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{data.totalTags}</div>
          <div className="text-xs sm:text-sm text-blue-800">
            <span className="hidden sm:inline">Tags Found</span>
            <span className="inline sm:hidden">Tags</span>
          </div>
        </div>
        <div className="text-center p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-100">
          <div className="text-2xl sm:text-3xl font-bold text-amber-600">{data.issuesCount}</div>
          <div className="text-xs sm:text-sm text-amber-800">
            <span className="hidden sm:inline">Issues Found</span>
            <span className="inline sm:hidden">Issues</span>
          </div>
        </div>
        <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-100">
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">{data.recommendations.length}</div>
          <div className="text-xs sm:text-sm text-purple-800">
            <span className="hidden sm:inline">Recommendations</span>
            <span className="inline sm:hidden">Advice</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-2">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-gray-500 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <path d="M12 12h.01" />
            <path d="M17 12h.01" />
            <path d="M7 12h.01" />
          </svg>
          <span className="text-gray-700 text-sm sm:text-base font-medium truncate">{data.url}</span>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 ml-6 sm:ml-0">
          Analyzed {new Date(data.analyzedAt).toLocaleTimeString()}
        </div>
      </div>
    </Card>
  );
}
