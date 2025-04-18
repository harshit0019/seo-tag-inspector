import { useState, FormEvent } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

interface URLInputProps {
  onSubmit: (url: string) => void;
}

export default function URLInput({ onSubmit }: URLInputProps) {
  const [inputUrl, setInputUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate URL
      const urlSchema = z.string().url("Please enter a valid URL").refine(
        (url) => {
          return url.startsWith("http://") || url.startsWith("https://");
        },
        {
          message: "URL must start with http:// or https://",
        }
      );
      
      let processedUrl = inputUrl.trim();
      
      // Add https:// if not present
      if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
        processedUrl = `https://${processedUrl}`;
      }
      
      urlSchema.parse(processedUrl);
      onSubmit(processedUrl);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid URL",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full md:w-2/3 relative">
      <form onSubmit={handleSubmit} className="flex items-center relative">
        <input
          type="url"
          placeholder="Enter a URL (e.g., https://example.com)"
          className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          className="absolute right-0 h-full px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-r-lg transition-colors"
        >
          Analyze
        </button>
      </form>
    </div>
  );
}
