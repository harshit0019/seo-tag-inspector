import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSeoTags } from "./seoAnalyzer";
import { z } from "zod";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to analyze SEO tags
  app.post('/api/analyze', async (req, res) => {
    try {
      // Validate the request body
      const schema = z.object({
        url: z.string().url()
      });
      
      const { url } = schema.parse(req.body);
      
      // Analyze the SEO tags
      const analysisResult = await analyzeSeoTags(url);
      
      res.json(analysisResult);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Invalid URL provided",
          details: error.errors
        });
      } else {
        console.error("Error analyzing URL:", error);
        res.status(500).json({
          message: error instanceof Error ? error.message : "Failed to analyze the provided URL"
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
