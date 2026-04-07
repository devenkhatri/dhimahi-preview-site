# Personas Carousel - Content Management Guide

## Overview

The "At a Glance" section on persona detail pages now features a modern **carousel with thumbnail strip** that displays both infographics and YouTube videos. This guide explains how to add and manage carousel content for personas.

---

## Quick Start

### Add a Video to a Persona

To add a YouTube video to a persona's "At a Glance" section:

1. Open the persona's markdown file in `/content/personas/[persona-slug].md`
2. Locate the frontmatter (YAML section at the top between `---` markers)
3. Add the `youtubeVideoId` field after the `infographic` field:

```yaml
---
title: "Healthcare Professionals"
slug: "doctors"
icon: "/uploads/personas/doctors-icon.svg"
infographic: "/uploads/personas/infographics/doctors-infographic.png"
youtubeVideoId: "sboNwYmH3AY"  # ← Add this line
excerpt: "Medical professionals..."
...
---
```

4. Save the file. The carousel will automatically render on the persona page.

---

## Content Structure

### Persona Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Persona title (e.g., "Healthcare Professionals") |
| `slug` | string | ✅ | URL slug for the persona page |
| `icon` | string | ✅ | Path to persona icon/avatar image |
| `infographic` | string | ❌ | Path to the infographic image (PNG, JPG) |
| `youtubeVideoId` | string | ❌ | YouTube video ID (the alphanumeric code from the video URL) |
| `excerpt` | string | ✅ | Short description of the persona |
| `publishDate` | string | ✅ | Publication date (ISO 8601 format: "2024-01-17") |
| `featured` | boolean | ✅ | Whether to show in featured personas section |
| `order` | number | ✅ | Display order on personas listing page |
| `tags` | array | ❌ | Content tags for categorization |

### Example: Complete Persona File

```yaml
---
title: "Small Business Owners"
slug: "small-business-owner"
icon: "/uploads/personas/small-business-icon.svg"
infographic: "/uploads/personas/infographics/small-business-infographic.png"
youtubeVideoId: "dQw4w9WgXcQ"
excerpt: "Entrepreneurs balancing growth and operations with limited resources."
publishDate: "2024-02-15"
featured: true
order: 1
tags: ["SME", "Growth", "Digital Transformation"]
storytelling:
  everydayStruggle: |
    Your challenge description...
  whyThisMatters: |
    Why this matters...
  # ... rest of storytelling content
---

# Main content starts here
```

---

## Carousel Display Logic

### Single Item (Only Infographic)

If a persona has **only** an infographic and no `youtubeVideoId`:
- The image displays without carousel chrome (no thumbnail strip)
- No navigation controls are shown
- Clean, simple presentation

### Single Item (Only Video)

If a persona has **only** a `youtubeVideoId` and no infographic:
- The YouTube embed displays without carousel chrome
- No thumbnail strip
- Full aspect-video dimensions (16:9)

### Multi-Item Carousel (Infographic + Video)

If a persona has **both** infographic and youtubeVideoId:
- Native horizontal scroll with **CSS snap** — no JavaScript needed for swipe
- **Partial peek** — the next slide's edge is visible (8% on desktop, 12% on mobile)
- **Thumbnail strip** below the main carousel with two interactive thumbnails
- **Active state highlighting** — selected thumbnail shows a blue border and slight scale-up
- **Touch-friendly** — tap any thumbnail to scroll to that slide

---

## Carousel Features

### Visual Design

**Main Carousel:**
- Rounded corners (`rounded-2xl`)
- Light border and shadow for depth
- Responsive width: 88% of container on mobile, 92% on desktop
- 12px gap between slides for breathing room and peek visibility

**Thumbnail Strip:**
- Two equal-width thumbnail buttons below the carousel
- Height: 56px on mobile (`h-14`), 64px on desktop (`h-16`)
- Minimum 44px touch targets for mobile accessibility
- Each thumbnail shows:
  - **Infographic**: actual image thumbnail
  - **Video**: YouTube thumbnail with red play icon overlay
  - Label at bottom: "Infographic" or "Video"

**Active Thumbnail State:**
- Blue border (`border-primary`, 2px)
- Slight scale-up (`scale-105`)
- Drop shadow for emphasis
- Smooth transitions (200ms)

**Inactive Thumbnail State:**
- Gray border (`border-gray-200`)
- Reduced opacity (60%)
- Hover effect: opacity increases to 90%
- Smooth transitions

### Interaction

**Scrolling:**
- Native horizontal scroll with `scroll-snap-type: x mandatory`
- Momentum-based scrolling on mobile (iOS/Android physics)
- No scrollbar visible (hidden with CSS)
- Smooth snap-to-position after scroll

**Navigation:**
- Click any thumbnail to smoothly scroll to that slide
- Active slide automatically tracked and thumbnail highlighted
- Swipe on mobile to navigate between slides

**Responsive Behavior:**
- Mobile: 88% slide width, shows 12% peek
- Tablet/Desktop: 92% slide width, shows 8% peek
- Thumbnail strip maintains 2-column layout on all screen sizes

---

## Media Management

### Infographic Images

**Storage Location:** `/public/uploads/personas/infographics/`

**File Format:** PNG or JPG
- Recommended: PNG for quality, JPG for file size
- Typical dimensions: 900px × 600px minimum
- The component uses `object-contain`, so aspect ratio is preserved

**Path in frontmatter:**
```yaml
infographic: "/uploads/personas/infographics/doctors-infographic.png"
```

### YouTube Videos

**Getting the Video ID:**

From a YouTube URL: `https://www.youtube.com/watch?v=sboNwYmH3AY`
- The video ID is: `sboNwYmH3AY` (the value after `v=`)

