import fetch from "node-fetch";
import * as cheerio from "cheerio";
import type { SeoAnalysisResult, Tag } from "@shared/schema";
import { calculateSeoScore } from "../client/src/lib/seoUtils";

export async function analyzeSeoTags(url: string): Promise<SeoAnalysisResult> {
  try {
    // Make sure URL is properly formatted
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    // Fetch HTML content
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEOTagInspector/1.0; +https://seotaginspector.example.com)"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Parse HTML with cheerio
    const $ = cheerio.load(html);
    
    // Extract basic SEO tags
    const titleTag = extractTitle($);
    const descriptionTag = extractDescription($);
    const canonicalTag = extractCanonical($, url);
    const robotsTag = extractRobotsMeta($);
    const viewportTag = extractViewport($);
    
    // Extract Open Graph tags
    const ogTags = extractOpenGraphTags($);
    
    // Extract Twitter Card tags
    const twitterTags = extractTwitterCardTags($);
    
    // Find images
    const ogImage = ogTags.find(tag => tag.name === 'og:image')?.value;
    const twitterImage = twitterTags.find(tag => tag.name === 'twitter:image')?.value || 
                         twitterTags.find(tag => tag.name === 'twitter:image:src')?.value;
    
    // Count issues
    const issuesCount = countIssues([titleTag, descriptionTag, canonicalTag, robotsTag, viewportTag, ...ogTags, ...twitterTags]);

    // Generate recommendations
    const recommendations = generateRecommendations(titleTag, descriptionTag, canonicalTag, robotsTag, ogTags, twitterTags, url);

    // Calculate SEO score
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

    // Count total tags found
    const totalTags = countTotalTags([titleTag, descriptionTag, canonicalTag, robotsTag, viewportTag, ...ogTags, ...twitterTags]);
    
    // Create analysis result
    const analysisResult: SeoAnalysisResult = {
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
      analyzedAt: new Date().toISOString()
    };
    
    return analysisResult;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error analyzing SEO tags: ${error.message}`);
    }
    throw new Error('Unknown error occurred during SEO analysis');
  }
}

function extractTitle($: cheerio.CheerioAPI): Tag {
  const titleElement = $('title');
  const title = titleElement.text().trim();
  
  if (!title) {
    return {
      name: 'title',
      status: 'missing',
      message: 'Add a title tag to your page. This is one of the most important SEO elements.'
    };
  }
  
  const charCount = title.length;
  let status: Tag['status'] = 'good';
  let message = 'Your title is between 30-60 characters.';
  
  if (charCount < 30) {
    status = 'warning';
    message = 'Your title is too short. Aim for 30-60 characters for optimal visibility in search results.';
  } else if (charCount > 60) {
    status = 'warning';
    message = 'Your title is too long and might be truncated in search results. Try to keep it under 60 characters.';
  }
  
  return {
    name: 'title',
    value: title,
    status,
    message,
    charCount
  };
}

function extractDescription($: cheerio.CheerioAPI): Tag {
  const descriptionMeta = $('meta[name="description"]');
  const description = descriptionMeta.attr('content')?.trim();
  
  if (!description) {
    return {
      name: 'description',
      status: 'missing',
      message: 'Add a meta description to your page. This improves click-through rates from search results.'
    };
  }
  
  const charCount = description.length;
  let status: Tag['status'] = 'good';
  let message = 'Your description is between 120-158 characters.';
  
  if (charCount < 120) {
    status = 'warning';
    message = 'Your description is a bit short. Aim for 120-158 characters for optimal visibility in search results.';
  } else if (charCount > 158) {
    status = 'warning';
    message = 'Your description is too long and might be truncated in search results. Try to keep it under 158 characters.';
  }
  
  return {
    name: 'description',
    value: description,
    status,
    message,
    charCount
  };
}

function extractCanonical($: cheerio.CheerioAPI, currentUrl: string): Tag {
  const canonicalLink = $('link[rel="canonical"]');
  const canonicalUrl = canonicalLink.attr('href')?.trim();
  
  if (!canonicalUrl) {
    return {
      name: 'canonical',
      status: 'missing',
      message: 'Add a canonical URL to prevent duplicate content issues and help search engines identify the preferred version of your page.'
    };
  }
  
  // Check if canonical URL matches current URL (accounting for trailing slashes)
  const normalizedCanonical = canonicalUrl.replace(/\/$/, '');
  const normalizedCurrent = currentUrl.replace(/\/$/, '');
  
  let status: Tag['status'] = 'good';
  let message = 'Your canonical URL is properly set.';
  
  if (normalizedCanonical !== normalizedCurrent) {
    status = 'warning';
    message = `Your canonical URL differs from the accessed URL. Ensure this is intentional.`;
  }
  
  return {
    name: 'canonical',
    value: canonicalUrl,
    status,
    message
  };
}

function extractRobotsMeta($: cheerio.CheerioAPI): Tag {
  const robotsMeta = $('meta[name="robots"]');
  const robotsContent = robotsMeta.attr('content')?.trim();
  
  if (!robotsContent) {
    return {
      name: 'robots',
      value: 'index, follow', // Default behavior if not specified
      status: 'warning',
      message: 'No robots meta tag found. Search engines will use default behavior (index, follow).'
    };
  }
  
  let status: Tag['status'] = 'good';
  let message = 'Your page is set to be indexed and followed by search engines.';
  
  if (robotsContent.includes('noindex') || robotsContent.includes('nofollow')) {
    status = 'warning';
    message = 'Your robots meta tag is preventing indexing or following. Make sure this is intentional.';
  }
  
  return {
    name: 'robots',
    value: robotsContent,
    status,
    message
  };
}

function extractViewport($: cheerio.CheerioAPI): Tag {
  const viewportMeta = $('meta[name="viewport"]');
  const viewportContent = viewportMeta.attr('content')?.trim();
  
  if (!viewportContent) {
    return {
      name: 'viewport',
      status: 'missing',
      message: 'Add a viewport meta tag for proper mobile rendering, which is important for mobile SEO.'
    };
  }
  
  let status: Tag['status'] = 'good';
  let message = 'Your viewport is properly configured for mobile devices.';
  
  if (!viewportContent.includes('width=device-width')) {
    status = 'warning';
    message = 'Your viewport meta tag should include width=device-width for proper mobile rendering.';
  }
  
  return {
    name: 'viewport',
    value: viewportContent,
    status,
    message
  };
}

function extractOpenGraphTags($: cheerio.CheerioAPI): Tag[] {
  const ogTags: Tag[] = [];
  
  // Essential OG tags to check
  const essentialOgProperties = [
    'og:title', 
    'og:description', 
    'og:url', 
    'og:image', 
    'og:type'
  ];
  
  // Extract all OG tags
  $('meta[property^="og:"]').each((_, element) => {
    const property = $(element).attr('property');
    const content = $(element).attr('content')?.trim();
    
    if (property && content) {
      let status: Tag['status'] = 'good';
      let message: string | undefined;
      
      // Check for image dimensions if it's an image tag
      if (property === 'og:image') {
        // No validation message for images by default
      }
      
      ogTags.push({
        name: property,
        value: content,
        status,
        message
      });
    }
  });
  
  // Check for missing essential OG tags
  essentialOgProperties.forEach(property => {
    if (!ogTags.some(tag => tag.name === property)) {
      ogTags.push({
        name: property,
        status: 'missing',
        message: `Add the ${property} meta tag to improve social sharing appearance.`
      });
    }
  });
  
  return ogTags;
}

function extractTwitterCardTags($: cheerio.CheerioAPI): Tag[] {
  const twitterTags: Tag[] = [];
  
  // Essential Twitter Card tags to check
  const essentialTwitterProperties = [
    'twitter:card', 
    'twitter:title', 
    'twitter:description', 
    'twitter:image',
    'twitter:site'
  ];
  
  // Extract all Twitter Card tags
  $('meta[name^="twitter:"]').each((_, element) => {
    const name = $(element).attr('name');
    const content = $(element).attr('content')?.trim();
    
    if (name && content) {
      let status: Tag['status'] = 'good';
      let message: string | undefined;
      
      twitterTags.push({
        name,
        value: content,
        status,
        message
      });
    }
  });
  
  // Check for missing essential Twitter Card tags
  essentialTwitterProperties.forEach(property => {
    if (!twitterTags.some(tag => tag.name === property)) {
      twitterTags.push({
        name: property,
        status: 'missing',
        message: `Add a ${property} meta tag to improve Twitter card appearance.`
      });
    }
  });
  
  return twitterTags;
}

function countIssues(tags: Tag[]): number {
  return tags.filter(tag => tag.status === 'warning' || tag.status === 'missing').length;
}

function countTotalTags(tags: Tag[]): number {
  return tags.filter(tag => tag.value).length;
}

function generateRecommendations(
  titleTag: Tag,
  descriptionTag: Tag,
  canonicalTag: Tag,
  robotsTag: Tag,
  ogTags: Tag[],
  twitterTags: Tag[],
  url: string
): SeoAnalysisResult['recommendations'] {
  const recommendations: SeoAnalysisResult['recommendations'] = [];
  
  // Title recommendations
  if (titleTag.status === 'missing') {
    recommendations.push({
      type: 'warning',
      message: 'Add a <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">title</code> tag to your page - this is crucial for SEO.'
    });
  } else if (titleTag.status === 'warning') {
    recommendations.push({
      type: 'warning',
      message: `Optimize your title length (currently ${titleTag.charCount} characters). Aim for 30-60 characters.`
    });
  }
  
  // Description recommendations
  if (descriptionTag.status === 'missing') {
    recommendations.push({
      type: 'warning',
      message: 'Add a <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">meta description</code> to improve click-through rates from search results.'
    });
  } else if (descriptionTag.status === 'warning') {
    recommendations.push({
      type: 'warning',
      message: `Adjust your meta description length (currently ${descriptionTag.charCount} characters). Aim for 120-158 characters.`
    });
  }
  
  // Canonical URL recommendations
  if (canonicalTag.status === 'missing') {
    recommendations.push({
      type: 'warning',
      message: 'Add a <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">canonical URL</code> to prevent duplicate content issues.'
    });
  } else if (canonicalTag.status === 'warning') {
    recommendations.push({
      type: 'warning',
      message: `Ensure your canonical URL <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">${canonicalTag.value}</code> matches the accessed URL for consistent indexing.`
    });
  }
  
  // Open Graph recommendations
  const missingOgTags = ogTags.filter(tag => tag.status === 'missing');
  if (missingOgTags.length > 0) {
    if (missingOgTags.length === ogTags.length) {
      recommendations.push({
        type: 'warning',
        message: 'Add Open Graph meta tags to improve how your content appears when shared on social media platforms like Facebook and LinkedIn.'
      });
    } else {
      const missingTags = missingOgTags.map(tag => tag.name).join(', ');
      recommendations.push({
        type: 'warning',
        message: `Add missing Open Graph tags: <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">${missingTags}</code>`
      });
    }
  }
  
  // Twitter Card recommendations
  const missingTwitterTags = twitterTags.filter(tag => tag.status === 'missing');
  if (missingTwitterTags.length > 0) {
    if (missingTwitterTags.length === twitterTags.length) {
      recommendations.push({
        type: 'warning',
        message: 'Add Twitter Card meta tags to improve how your content appears when shared on Twitter.'
      });
    } else {
      const missingTags = missingTwitterTags.map(tag => tag.name).join(', ');
      recommendations.push({
        type: 'warning',
        message: `Add missing Twitter Card tags: <code class="bg-gray-100 px-1 py-0.5 rounded text-primary-700">${missingTags}</code>`
      });
    }
  }
  
  // Add success recommendations if things are good
  if (titleTag.status === 'good') {
    recommendations.push({
      type: 'success',
      message: `Your meta title is well-optimized with a good length of ${titleTag.charCount} characters.`
    });
  }
  
  if (descriptionTag.status === 'good') {
    recommendations.push({
      type: 'success',
      message: `Your meta description is well-optimized with a good length of ${descriptionTag.charCount} characters.`
    });
  }
  
  if (ogTags.filter(tag => tag.value).length >= 4) {
    recommendations.push({
      type: 'success',
      message: 'Your Open Graph tags are well-implemented, providing rich previews on Facebook and other platforms.'
    });
  }
  
  if (twitterTags.filter(tag => tag.value).length >= 4) {
    recommendations.push({
      type: 'success',
      message: 'Your Twitter Card tags are well-implemented, providing rich previews on Twitter.'
    });
  }
  
  return recommendations;
}
