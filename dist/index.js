// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/seoAnalyzer.ts
import fetch from "node-fetch";
import * as cheerio from "cheerio";

// client/src/lib/seoUtils.ts
function calculateSeoScore(hasMandatoryTags, hasTitle, hasDescription, hasCanonical, hasOgTags, hasTwitterTags, titleLength, descriptionLength, issuesCount = 0) {
  let score = 100;
  if (!hasMandatoryTags) score -= 40;
  if (!hasTitle) {
    score -= 20;
  } else if (titleLength) {
    if (titleLength < 30) score -= 5;
    if (titleLength > 70) score -= 5;
  }
  if (!hasDescription) {
    score -= 15;
  } else if (descriptionLength) {
    if (descriptionLength < 80) score -= 5;
    if (descriptionLength > 170) score -= 5;
  }
  if (!hasCanonical) score -= 10;
  if (!hasOgTags) score -= 10;
  if (!hasTwitterTags) score -= 5;
  score -= Math.min(15, issuesCount * 5);
  return Math.max(0, Math.round(score));
}

// server/seoAnalyzer.ts
async function analyzeSeoTags(url) {
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEOTagInspector/1.0; +https://seotaginspector.example.com)"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const titleTag = extractTitle($);
    const descriptionTag = extractDescription($);
    const canonicalTag = extractCanonical($, url);
    const robotsTag = extractRobotsMeta($);
    const viewportTag = extractViewport($);
    const ogTags = extractOpenGraphTags($);
    const twitterTags = extractTwitterCardTags($);
    const ogImage = ogTags.find((tag) => tag.name === "og:image")?.value;
    const twitterImage = twitterTags.find((tag) => tag.name === "twitter:image")?.value || twitterTags.find((tag) => tag.name === "twitter:image:src")?.value;
    const issuesCount = countIssues([titleTag, descriptionTag, canonicalTag, robotsTag, viewportTag, ...ogTags, ...twitterTags]);
    const recommendations = generateRecommendations(titleTag, descriptionTag, canonicalTag, robotsTag, ogTags, twitterTags, url);
    const hasMandatoryTags = Boolean(titleTag.value && descriptionTag.value);
    const hasTitle = Boolean(titleTag.value);
    const hasDescription = Boolean(descriptionTag.value);
    const hasCanonical = Boolean(canonicalTag.value);
    const hasOgTags = ogTags.length > 0;
    const hasTwitterTags = twitterTags.length > 0;
    const score = calculateSeoScore(
      hasMandatoryTags,
      hasTitle,
      hasDescription,
      hasCanonical,
      hasOgTags,
      hasTwitterTags,
      titleTag.charCount,
      descriptionTag.charCount,
      issuesCount
    );
    const totalTags = countTotalTags([titleTag, descriptionTag, canonicalTag, robotsTag, viewportTag, ...ogTags, ...twitterTags]);
    const analysisResult = {
      url,
      title: titleTag,
      description: descriptionTag,
      canonical: canonicalTag,
      robots: robotsTag,
      viewport: viewportTag,
      ogTags,
      twitterTags,
      score,
      totalTags,
      issuesCount,
      ogImage,
      twitterImage,
      recommendations,
      analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return analysisResult;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error analyzing SEO tags: ${error.message}`);
    }
    throw new Error("Unknown error occurred during SEO analysis");
  }
}
function extractTitle($) {
  const titleElement = $("title");
  const title = titleElement.text().trim();
  if (!title) {
    return {
      name: "title",
      status: "missing",
      message: "Add a title tag to your page. This is one of the most important SEO elements."
    };
  }
  const charCount = title.length;
  let status = "good";
  let message = "Your title is between 30-60 characters.";
  if (charCount < 30) {
    status = "warning";
    message = "Your title is too short. Aim for 30-60 characters for optimal visibility in search results.";
  } else if (charCount > 60) {
    status = "warning";
    message = "Your title is too long and might be truncated in search results. Try to keep it under 60 characters.";
  }
  return {
    name: "title",
    value: title,
    status,
    message,
    charCount
  };
}
function extractDescription($) {
  const descriptionMeta = $('meta[name="description"]');
  const description = descriptionMeta.attr("content")?.trim();
  if (!description) {
    return {
      name: "description",
      status: "missing",
      message: "Add a meta description to your page. This improves click-through rates from search results."
    };
  }
  const charCount = description.length;
  let status = "good";
  let message = "Your description is between 120-158 characters.";
  if (charCount < 120) {
    status = "warning";
    message = "Your description is a bit short. Aim for 120-158 characters for optimal visibility in search results.";
  } else if (charCount > 158) {
    status = "warning";
    message = "Your description is too long and might be truncated in search results. Try to keep it under 158 characters.";
  }
  return {
    name: "description",
    value: description,
    status,
    message,
    charCount
  };
}
function extractCanonical($, currentUrl) {
  const canonicalLink = $('link[rel="canonical"]');
  const canonicalUrl = canonicalLink.attr("href")?.trim();
  if (!canonicalUrl) {
    return {
      name: "canonical",
      status: "missing",
      message: "Add a canonical URL to prevent duplicate content issues and help search engines identify the preferred version of your page."
    };
  }
  const normalizedCanonical = canonicalUrl.replace(/\/$/, "");
  const normalizedCurrent = currentUrl.replace(/\/$/, "");
  let status = "good";
  let message = "Your canonical URL is properly set.";
  if (normalizedCanonical !== normalizedCurrent) {
    status = "warning";
    message = `Your canonical URL differs from the accessed URL. Ensure this is intentional.`;
  }
  return {
    name: "canonical",
    value: canonicalUrl,
    status,
    message
  };
}
function extractRobotsMeta($) {
  const robotsMeta = $('meta[name="robots"]');
  const robotsContent = robotsMeta.attr("content")?.trim();
  if (!robotsContent) {
    return {
      name: "robots",
      value: "index, follow",
      // Default behavior if not specified
      status: "warning",
      message: "No robots meta tag found. Search engines will use default behavior (index, follow)."
    };
  }
  let status = "good";
  let message = "Your page is set to be indexed and followed by search engines.";
  if (robotsContent.includes("noindex") || robotsContent.includes("nofollow")) {
    status = "warning";
    message = "Your robots meta tag is preventing indexing or following. Make sure this is intentional.";
  }
  return {
    name: "robots",
    value: robotsContent,
    status,
    message
  };
}
function extractViewport($) {
  const viewportMeta = $('meta[name="viewport"]');
  const viewportContent = viewportMeta.attr("content")?.trim();
  if (!viewportContent) {
    return {
      name: "viewport",
      status: "missing",
      message: "Add a viewport meta tag for proper mobile rendering, which is important for mobile SEO."
    };
  }
  let status = "good";
  let message = "Your viewport is properly configured for mobile devices.";
  if (!viewportContent.includes("width=device-width")) {
    status = "warning";
    message = "Your viewport meta tag should include width=device-width for proper mobile rendering.";
  }
  return {
    name: "viewport",
    value: viewportContent,
    status,
    message
  };
}
function extractOpenGraphTags($) {
  const ogTags = [];
  const essentialOgProperties = [
    "og:title",
    "og:description",
    "og:url",
    "og:image",
    "og:type"
  ];
  $('meta[property^="og:"]').each((_, element) => {
    const property = $(element).attr("property");
    const content = $(element).attr("content")?.trim();
    if (property && content) {
      let status = "good";
      let message;
      if (property === "og:image") {
      }
      ogTags.push({
        name: property,
        value: content,
        status,
        message
      });
    }
  });
  essentialOgProperties.forEach((property) => {
    if (!ogTags.some((tag) => tag.name === property)) {
      ogTags.push({
        name: property,
        status: "missing",
        message: `Add the ${property} meta tag to improve social sharing appearance.`
      });
    }
  });
  return ogTags;
}
function extractTwitterCardTags($) {
  const twitterTags = [];
  const essentialTwitterProperties = [
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
    "twitter:site"
  ];
  $('meta[name^="twitter:"]').each((_, element) => {
    const name = $(element).attr("name");
    const content = $(element).attr("content")?.trim();
    if (name && content) {
      let status = "good";
      let message;
      twitterTags.push({
        name,
        value: content,
        status,
        message
      });
    }
  });
  essentialTwitterProperties.forEach((property) => {
    if (!twitterTags.some((tag) => tag.name === property)) {
      twitterTags.push({
        name: property,
        status: "missing",
        message: `Add a ${property} meta tag to improve Twitter card appearance.`
      });
    }
  });
  return twitterTags;
}
function countIssues(tags) {
  return tags.filter((tag) => tag.status === "warning" || tag.status === "missing").length;
}
function countTotalTags(tags) {
  return tags.filter((tag) => tag.value).length;
}
function generateRecommendations(titleTag, descriptionTag, canonicalTag, robotsTag, ogTags, twitterTags, url) {
  const recommendations = [];
  if (titleTag.status === "missing") {
    recommendations.push({
      type: "warning",
      message: 'Add a <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">title</code> tag to your page - this is crucial for SEO.'
    });
  } else if (titleTag.status === "warning") {
    recommendations.push({
      type: "warning",
      message: `Optimize your title length (currently ${titleTag.charCount} characters). Aim for 30-60 characters.`
    });
  }
  if (descriptionTag.status === "missing") {
    recommendations.push({
      type: "warning",
      message: 'Add a <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">meta description</code> to improve click-through rates from search results.'
    });
  } else if (descriptionTag.status === "warning") {
    recommendations.push({
      type: "warning",
      message: `Adjust your meta description length (currently ${descriptionTag.charCount} characters). Aim for 120-158 characters.`
    });
  }
  if (canonicalTag.status === "missing") {
    recommendations.push({
      type: "warning",
      message: 'Add a <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">canonical URL</code> to prevent duplicate content issues.'
    });
  } else if (canonicalTag.status === "warning") {
    recommendations.push({
      type: "warning",
      message: `Ensure your canonical URL <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">${canonicalTag.value}</code> matches the accessed URL for consistent indexing.`
    });
  }
  const missingOgTags = ogTags.filter((tag) => tag.status === "missing");
  if (missingOgTags.length > 0) {
    if (missingOgTags.length === ogTags.length) {
      recommendations.push({
        type: "warning",
        message: "Add Open Graph meta tags to improve how your content appears when shared on social media platforms like Facebook and LinkedIn."
      });
    } else {
      const missingTags = missingOgTags.map((tag) => tag.name).join(", ");
      recommendations.push({
        type: "warning",
        message: `Add missing Open Graph tags: <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">${missingTags}</code>`
      });
    }
  }
  const missingTwitterTags = twitterTags.filter((tag) => tag.status === "missing");
  if (missingTwitterTags.length > 0) {
    if (missingTwitterTags.length === twitterTags.length) {
      recommendations.push({
        type: "warning",
        message: "Add Twitter Card meta tags to improve how your content appears when shared on Twitter."
      });
    } else {
      const missingTags = missingTwitterTags.map((tag) => tag.name).join(", ");
      recommendations.push({
        type: "warning",
        message: `Add missing Twitter Card tags: <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">${missingTags}</code>`
      });
    }
  }
  if (titleTag.status === "good") {
    recommendations.push({
      type: "success",
      message: `Your meta title is well-optimized with a good length of ${titleTag.charCount} characters.`
    });
  }
  if (descriptionTag.status === "good") {
    recommendations.push({
      type: "success",
      message: `Your meta description is well-optimized with a good length of ${descriptionTag.charCount} characters.`
    });
  }
  if (ogTags.filter((tag) => tag.value).length >= 4) {
    recommendations.push({
      type: "success",
      message: "Your Open Graph tags are well-implemented, providing rich previews on Facebook and other platforms."
    });
  }
  if (twitterTags.filter((tag) => tag.value).length >= 4) {
    recommendations.push({
      type: "success",
      message: "Your Twitter Card tags are well-implemented, providing rich previews on Twitter."
    });
  }
  return recommendations;
}

// server/routes.ts
import { z } from "zod";
import { ZodError } from "zod";
async function registerRoutes(app2) {
  app2.post("/api/analyze", async (req, res) => {
    try {
      const schema = z.object({
        url: z.string().url()
      });
      const { url } = schema.parse(req.body);
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT || 5e3;
  server.listen({
    port: Number(port),
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

