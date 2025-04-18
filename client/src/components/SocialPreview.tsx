import { Card } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import type { SeoAnalysisResult } from "@shared/schema";
import { getOgTagValue, getTwitterTagValue } from "@/lib/seoUtils";

interface SocialPreviewProps {
  data: SeoAnalysisResult;
}

export default function SocialPreview({ data }: SocialPreviewProps) {
  // Get OG values
  const ogTitle = getOgTagValue(data.ogTags, 'og:title') || data.title.value;
  const ogDescription = getOgTagValue(data.ogTags, 'og:description') || data.description.value;
  const ogType = getOgTagValue(data.ogTags, 'og:type');
  const ogUrl = getOgTagValue(data.ogTags, 'og:url');
  
  // Get Twitter values
  const twitterTitle = getTwitterTagValue(data.twitterTags, 'twitter:title') || ogTitle;
  const twitterDescription = getTwitterTagValue(data.twitterTags, 'twitter:description') || ogDescription;
  const twitterCard = getTwitterTagValue(data.twitterTags, 'twitter:card');
  const twitterSite = getTwitterTagValue(data.twitterTags, 'twitter:site');

  // Format domain for display
  const formatDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  };

  // Check for essential tags
  const hasFacebookRequiredTags = Boolean(ogTitle && ogDescription && data.ogImage);
  const hasTwitterRequiredTags = Boolean(twitterTitle && twitterDescription && twitterCard && data.twitterImage);

  // Get tag status indicators
  const getFacebookStatusIndicator = () => {
    if (!hasFacebookRequiredTags) {
      const missingTags = [];
      if (!ogTitle) missingTags.push('title');
      if (!ogDescription) missingTags.push('description');
      if (!data.ogImage) missingTags.push('image');
      if (!ogType) missingTags.push('type');
      if (!ogUrl) missingTags.push('url');
      
      return {
        status: 'warning',
        message: `Missing: ${missingTags.join(', ')}`
      };
    }
    
    return {
      status: 'success',
      message: 'All required tags present'
    };
  };

  const getTwitterStatusIndicator = () => {
    if (!hasTwitterRequiredTags) {
      const missingTags = [];
      if (!twitterTitle) missingTags.push('title');
      if (!twitterDescription) missingTags.push('description');
      if (!twitterCard) missingTags.push('card');
      if (!data.twitterImage) missingTags.push('image');
      if (!twitterSite) missingTags.push('site');
      
      return {
        status: 'warning',
        message: `Missing: ${missingTags.join(', ')}`
      };
    }
    
    return {
      status: 'success',
      message: 'All required tags present'
    };
  };

  const facebookStatus = getFacebookStatusIndicator();
  const twitterStatus = getTwitterStatusIndicator();

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
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Social Media Previews
        </h2>
      </div>

      <Tabs defaultValue="facebook" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="facebook" className="relative">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-blue-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
              {facebookStatus.status === 'warning' && (
                <Badge variant="outline" className="ml-1 bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] h-4">
                  !
                </Badge>
              )}
            </div>
          </TabsTrigger>

          <TabsTrigger value="twitter" className="relative">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              <span>Twitter</span>
              {twitterStatus.status === 'warning' && (
                <Badge variant="outline" className="ml-1 bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] h-4">
                  !
                </Badge>
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Facebook Preview */}
        <TabsContent value="facebook" className="space-y-4">
          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-start">
              <div className={`h-5 w-5 flex-shrink-0 mr-2 rounded-full ${facebookStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                {facebookStatus.status === 'warning' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${facebookStatus.status === 'warning' ? 'text-yellow-700' : 'text-green-700'}`}>
                  {facebookStatus.status === 'warning' ? 'Facebook Tags Need Attention' : 'Facebook Tags Look Good'}
                </h4>
                <p className="text-xs text-gray-600">{facebookStatus.message}</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-2 cursor-help">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Facebook requires og:title, og:description, og:image, og:url, and og:type tags for a complete preview.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden mx-auto max-w-sm shadow-sm">
            {/* Header - simulating Facebook post interface */}
            <div className="bg-white p-2 border-b border-gray-200 flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">f</div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Facebook User</div>
                <div className="text-xs text-gray-500">Just now · 🌐</div>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </div>
            </div>

            <div className="bg-white p-2 text-sm">
              Check out this interesting page!
            </div>

            {/* Link preview card */}
            <div className="border border-gray-300 rounded-md overflow-hidden bg-gray-200 m-2">
              <div className="h-40 relative">
                {data.ogImage ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <img
                      src={data.ogImage}
                      className="w-full h-full object-cover"
                      alt="Open Graph preview"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Available';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400 mx-auto mb-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <p className="text-gray-500 text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white">
                <div className="text-xs text-gray-500 uppercase">{formatDomain(data.url)}</div>
                <div className="text-gray-900 font-medium line-clamp-1">
                  {ogTitle || 'No title available'}
                </div>
                <div className="text-gray-600 text-xs line-clamp-2">
                  {ogDescription || 'No description available'}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-around p-2 border-t border-gray-200 text-gray-500 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                Like
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Comment
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Share
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700">
            <p className="font-medium mb-1">Why Facebook Sharing Matters:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Rich previews drive significantly higher click-through rates</li>
              <li>Proper Open Graph tags create professional-looking shared content</li>
              <li>Facebook uses og:image with 1.91:1 ratio (1200×630px recommended)</li>
            </ul>
          </div>
        </TabsContent>

        {/* Twitter Preview */}
        <TabsContent value="twitter" className="space-y-4">
          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-start">
              <div className={`h-5 w-5 flex-shrink-0 mr-2 rounded-full ${twitterStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                {twitterStatus.status === 'warning' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${twitterStatus.status === 'warning' ? 'text-yellow-700' : 'text-green-700'}`}>
                  {twitterStatus.status === 'warning' ? 'Twitter Tags Need Attention' : 'Twitter Tags Look Good'}
                </h4>
                <p className="text-xs text-gray-600">{twitterStatus.message}</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-2 cursor-help">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Twitter requires twitter:card, twitter:title, twitter:description, and twitter:image tags for a complete card.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden mx-auto max-w-sm shadow-sm">
            {/* Header - simulating Twitter interface */}
            <div className="bg-white p-3 border-b border-gray-200 flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold mr-3">@</div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="font-bold text-gray-900">Twitter User</div>
                  <div className="ml-1 text-gray-500 text-sm">@twitteruser</div>
                </div>
                <div className="text-sm mt-1">
                  Check out this interesting page! 👇
                </div>
              </div>
            </div>

            {/* Link preview card */}
            <div className="border border-gray-300 rounded overflow-hidden m-3">
              <div className="bg-gray-200 h-40 relative">
                {data.twitterImage ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <img
                      src={data.twitterImage}
                      className="w-full h-full object-cover"
                      alt="Twitter Card preview"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Available';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400 mx-auto mb-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <p className="text-gray-500 text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white">
                <div className="text-gray-900 font-medium line-clamp-1">
                  {twitterTitle || 'No title available'}
                </div>
                <div className="text-gray-600 text-sm line-clamp-2">
                  {twitterDescription || 'No description available'}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center">
                  <span className="mr-1">{formatDomain(data.url)}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between p-3 text-gray-500 border-t border-gray-200">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
                </svg>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700">
            <p className="font-medium mb-1">Why Twitter Cards Matter:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Twitter Cards make your content stand out in users' feeds</li>
              <li>They drive higher engagement rates compared to plain text tweets</li>
              <li>The ideal image size is 1200×628 pixels with a 1.91:1 ratio</li>
              <li>Set twitter:card to "summary_large_image" for best visibility</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
