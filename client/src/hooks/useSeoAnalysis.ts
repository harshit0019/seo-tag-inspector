import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { SeoAnalysisResult } from "@shared/schema";

export function useSeoAnalysis() {
  const [seoData, setSeoData] = useState<SeoAnalysisResult | null>(null);

  const {
    mutate: analyzeSeo,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      const data = await response.json();
      return data as SeoAnalysisResult;
    },
    onSuccess: (data) => {
      setSeoData(data);
    },
  });

  return {
    analyzeSeo,
    seoData,
    isLoading,
    error,
  };
}
