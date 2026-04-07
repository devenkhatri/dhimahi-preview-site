# Dhimahi Technolabs - IT Consulting Website

A modern, responsive website for Dhimahi Technolabs, an IT consulting company specializing in AI solutions, digital marketing, and smart IT strategy for SMEs in Gujarat, India.

## 🚀 Live Demo

Visit the live site: [dhimahitechnolabs.com](https://www.dhimahitechnolabs.com)

## ✨ Features

### 🎨 Design & User Experience
- **Modern, Professional Design** - Clean and contemporary UI with gradient backgrounds and smooth animations
- **Fully Mobile Responsive** - Optimized for all devices from mobile phones to large desktop screens
- **Eye-catching Launch Notices** - Prominent "Coming Soon" banners across all pages to indicate preview status
- **Custom Hero Illustration** - Professional SVG illustration showcasing IT consulting concepts
- **Smooth Animations** - CSS animations including floating elements, pulsing badges, and bouncing icons

### 📱 Mobile-First Approach
- **Progressive Breakpoints** - `sm:`, `md:`, `lg:` responsive design system
- **Touch-Friendly Interface** - Minimum 44px touch targets for mobile usability
- **Collapsible Mobile Menu** - JavaScript-powered hamburger menu for mobile navigation
- **Responsive Typography** - Text scales appropriately across all screen sizes
- **Optimized Spacing** - Progressive padding and margins for different screen sizes

### 🛠 Technical Features
- **Next.js 14** - Latest version with App Router and TypeScript
- **Static Site Generation (SSG)** - Pre-rendered pages for optimal performance
- **SEO Optimized** - Proper meta tags, Open Graph, and Twitter Card support
- **Netlify Forms Integration** - Contact form with spam protection
- **Custom SVG Illustrations** - Scalable vector graphics for crisp visuals
- **Tailwind CSS** - Utility-first CSS framework for rapid development

### 📄 Content Management
- **Markdown-based Blog** - Insights section powered by markdown files
- **Dynamic Service Pages** - Programmatically generated service detail pages
- **Type-safe Content** - TypeScript interfaces for all content structures
- **Easy Content Updates** - Simple file-based content management
- **Persona Pages** - Detailed customer success stories with rich media carousels
- **Interactive Carousels** - Native scroll-snap carousels with infographics and YouTube videos

## 🏗 Project Structure

```
dhimahi-site/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx           # Homepage
│   │   ├── about/             # About page
│   │   ├── services/          # Services pages
│   │   ├── insights/          # Blog/insights pages
│   │   └── success/           # Form success page
│   ├── lib/                   # Utility functions and data
│   │   ├── constants.ts       # Site configuration
│   │   ├── services.ts        # Services data
│   │   └── markdown.ts        # Blog post utilities
│   └── content/               # Content and data
│       ├── about.ts           # About page content (multilingual)
│       ├── services/          # Service descriptions
│       └── insights/          # Blog posts
├── public/                    # Static assets
│   ├── hero-illustration.svg  # Custom hero SVG
│   └── ...                   # Other static files
└── ...
```

## 🎯 Key Sections

### 🏠 Homepage
- **Hero Section** - Compelling headline with custom IT consulting illustration
- **Services Overview** - Grid of core services with feature highlights
- **Why Choose Us** - Company differentiators and value propositions
- **Client Testimonials** - Success stories from Gujarat SMEs
- **Contact Forms** - Multiple contact options including Netlify forms

### 🔧 Services
- **Web Development** - Modern, responsive websites and web applications
- **Digital Marketing** - SEO, social media, and online growth strategies
- **AI Automation** - Business process automation and AI integration

### 📚 Insights
- **Business Tips** - Practical advice for SMEs in Gujarat
- **Technology Guides** - How-to articles on digital transformation
- **Industry Insights** - Market trends and business strategies

### 👥 About
- **Company Story** - 25+ year journey from IT services to AI consultancy
- **Mission & Vision** - Clear articulation of company purpose and goals
- **Team Profiles** - Key team members with expertise and backgrounds
- **Company Values** - Core principles that guide business decisions
- **Timeline** - Major milestones and evolution over the years

### 🎯 Personas
- **Customer Success Stories** - Detailed personas for 15+ target customer segments
- **Interactive Carousels** - "At a Glance" sections with infographics and YouTube videos
- **Rich Storytelling** - Multi-section narratives (struggle → solution → journey → CTA)
- **Responsive Media** - Native scroll-snap carousels optimized for mobile

## � NGetting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dhimahi-site.git
   cd dhimahi-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🎨 Customization

### 🎯 Brand Configuration
Update company information in `src/lib/constants.ts`:

```typescript
export const COMPANY_NAME = "Your Company Name";
export const PHONE = "+91 99999 99999";
export const EMAIL = "hello@yourcompany.com";
export const CITY_LINE = "Your City & Region";
```

### 🎨 Styling
- **Colors**: Modify CSS variables in `src/app/globals.css`
- **Components**: Update Tailwind classes in component files
- **Animations**: Customize animations in the globals.css file

### 📝 Content Updates
- **Services**: Edit files in `src/content/services/`
- **Blog Posts**: Add markdown files to `src/content/insights/`
- **Personas**: Edit files in `content/personas/` (add YouTube videos with `youtubeVideoId` field)
- **Homepage**: Modify `src/app/page.tsx`

### 🎬 Adding Videos to Personas

To add a YouTube video to the "At a Glance" carousel on a persona page:

1. Open `content/personas/[persona-slug].md`
2. Add the `youtubeVideoId` field to the frontmatter:
   ```yaml
   infographic: "/uploads/personas/infographics/doctors-infographic.png"
   youtubeVideoId: "dQw4w9WgXcQ"  # YouTube video ID from the URL
   ```
3. Save and publish — the carousel will render with both infographic and video

For detailed guidance, see [Personas Carousel Guide](docs/PERSONAS_CAROUSEL_GUIDE.md)

## 🌟 Launch Notices

The site includes prominent "launching soon" notices to indicate it's a preview:

- **Header Banner** - Site-wide animated banner
- **Hero Section** - Preview badge with pulsing animation
- **Service Sections** - Corner badges indicating more content coming
- **Footer** - Preview version indicator

To remove these notices when launching:
1. Remove banner components from `layout.tsx`
2. Update hero section badges in `page.tsx`
3. Remove preview notices from other pages

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Minimal JavaScript footprint
- **Loading Speed**: Static generation ensures fast page loads

## 🔧 Technologies Used

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Markdown with gray-matter
- **Forms**: Netlify Forms
- **Deployment**: Netlify (recommended)
- **Icons**: Custom SVG illustrations and emoji

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `out`
3. **Environment variables**: Set any required env vars
4. **Deploy**: Automatic deployments on git push

### Vercel

1. **Import project** to Vercel
2. **Configure**: Vercel auto-detects Next.js settings
3. **Deploy**: Automatic deployments on git push

## 📞 Contact & Support

- **Website**: [dhimahitechnolabs.com](https://www.dhimahitechnolabs.com)
- **Email**: hello@dhimahitechnolabs.com
- **Location**: Ahmedabad & Gandhinagar, Gujarat, India

## 📄 License

This project is proprietary software owned by Dhimahi Technolabs. All rights reserved.

---

**Built with ❤️ for SMEs in Gujarat** | **Empowering businesses with future-ready IT solutions**