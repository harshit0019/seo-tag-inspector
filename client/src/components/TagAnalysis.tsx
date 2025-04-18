import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import type { SeoAnalysisResult, Tag } from "@shared/schema";
import TagItem from "@/components/TagItem";

interface TagAnalysisProps {
  data: SeoAnalysisResult;
}

export default function TagAnalysis({ data }: TagAnalysisProps) {
  const exportReport = () => {
    const reportObject = {
      url: data.url,
      analyzedAt: data.analyzedAt,
      score: data.score,
      tags: {
        basic: {
          title: data.title,
          description: data.description,
          canonical: data.canonical,
          robots: data.robots,
          viewport: data.viewport
        },
        og: data.ogTags,
        twitter: data.twitterTags
      },
      recommendations: data.recommendations
    };
    
    const jsonString = JSON.stringify(reportObject, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `seo-report-${new URL(data.url).hostname}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate tag status counts
  const countTagsByStatus = (tags: Tag[]) => {
    return {
      good: tags.filter(tag => tag.status === 'good' && tag.value).length,
      warning: tags.filter(tag => tag.status === 'warning' && tag.value).length,
      missing: tags.filter(tag => tag.status === 'missing' || !tag.value).length
    };
  };

  // Count basic tags
  const basicTags = [data.title, data.description, data.canonical, data.robots, data.viewport];
  const basicTagCounts = countTagsByStatus(basicTags);

  // Count OG tags
  const ogTagCounts = countTagsByStatus(data.ogTags);

  // Count Twitter tags
  const twitterTagCounts = countTagsByStatus(data.twitterTags);

  // Count recommendation types
  const warningRecommendations = data.recommendations.filter(rec => rec.type === 'warning').length;
  const successRecommendations = data.recommendations.filter(rec => rec.type === 'success').length;

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
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
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          Meta Tag Analysis
        </h2>
        <Button 
          variant="ghost" 
          className="text-primary-600 hover:text-primary-800 flex items-center text-sm font-medium self-end sm:self-auto"
          onClick={exportReport}
          size="sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Report
        </Button>
      </div>
      
      <Tabs defaultValue="basic" className="w-full">
        <div className="px-4 pt-4 border-b border-gray-200">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-2 overflow-x-auto w-full">
            <TabsTrigger value="basic" className="text-xs md:text-sm px-2 py-1.5 md:px-3 md:py-2">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-4 md:w-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6H9l-7 6 7 6h11a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="10" x2="14" y2="10" />
                </svg>
                <span className="whitespace-nowrap">Basic Tags</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="opengraph" className="text-xs md:text-sm px-2 py-1.5 md:px-3 md:py-2">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-4 md:w-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" />
                </svg>
                <span className="whitespace-nowrap">Open Graph</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="text-xs md:text-sm px-2 py-1.5 md:px-3 md:py-2">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-4 md:w-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="whitespace-nowrap">Twitter Cards</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="text-xs md:text-sm px-2 py-1.5 md:px-3 md:py-2">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-4 md:w-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span className="whitespace-nowrap">Recommendations</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Basic SEO Tags Content */}
        <TabsContent value="basic" className="px-4 py-4">
          {/* Tag Status Summary */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-lg sm:text-xl font-bold text-green-600">{basicTagCounts.good}</div>
                    <div className="text-xs text-green-800">Good Tags</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tags that follow SEO best practices</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="text-lg sm:text-xl font-bold text-amber-600">{basicTagCounts.warning}</div>
                    <div className="text-xs text-amber-800">Warnings</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tags that need attention but aren't critical</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center p-2 sm:p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="text-lg sm:text-xl font-bold text-red-600">{basicTagCounts.missing}</div>
                    <div className="text-xs text-red-800">Missing</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Important tags that are missing or have issues</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Tag Explanations */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-1">Why Basic Tags Matter</h4>
            <p className="text-sm text-blue-700">
              Basic meta tags form the foundation of your SEO. They help search engines understand what your page is about and how to display it in search results.
            </p>
          </div>
          
          {/* Tag Items */}
          <div className="space-y-1">
            <TagItem tag={data.title} name="Title" />
            <TagItem tag={data.description} name="Description" />
            <TagItem tag={data.canonical} name="Canonical URL" />
            <TagItem tag={data.robots} name="Robots" />
            <TagItem tag={data.viewport} name="Viewport" />
          </div>
        </TabsContent>

        {/* Open Graph Tags Content */}
        <TabsContent value="opengraph" className="px-4 py-4">
          {/* Tag Status Summary */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
            <div className="flex flex-col items-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-lg sm:text-xl font-bold text-green-600">{ogTagCounts.good}</div>
              <div className="text-xs text-green-800">Good Tags</div>
            </div>
            <div className="flex flex-col items-center p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="text-lg sm:text-xl font-bold text-amber-600">{ogTagCounts.warning}</div>
              <div className="text-xs text-amber-800">Warnings</div>
            </div>
            <div className="flex flex-col items-center p-2 sm:p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="text-lg sm:text-xl font-bold text-red-600">{ogTagCounts.missing}</div>
              <div className="text-xs text-red-800">Missing</div>
            </div>
          </div>

          {/* Tag Explanations */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-1">Why Open Graph Tags Matter</h4>
            <p className="text-sm text-blue-700">
              Open Graph tags control how your content appears when shared on Facebook, LinkedIn, and other social platforms. They help create rich, engaging previews instead of plain links.
            </p>
          </div>
          
          {/* Tag Items */}
          {data.ogTags.length > 0 ? (
            <div className="space-y-1">
              {data.ogTags.map((tag, index) => (
                <TagItem key={`og-${index}`} tag={tag} name={tag.name} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-yellow-700 bg-yellow-50 p-4 rounded-md flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-yellow-600 flex-shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <p className="font-medium mb-1">No Open Graph tags were found</p>
                <p>Adding these tags will improve how your site appears when shared on social media platforms like Facebook and LinkedIn.</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Twitter Card Tags Content */}
        <TabsContent value="twitter" className="px-4 py-4">
          {/* Tag Status Summary */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
            <div className="flex flex-col items-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-lg sm:text-xl font-bold text-green-600">{twitterTagCounts.good}</div>
              <div className="text-xs text-green-800">Good Tags</div>
            </div>
            <div className="flex flex-col items-center p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="text-lg sm:text-xl font-bold text-amber-600">{twitterTagCounts.warning}</div>
              <div className="text-xs text-amber-800">Warnings</div>
            </div>
            <div className="flex flex-col items-center p-2 sm:p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="text-lg sm:text-xl font-bold text-red-600">{twitterTagCounts.missing}</div>
              <div className="text-xs text-red-800">Missing</div>
            </div>
          </div>

          {/* Tag Explanations */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-1">Why Twitter Card Tags Matter</h4>
            <p className="text-sm text-blue-700">
              Twitter Card tags control how your content appears when shared on Twitter. They help your content stand out in the Twitter feed with images and additional context.
            </p>
          </div>
          
          {/* Tag Items */}
          {data.twitterTags.length > 0 ? (
            <div className="space-y-1">
              {data.twitterTags.map((tag, index) => (
                <TagItem key={`twitter-${index}`} tag={tag} name={tag.name} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-yellow-700 bg-yellow-50 p-4 rounded-md flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-yellow-600 flex-shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <p className="font-medium mb-1">No Twitter Card tags were found</p>
                <p>Adding these tags will improve how your site appears when shared on Twitter.</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Recommendations Content */}
        <TabsContent value="recommendations" className="px-4 py-4">
          {/* Recommendations Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-amber-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <div className="text-lg sm:text-xl font-bold text-amber-600">{warningRecommendations}</div>
                <div className="text-xs text-amber-800">Issues to Address</div>
              </div>
            </div>
            <div className="flex items-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <div className="text-lg sm:text-xl font-bold text-green-600">{successRecommendations}</div>
                <div className="text-xs text-green-800">Good Practices</div>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Recommended Actions:</h4>
            <ul className="space-y-3">
              {data.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <span className={`${rec.type === 'warning' ? 'text-amber-500' : 'text-green-600'} mr-3 mt-0.5 flex-shrink-0`}>
                    {rec.type === 'warning' ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    )}
                  </span>
                  <span 
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{ __html: rec.message }}
                  />
                </li>
              ))}
              
              {data.recommendations.length === 0 && (
                <li className="text-sm text-green-700 bg-green-50 p-4 rounded flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="font-medium">Great job! We don't have any specific recommendations for improving your SEO tags.</span>
                </li>
              )}
            </ul>
          </div>
          
          {/* SEO Best Practices */}
          {warningRecommendations > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-1">SEO Best Practices</h4>
              <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                <li>Use descriptive, unique titles under 60 characters</li>
                <li>Write compelling meta descriptions between 120-158 characters</li>
                <li>Implement proper Open Graph and Twitter Card tags for social sharing</li>
                <li>Include a canonical URL to prevent duplicate content issues</li>
                <li>Set appropriate viewport settings for mobile users</li>
              </ul>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
