# Calendly Fallback System

## Overview

The consultation page uses an enhanced Calendly embed with a robust fallback system that automatically shows the consultation booking form if Calendly fails to load due to:

- Ad blockers
- JavaScript blockers
- Network issues
- Script loading failures
- Timeout issues

## How It Works

### 1. Enhanced CalendlyEmbed Component

The `CalendlyEmbed` component (`src/components/CalendlyEmbed.tsx`) includes:

- **Error Detection**: Monitors script loading and widget initialization
- **Timeout Handling**: Configurable timeout (default 8 seconds)
- **Fallback Component**: Shows alternative content when Calendly fails
- **Loading States**: Provides user feedback during loading

### 2. Fallback Triggers

The fallback is triggered when:

- Calendly script fails to load (network/blocker issues)
- Script loads but widget doesn't initialize
- Timeout is reached before successful loading
- Invalid Calendly URL is provided

### 3. User Experience

**Normal Flow:**
1. Loading spinner with message
2. Calendly widget loads successfully
3. User can book directly through Calendly

**Fallback Flow:**
1. Loading spinner with timeout warning
2. Fallback message appears explaining the issue
3. Consultation booking form is shown as alternative
4. Form submissions go to Netlify forms

## Implementation

### Consultation Page

```tsx
// src/app/consultation/page.tsx
import CalendlyWithFallback from "@/components/CalendlyWithFallback";

export default function ConsultationPage() {
  return (
    <main>
      {/* ... other content ... */}
      <CalendlyWithFallback />
    </main>
  );
}
```

### CalendlyWithFallback Component

```tsx
// src/components/CalendlyWithFallback.tsx
"use client";
import CalendlyEmbed from "./CalendlyEmbed";
import ConsultationBookingForm from "./forms/ConsultationBookingForm";

export default function CalendlyWithFallback() {
  return (
    <CalendlyEmbed
      url="https://calendly.com/dhimahitechnolabs/30min"
      timeout={8000}
      onError={() => {
        console.log('Calendly failed to load');
        // Analytics tracking
      }}
      fallbackComponent={
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p>Having trouble with the calendar? Use the form below instead.</p>
          </div>
          <ConsultationBookingForm />
        </div>
      }
    />
  );
}
```

## Configuration Options

### CalendlyEmbed Props

- `url`: Calendly booking URL
- `timeout`: Milliseconds before showing fallback (default: 10000)
- `onError`: Callback when fallback is triggered
- `fallbackComponent`: React component to show on failure
- `loadingText`: Custom loading message
- `pageSettings`: Calendly styling options
- `utm`: UTM tracking parameters

### Timeout Settings

- **Development**: 8-10 seconds (allows for slower connections)
- **Production**: 8 seconds (balance between patience and UX)
- **Testing**: 2 seconds (for quick fallback testing)

## Error Handling

### Console Logging

The system logs helpful messages:

```
✓ Calendly script loaded successfully
✓ Calendly widget loaded successfully
⚠ Calendly embed timeout - showing fallback
⚠ Calendly widget failed to load - showing fallback
✗ Failed to load Calendly script - showing fallback
```

### Analytics Integration

Error events can be tracked:

```javascript
if (typeof window !== 'undefined' && window.gtag) {
  gtag('event', 'calendly_fallback_shown', {
    event_category: 'consultation',
    event_label: 'calendly_load_failed'
  });
}
```

## Testing

### Manual Testing

1. **Normal Loading**: Visit `/consultation` with normal browser
2. **Ad Blocker Test**: Enable ad blocker and visit page
3. **JavaScript Disabled**: Disable JS and visit page
4. **Network Issues**: Throttle network and visit page

### Automated Testing

The system includes detection for:
- Script loading failures
- Widget initialization failures
- Timeout scenarios
- Invalid URLs

## Benefits

1. **Improved Conversion**: Users can still book even if Calendly fails
2. **Better UX**: Clear messaging about what's happening
3. **Accessibility**: Works without JavaScript/with blockers
4. **Analytics**: Track when fallbacks are needed
5. **Reliability**: Multiple fallback mechanisms

## Maintenance

### Monitoring

Monitor these metrics:
- Calendly load success rate
- Fallback trigger frequency
- Form submission rates (Calendly vs fallback)
- User feedback about booking experience

### Updates

When updating:
- Test both Calendly and fallback flows
- Verify timeout settings are appropriate
- Check error messages are user-friendly
- Ensure analytics tracking works

## Troubleshooting

### Common Issues

1. **Fallback shows immediately**: Check timeout settings
2. **Calendly never loads**: Verify URL and network connectivity
3. **Form submissions fail**: Check Netlify forms configuration
4. **Styling issues**: Review CSS conflicts with Calendly widget

### Debug Mode

Add debug logging by setting shorter timeouts and monitoring console output.