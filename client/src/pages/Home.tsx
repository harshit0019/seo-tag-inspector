import { useState } from "react";
import URLInput from "@/components/URLInput";
import GooglePreview from "@/components/GooglePreview";
import SocialPreview from "@/components/SocialPreview";
import SummaryCard from "@/components/SummaryCard";
import TagAnalysis from "@/components/TagAnalysis";
import { useSeoAnalysis } from "@/hooks/useSeoAnalysis";
import { Loader2, Globe, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [url, setUrl] = useState("");
  const { 
    analyzeSeo, 
    seoData, 
    isLoading, 
    error 
  } = useSeoAnalysis();

  const handleSubmit = async (submittedUrl: string) => {
    setUrl(submittedUrl);
    await analyzeSeo(submittedUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <div className="text-primary mr-3 p-2 bg-primary-50 rounded-full">
              <Globe className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="text-xl font-bold text-primary-600">
              SEO Tag Inspector
            </h1>
          </div>
          <URLInput onSubmit={handleSubmit} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Initial State */}
        {!seoData && !isLoading && !error && (
          <div className="max-w-3xl mx-auto mt-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-10 w-10 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-primary-600">
                Analyze Your Website's SEO Tags
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Enter any URL in the search box above to get a comprehensive analysis of your site's SEO meta tags, including Google and social media previews.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-4 border border-gray-200 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 mb-1">Search Preview</h3>
                <p className="text-sm text-gray-600">See exactly how your site appears in Google search results</p>
              </Card>
              
              <Card className="p-4 border border-gray-200 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 mb-1">Social Previews</h3>
                <p className="text-sm text-gray-600">Preview how your content appears when shared on social media</p>
              </Card>
              
              <Card className="p-4 border border-gray-200 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="M18.4 9a9 9 0 0 0-9.1 8.8" />
                    <path d="M13 17.8a9 9 0 0 0-8.8-8.8" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 mb-1">SEO Score & Analysis</h3>
                <p className="text-sm text-gray-600">Get actionable recommendations to improve your SEO</p>
              </Card>
            </div>
            
            <div className="max-w-lg mx-auto">
              <Card className="p-4 border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h3 className="text-lg font-semibold mb-2 text-indigo-800">How to use the SEO Tag Inspector:</h3>
                <ol className="text-left text-gray-700 space-y-2 ml-6 list-decimal">
                  <li>Enter a website URL in the search box above</li>
                  <li>View your SEO score and tag analysis</li>
                  <li>Check how your site appears in search results and social media</li>
                  <li>Follow recommendations to improve your SEO performance</li>
                </ol>
              </Card>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full bg-primary-100 animate-ping opacity-75"></div>
              <div className="relative flex items-center justify-center w-full h-full">
                <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Analyzing SEO Tags...</h3>
            <p className="text-gray-600">Fetching and evaluating meta tags from {url}</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="max-w-lg mx-auto mt-8">
            <Card className="bg-red-50 border-red-200 p-6 mb-6 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-red-800">Unable to fetch URL</h3>
                  <p className="text-red-700 mt-2">
                    {error.toString()}
                  </p>
                  <div className="mt-4">
                    <Button 
                      onClick={() => setUrl("")}
                      variant="outline" 
                      className="bg-white hover:bg-red-50"
                    >
                      Try a different URL
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 border border-gray-200 bg-blue-50">
              <h3 className="font-medium text-blue-800 mb-2">Troubleshooting Tips:</h3>
              <ul className="text-sm text-blue-700 space-y-2 ml-6 list-disc">
                <li>Make sure the URL includes http:// or https://</li>
                <li>Check if the website is publicly accessible</li>
                <li>Some websites may block automated requests</li>
                <li>Try analyzing a different page from the same site</li>
              </ul>
            </Card>
          </div>
        )}

        {/* Results State */}
        {seoData && !isLoading && !error && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                <span className="mr-2">Analysis for</span>
                <span className="font-bold text-primary-700 truncate max-w-md">{url}</span>
              </h2>
              <p className="text-gray-600">
                Analyzed on {new Date(seoData.analyzedAt).toLocaleString()} • 
                <span className={`ml-2 ${seoData.score >= 80 ? "text-green-600" : seoData.score >= 60 ? "text-amber-600" : "text-red-600"}`}>
                  Overall score: {seoData.score}%
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Previews */}
              <div className="lg:col-span-1 space-y-6">
                <GooglePreview data={seoData} />
                <SocialPreview data={seoData} />
              </div>

              {/* Right Column: SEO Analysis */}
              <div className="lg:col-span-2 space-y-6">
                <SummaryCard data={seoData} />
                <TagAnalysis data={seoData} />
                <div className="flex justify-end">
                  <Button onClick={() => setUrl("")} variant="outline" className="flex items-center gap-2">
                    Analyze another URL <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-3">
            <Globe className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-primary-700">SEO Tag Inspector</h2>
          </div>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            A comprehensive tool for SEO professionals and web developers to analyze
            and improve website meta tags for better search engine visibility.
          </p>
          <div className="mt-4 text-xs text-gray-500">
            Made for SEO professionals and web developers • {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
