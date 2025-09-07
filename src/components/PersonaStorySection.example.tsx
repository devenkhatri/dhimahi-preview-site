// Example usage of PersonaStorySection component
// This file demonstrates how to use the component in different scenarios

import { PersonaStorySection } from './PersonaStorySection';

// Example usage in a persona page
export function PersonaPageExample() {
  const personaData = {
    storytelling: {
      everydayStruggle: `
# The Daily Grind

You're juggling **multiple responsibilities** as a small business owner:

- Managing inventory manually with spreadsheets
- Struggling with outdated point-of-sale systems
- Losing track of customer preferences and purchase history
- Spending hours on repetitive administrative tasks

*Every day feels like you're fighting against your own systems instead of growing your business.*
      `,
      whyThisMatters: `
## The Cost of Inefficiency

In today's competitive market, **efficiency isn't just nice to have—it's survival**.

Your competitors are already using:
- Automated inventory management
- AI-powered customer insights  
- Streamlined workflows
- Data-driven decision making

**The longer you wait, the further behind you fall.**
      `,
      howDhimahiHelps: `
## Our Proven Approach

We understand the unique challenges of small businesses in Gujarat. Here's how we help:

### 🚀 Smart Automation
- Custom inventory management systems
- Automated customer follow-ups
- Streamlined order processing

### 📊 Data-Driven Insights
- Customer behavior analytics
- Sales forecasting
- Performance dashboards

### 💡 Practical Solutions
- No enterprise complexity
- Affordable, scalable systems
- Local support in Gujarati/Hindi
      `,
      theJourney: `
## Your Transformation Journey

### Week 1-2: Discovery & Planning
We analyze your current processes and identify automation opportunities.

### Week 3-6: Implementation
Our team builds and deploys your custom solutions with minimal disruption.

### Week 7-8: Training & Optimization
We train your team and fine-tune the systems for maximum efficiency.

### Ongoing: Support & Growth
Continuous monitoring, updates, and scaling as your business grows.

**Result: 40% reduction in administrative time, 25% increase in customer satisfaction.**
      `,
      callToAction: {
        title: 'Ready to Transform Your Business?',
        description: 'Join 200+ Gujarat businesses that have streamlined their operations with our proven solutions.',
        primaryButton: {
          text: 'Get Free Consultation',
          url: '/consultation'
        },
        secondaryButton: {
          text: 'View Success Stories',
          url: '/portfolio'
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Struggle Section */}
      <PersonaStorySection
        title="The Daily Struggle"
        content={personaData.storytelling.everydayStruggle}
        sectionType="struggle"
        className="mb-8"
      />

      {/* Why This Matters Section */}
      <PersonaStorySection
        title="Why This Matters"
        content={personaData.storytelling.whyThisMatters}
        sectionType="matters"
        className="mb-8"
      />

      {/* How Dhimahi Helps Section */}
      <PersonaStorySection
        title="How Dhimahi Helps"
        content={personaData.storytelling.howDhimahiHelps}
        sectionType="helps"
        className="mb-8"
      />

      {/* The Journey Section */}
      <PersonaStorySection
        title="Your Journey to Success"
        content={personaData.storytelling.theJourney}
        sectionType="journey"
        className="mb-8"
      />

      {/* Call to Action Section */}
      <PersonaStorySection
        title={personaData.storytelling.callToAction.title}
        content={`
${personaData.storytelling.callToAction.description}

[${personaData.storytelling.callToAction.primaryButton.text}](${personaData.storytelling.callToAction.primaryButton.url})

[${personaData.storytelling.callToAction.secondaryButton?.text}](${personaData.storytelling.callToAction.secondaryButton?.url})
        `}
        sectionType="cta"
        className="mb-8"
      />
    </div>
  );
}

// Example of different styling variations
export function StylingVariationsExample() {
  const sampleContent = "This is a sample section with **bold text** and *italic text* to demonstrate styling.";

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">PersonaStorySection Styling Examples</h1>
      
      <PersonaStorySection
        title="Struggle Section"
        content={sampleContent}
        sectionType="struggle"
      />
      
      <PersonaStorySection
        title="Matters Section"
        content={sampleContent}
        sectionType="matters"
      />
      
      <PersonaStorySection
        title="Helps Section"
        content={sampleContent}
        sectionType="helps"
      />
      
      <PersonaStorySection
        title="Journey Section"
        content={sampleContent}
        sectionType="journey"
      />
      
      <PersonaStorySection
        title="Call to Action Section"
        content={sampleContent}
        sectionType="cta"
      />
    </div>
  );
}

// Example with custom styling
export function CustomStyledExample() {
  return (
    <PersonaStorySection
      title="Custom Styled Section"
      content="This section demonstrates how to apply custom styling alongside the default section styling."
      sectionType="helps"
      className="shadow-2xl border-2 border-accent rounded-2xl"
    />
  );
}