From a YouTube short URL: `https://youtu.be/sboNwYmH3AY`
- The video ID is: `sboNwYmH3AY` (everything after the domain)

**Privacy:**
- Videos are embedded using `youtube-nocookie.com` to minimize cookies on page load
- No tracking cookies are placed until user interacts with the video
- Compliant with privacy regulations and GDPR

**Embed Parameters:**
```
https://www.youtube-nocookie.com/embed/{videoId}?rel=0&modestbranding=1
```
- `rel=0` — don't show recommended videos from other channels
- `modestbranding=1` — use minimal YouTube branding

**Video Thumbnail:**
Automatically fetched from: `https://img.youtube.com/vi/{videoId}/mqdefault.jpg`
- Medium quality thumbnail (320×180)
- Always accessible without authentication
- Displays in the thumbnail strip with a play icon overlay

---

## Best Practices

### Content Strategy

1. **Prioritize Infographics** — they're processed faster than videos
2. **Keep Videos Short** — aim for <3 minutes for the "At a Glance" section
3. **Complementary Content** — the video should expand on or illustrate the infographic

### Image Optimization

- **Infographics**: Keep file size under 500KB
- **Resolution**: 900×600px is ideal for responsive display
- **Format**: PNG for detailed graphics, JPG for photos
- **Compression**: Use tools like TinyPNG or ImageOptim before uploading

### Video Guidelines

- **Duration**: 1–3 minutes optimal
- **Topic**: "At a Glance" overview of the persona
- **Quality**: HD minimum (720p or 1080p)
- **Accessibility**: Include captions/subtitles
- **Copyright**: Ensure you have rights to the video

### Validation

The content system automatically validates:
- `youtubeVideoId` must be a non-empty string
- Invalid or missing values are gracefully handled
- Missing fields fall back to defaults without errors
- Pages build successfully even if a field is incorrect

---

## Troubleshooting

### Carousel Doesn't Show

**Problem**: Only one slide is visible, no thumbnail strip

**Cause**: Missing `youtubeVideoId` or missing `infographic`
- **Solution**: Ensure both fields are present in the persona frontmatter

### Video Doesn't Load

**Problem**: Thumbnail strip shows but video embed is blank

**Possible Causes:**
1. Invalid `youtubeVideoId` format
   - Verify the video ID is correct (alphanumeric, usually 11 characters)
   - Check for extra spaces or special characters

2. Video is unavailable
   - Confirm the video exists and is not private/deleted
   - Check that the video is not age-restricted
   - Try the URL in an incognito window

3. Video is country-restricted
   - Some videos have geographic restrictions
   - Check YouTube's availability settings

**Solution:**
- Copy the video ID directly from the YouTube URL
- Test by pasting into: `https://www.youtube.com/watch?v={videoId}`
- Ensure the video is public or unlisted (not private)

### Infographic Doesn't Display

**Problem**: Image doesn't appear in carousel

**Cause**: File path is incorrect

**Solution:**
1. Verify the file exists at `/public/uploads/personas/infographics/filename.png`
2. Check the path in frontmatter matches exactly (case-sensitive)
3. Ensure image format is PNG or JPG
4. Check file size isn't corrupted

### Thumbnail Strip Styling Looks Wrong

**Problem**: Thumbnails are misaligned or not responsive

**Cause**: Usually a CSS loading delay

**Solution:**
1. Hard refresh the browser (Cmd+Shift+R or Ctrl+Shift+R)
2. Clear browser cache
3. Check browser console for CSS errors
4. Verify Tailwind CSS is properly loaded

---

## Component Details

### Technical Implementation

**File:** `src/components/AtAGlanceCarousel.tsx`

**Technologies:**
- React hooks (`useState`, `useRef`)
- CSS scroll-snap (`snap-x snap-mandatory`)
- Tailwind CSS for responsive styling
- Native HTML `<iframe>` for YouTube embed
- Heroicons React (`PlayIcon` for video indicator)

**Size & Performance:**
- Component file: ~15KB
- No external carousel library (minimal bundle impact)
- Lazy-loaded on page visit
- Image optimization via Next.js Image component
- YouTube embed loads only when visible

### Props

```typescript
interface AtAGlanceCarouselProps {
  infographic?: string;        // Path to infographic image
  youtubeVideoId?: string;      // YouTube video ID
  personaTitle: string;         // Persona name (for alt text, labels)
}
```

### Accessibility

- **ARIA Labels**: All buttons have descriptive aria-labels
- **Semantic HTML**: Proper button and section elements
- **Keyboard Navigation**: Thumbnail buttons are keyboard-accessible
- **Alt Text**: Images have descriptive alt text
- **Color Contrast**: Meets WCAG AA standards
- **Touch Targets**: Minimum 44px height for mobile

---

## Future Enhancements

Potential improvements for future versions:

1. **Multiple Videos** — support more than one video per persona
2. **Custom Thumbnails** — allow uploading custom video thumbnails
3. **Video Autoplay** — option to autoplay on page load (with user consent)
4. **Analytics** — track which slides visitors view most
5. **Lightbox Mode** — full-screen viewing option
6. **Caption Overlays** — text descriptions for each slide

---

## Support & Questions

For issues or questions:
1. Check the troubleshooting section above
2. Review the component code in `src/components/AtAGlanceCarousel.tsx`
3. Check browser console for error messages
4. Verify file paths and video IDs match the patterns shown
5. Contact your development team if problems persist

---

**Last Updated:** April 7, 2026  
**Component Version:** 2.0 (Peek + Thumbnail Strip)
