# SEO Tag Inspector

An interactive web application that analyzes and visualizes SEO meta tags for any website with Google and social media previews.

## Features

- Google search result preview
- Social media preview (Facebook and Twitter)
- Comprehensive SEO tag analysis
- Visual score dashboard
- Detailed recommendations for improvement

## Tech Stack

- **Frontend**: React, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express
- **Libraries**: Cheerio for HTML parsing

## Deployment to Render

### Using the Render Dashboard

1. **Create a new Web Service**
   - Log in to your Render dashboard
   - Click "New +" and select "Web Service"
   - Connect your GitHub/GitLab repository

2. **Configure the Service**
   - **Name**: Choose a name for your service (e.g., "seo-tag-inspector")
   - **Environment**: Node
   - **Region**: Choose the region closest to your users
   - **Branch**: main (or your preferred branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Add Environment Variables**
   - Key: `NODE_ENV`
   - Value: `production`

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### Using Render Blueprint (YAML)

Alternatively, you can use the included `render.yaml` file for deployment:

1. In your Render dashboard, navigate to "Blueprints"
2. Click "New Blueprint Instance"
3. Connect to your repository
4. Render will automatically detect the `render.yaml` file and set up the service

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT