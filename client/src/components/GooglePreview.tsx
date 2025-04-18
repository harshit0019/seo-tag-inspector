import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SeoAnalysisResult } from "@shared/schema";

interface GooglePreviewProps {
  data: SeoAnalysisResult;
}

export default function GooglePreview({ data }: GooglePreviewProps) {
  // Format URL for display
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname.replace(/\/$/, "");
    } catch (e) {
      return url;
    }
  };

  // Count characters and determine if they're within Google's limits
  const titleLength = data.title.value?.length || 0;
  const descriptionLength = data.description.value?.length || 0;
  
  const titleStatus = titleLength > 0 ? 
    (titleLength < 30 ? "too-short" : 
     titleLength > 60 ? "too-long" : 
     "good") : "missing";
     
  const descriptionStatus = descriptionLength > 0 ? 
    (descriptionLength < 120 ? "too-short" : 
     descriptionLength > 158 ? "too-long" : 
     "good") : "missing";

  // Helper function for status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "good": return "text-green-600";
      case "too-short": 
      case "too-long": return "text-amber-600";
      case "missing": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusText = (status: string, type: "title" | "description") => {
    const lengths = type === "title" ? "30-60" : "120-158";
    switch(status) {
      case "good": return `Good length (${type === "title" ? titleLength : descriptionLength} chars)`;
      case "too-short": return `Too short - aim for ${lengths} chars`;
      case "too-long": return `Too long - might be truncated. Aim for ${lengths} chars`;
      case "missing": return `Missing ${type}`;
      default: return "";
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          Google Search Preview
        </h2>
        
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(titleStatus)} bg-opacity-10 bg-current border border-current flex items-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 6.1H3M21 12.1H3M21 18.1H3"/>
                  </svg>
                  <span>Title</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{getStatusText(titleStatus, "title")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(descriptionStatus)} bg-opacity-10 bg-current border border-current flex items-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 9V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3M21 15v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3M9 21h6M9 3h6"/>
                  </svg>
                  <span>Description</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{getStatusText(descriptionStatus, "description")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Desktop Search Preview */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          Desktop Search Result
        </p>
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div className={`text-xl text-blue-700 font-medium mb-1 ${titleStatus === "too-long" ? "line-clamp-1" : ""}`}>
            {data.title.value || 'No title found'}
          </div>
          <div className="text-green-800 text-sm mb-1 flex items-center">
            <span className="max-w-[500px] truncate">{formatUrl(data.url)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div className={`text-sm text-gray-600 ${descriptionStatus === "too-long" ? "line-clamp-2" : ""}`}>
            {data.description.value || 'No description found'}
          </div>
        </div>
      </div>
      
      {/* Mobile Search Preview */}
      <div>
        <p className="text-xs text-gray-500 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
          Mobile Search Result
        </p>
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm max-w-[320px]">
          <div className="text-green-800 text-xs mb-1 truncate">{formatUrl(data.url)}</div>
          <div className={`text-base text-blue-700 font-medium mb-1 ${titleStatus === "too-long" ? "line-clamp-1" : ""}`}>
            {data.title.value || 'No title found'}
          </div>
          <div className={`text-xs text-gray-600 ${descriptionStatus === "too-long" ? "line-clamp-2" : ""}`}>
            {data.description.value || 'No description found'}
          </div>
        </div>
      </div>
      
      {/* SEO Tips */}
      <div className="mt-4 p-2 bg-blue-50 rounded border border-blue-100 text-xs text-blue-700">
        <p className="font-medium mb-1">Google Search Best Practices:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Titles between 30-60 characters perform best</li>
          <li>Descriptions between 120-158 characters provide optimal visibility</li>
          <li>Use keywords naturally in both title and description</li>
        </ul>
      </div>
    </Card>
  );
}
