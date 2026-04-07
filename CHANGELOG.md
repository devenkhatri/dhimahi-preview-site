# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-04-07

### Added

#### 🎬 Persona Media Carousel Feature
- **Interactive carousel** for "At a Glance" section on persona detail pages
- **Partial peek** UI pattern — 92% desktop / 88% mobile slide width reveals next item
- **Thumbnail strip** navigation with visual previews of all carousel items
- **YouTube video integration** — new `youtubeVideoId` field in persona frontmatter
- **YouTube thumbnails** — automatically fetched and cached from YouTube's servers
- **Play icon overlay** on video thumbnails for visual clarity
- **Native scroll-snap** — uses CSS `scroll-snap-type: x mandatory` for momentum-based scrolling
- **Mobile-optimized** — 44px+ tap targets, smooth touch interactions
- **Responsive design** — automatic width adjustment for all screen sizes
- **Active state tracking** — onScroll handler syncs visible slide with thumbnail highlight
- **Accessibility features** — ARIA labels, keyboard navigation, screen reader support

#### 📚 Documentation
- **[Personas Carousel Guide](docs/PERSONAS_CAROUSEL_GUIDE.md)** — comprehensive guide for managing persona media
- Updated **[CMS User Guide](docs/CMS_USER_GUIDE.md)** with personas section
- Updated **[README.md](README.md)** with personas features and video setup instructions
- Updated **[docs/README.md](docs/README.md)** with carousel guide link

#### 🔧 Technical Changes
- New component: `src/components/AtAGlanceCarousel.tsx` (client-rendered, ~15KB)
- Updated `src/lib/content.ts`:
  - Added `youtubeVideoId?: string` to `Persona` interface
  - Added `youtubeVideoId` passthrough in `validatePersonaData()`
  - Added spread operator for `youtubeVideoId` in `getAllPersonas()`
- Updated `types/cms.ts`:
  - Added `infographic?: string` and `youtubeVideoId?: string` to `Persona` interface
- Updated `src/app/personas/[slug]/page.tsx`:
  - Imported `AtAGlanceCarousel` component
  - Replaced single infographic section with carousel component
  - Updated conditional rendering to support both infographic + video

#### 📝 Content Updates
- Updated `content/personas/doctors.md` with example `youtubeVideoId`
- All other personas support optional `youtubeVideoId` field

### Features

#### Carousel Display Modes
| Scenario | Display |
|----------|---------|
| Infographic only | Single image, no carousel chrome |
| Video only | Single embed, no carousel chrome |
| Both items | Full carousel with thumbnail navigation |

#### Carousel Mechanics
- **Scroll detection**: `onScroll` handler computes active slide from `scrollLeft`
- **Thumbnail navigation**: Click to smoothly scroll to slide with `scrollTo({ behavior: 'smooth' })`
- **Visual feedback**: Active thumbnail highlighted with blue border, scale-up, shadow
- **Touch-friendly**: Native browser scrolling handles swipe gestures automatically

#### Responsive Breakpoints
- **Mobile (320px–640px)**: 88% slide width, 12% peek, 56px thumbnail height
- **Tablet (641px–1024px)**: 90% slide width, 10% peek, 64px thumbnail height
- **Desktop (1025px+)**: 92% slide width, 8% peek, 64px thumbnail height

### Performance

- **Zero additional libraries**: Uses native CSS snap scrolling
- **Lightweight component**: ~15KB TypeScript/JSX
- **Lazy loading**: iframes load only when visible
- **Image optimization**: Leverages Next.js Image component
- **No layout shift**: Fixed aspect ratios prevent CLS issues

### Browser Support

- ✅ Chrome/Edge 88+ (CSS scroll-snap full support)
- ✅ Firefox 87+
- ✅ Safari 15+ (with fallback behavior on older versions)
- ✅ iOS Safari 15+
- ✅ Android Chrome

### Migration Guide

For existing personas with only infographics:
- No changes required — carousel automatically renders single-item mode (no chrome)
- To add videos, simply add `youtubeVideoId: "YOUR_VIDEO_ID"` to frontmatter

For new personas:
- Add both `infographic` and `youtubeVideoId` fields to enable full carousel

### Breaking Changes

None — fully backward compatible.

### Deprecated

None.

### Removed

None — old carousel controls (arrows + dots) replaced with thumbnail strip.

---

## Previous Versions

### [2.0.0] - 2026-02-15

- Persona pages with infographics
- Multi-section storytelling content
- SEO optimization for persona detail pages
- Related personas and insights linking

### [1.5.0] - 2026-01-20

- Case studies section
- Portfolio showcase
- Client testimonials

### [1.0.0] - 2024-11-01

- Initial site launch
- Homepage with hero section
- Services overview
- About page
- Contact forms
- Insights blog section
