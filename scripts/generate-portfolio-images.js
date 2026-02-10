#!/usr/bin/env node

/**
 * Portfolio Image Generation Helper Script
 * 
 * This script helps generate AI prompts and manage the portfolio image generation process.
 * It can be used with various AI image generation APIs or as a reference for manual generation.
 */

const fs = require('fs');
const path = require('path');

// Image specifications for each case study
const imageSpecs = {
  'healthcare-clinic-website-development': {
    title: 'Healthcare Clinic Website Development',
    before: {
      concept: 'Manual appointment booking chaos',
      prompt: 'Vector illustration of a chaotic medical office reception desk, stressed receptionist with multiple ringing phones, stacks of paper appointment books, frustrated waiting patients in background, sticky notes everywhere, clock showing late time, flat design style, muted gray and blue colors, professional but overwhelmed atmosphere, isometric perspective',
      colors: ['#6B7280', '#9CA3AF', '#3B82F6'],
      mood: 'chaotic, overwhelming, outdated'
    },
    after: {
      concept: 'Modern digital patient portal',
      prompt: 'Vector illustration of modern healthcare patient portal interface on laptop and mobile devices, clean dashboard showing medical records, appointment calendar, video consultation icon, test results, happy patient using tablet, flat design style, clean white background with medical blue and green accents, modern and professional, 2.5D perspective',
      colors: ['#FFFFFF', '#3B82F6', '#10B981'],
      mood: 'modern, efficient, user-friendly'
    },
    result: {
      concept: 'Analytics dashboard showing improvements',
      prompt: 'Vector illustration of healthcare analytics dashboard, large percentage metrics showing 85% online appointments, 60% time reduction, upward trending graphs, calendar with booking indicators, 5-star rating display, mobile device icons, flat design style, professional data visualization colors, clean modern interface, isometric dashboard view',
      colors: ['#3B82F6', '#10B981', '#F59E0B'],
      mood: 'success, growth, data-driven'
    }
  },
  'diamond-ai-quality-control': {
    title: 'Diamond AI Quality Control',
    before: {
      concept: 'Manual diamond inspection with loupe',
      prompt: 'Vector illustration of traditional diamond inspector examining stone with jeweler\'s loupe, inspection tray with multiple diamonds, grading charts on desk, traditional workspace lighting, tired professional, slow manual process, flat design style, warm brown and gold tones, professional jewelry industry setting, side view perspective',
      colors: ['#92400E', '#D97706', '#FCD34D'],
      mood: 'traditional, slow, subjective'
    },
    after: {
      concept: 'AI-powered grading station',
      prompt: 'Vector illustration of AI-powered diamond grading station, high-resolution camera system with LED lighting ring, diamond on automated platform, computer screen displaying AI analysis with neural network visualization, precision measurement indicators, flat design style, tech blue and white colors with purple AI accents, modern laboratory setting, isometric view',
      colors: ['#3B82F6', '#FFFFFF', '#8B5CF6'],
      mood: 'modern, precise, automated'
    },
    result: {
      concept: 'Grading consistency dashboard',
      prompt: 'Vector illustration of diamond grading analytics dashboard, large 98.5% accuracy metric, consistency comparison charts, 3x throughput indicator, before/after variance graphs, diamond icons with checkmarks, flat design style, success green and data blue colors with gold diamond accents, professional analytics interface, clean dashboard layout',
      colors: ['#10B981', '#3B82F6', '#FCD34D'],
      mood: 'accurate, consistent, successful'
    }
  },
  'restaurant-chain-digital-marketing': {
    title: 'Restaurant Chain Digital Marketing',
    before: {
      concept: 'Minimal social media presence',
      prompt: 'Vector illustration of sparse social media presence for restaurant, phone showing Instagram profile with low follower count, few likes, basic food photos, empty restaurant interior in background, outdated website on laptop, flat design style, dull muted colors, uninspiring atmosphere, struggling business mood, isometric perspective',
      colors: ['#6B7280', '#9CA3AF', '#D1D5DB'],
      mood: 'neglected, outdated, struggling'
    },
    after: {
      concept: 'Vibrant social media engagement',
      prompt: 'Vector illustration of vibrant restaurant social media presence, multiple devices showing Instagram and Facebook with high engagement, professional food photography, customer reviews with 5 stars, busy restaurant with happy diners in background, online ordering interface, flat design style, vibrant food colors (red, orange, green), energetic and successful atmosphere, 2.5D perspective',
      colors: ['#EF4444', '#F59E0B', '#10B981'],
      mood: 'energetic, successful, engaging'
    },
    result: {
      concept: 'Digital marketing success metrics',
      prompt: 'Vector illustration of restaurant digital marketing dashboard, large 300% online orders metric, 250% engagement increase, 4.8 star rating display, upward trending revenue graph, social media follower growth chart, mobile ordering icons, flat design style, success green and growth blue colors with food orange accents, celebratory and triumphant mood, clean analytics interface',
      colors: ['#10B981', '#3B82F6', '#F59E0B'],
      mood: 'triumphant, growing, successful'
    }
  },
  'pharma-distributor-portfolio-rationalisation': {
    title: 'Pharma Distributor Portfolio Rationalisation',
    before: {
      concept: 'Complex disconnected systems',
      prompt: 'Vector illustration of complex IT application landscape, 14 different software boxes/icons scattered and disconnected, tangled connection lines between systems, frustrated IT professional in center, data silos as isolated containers, cost indicators showing high expenses, flat design style, chaotic multi-colors with red warning indicators, overwhelming and complex atmosphere, network diagram perspective',
      colors: ['#EF4444', '#F59E0B', '#6B7280'],
      mood: 'overwhelming, complex, expensive'
    },
    after: {
      concept: 'Streamlined integrated platform',
      prompt: 'Vector illustration of streamlined IT application landscape, 6 integrated software platforms connected to central ERP hub, clean organized connection lines, happy IT professional, cost savings indicators with downward arrows, flat design style, organized blue and green colors with clean white background, efficient and optimized atmosphere, clean architecture diagram perspective',
      colors: ['#3B82F6', '#10B981', '#FFFFFF'],
      mood: 'organized, efficient, optimized'
    },
    result: {
      concept: 'AI opportunity roadmap',
      prompt: 'Vector illustration of IT portfolio rationalisation results dashboard, large 35% cost reduction metric, 14 to 6 applications consolidation indicator, 5 AI opportunity icons (brain, robot, chart, automation, prediction), strategic roadmap timeline, ROI projection graphs, flat design style, strategic blue and AI purple colors with success green accents, innovative and forward-thinking mood, clean infographic layout',
      colors: ['#3B82F6', '#8B5CF6', '#10B981'],
      mood: 'strategic, forward-thinking, innovative'
    }
  }
};

// Generate markdown file with all prompts
function generatePromptsMarkdown() {
  let markdown = '# AI Image Generation Prompts for Portfolio Case Studies\n\n';
  markdown += 'Generated: ' + new Date().toISOString() + '\n\n';
  markdown += '---\n\n';

  Object.entries(imageSpecs).forEach(([slug, spec]) => {
    markdown += `## ${spec.title}\n\n`;
    markdown += `**Slug**: \`${slug}\`\n\n`;

    ['before', 'after', 'result'].forEach(type => {
      const image = spec[type];
      markdown += `### ${type.charAt(0).toUpperCase() + type.slice(1)} Image\n\n`;
      markdown += `**Concept**: ${image.concept}\n\n`;
      markdown += `**Mood**: ${image.mood}\n\n`;
      markdown += `**Colors**: ${image.colors.join(', ')}\n\n`;
      markdown += `**Prompt**:\n\`\`\`\n${image.prompt}\n\`\`\`\n\n`;
      markdown += `**File Name**: \`${slug}-${type}.png\`\n\n`;
      markdown += '---\n\n';
    });
  });

  return markdown;
}

// Generate JSON file for API integration
function generatePromptsJSON() {
  const prompts = {};
  
  Object.entries(imageSpecs).forEach(([slug, spec]) => {
    prompts[slug] = {
      title: spec.title,
      images: {
        before: {
          filename: `${slug}-before.png`,
          concept: spec.before.concept,
          prompt: spec.before.prompt,
          colors: spec.before.colors,
          mood: spec.before.mood
        },
        after: {
          filename: `${slug}-after.png`,
          concept: spec.after.concept,
          prompt: spec.after.prompt,
          colors: spec.after.colors,
          mood: spec.after.mood
        },
        result: {
          filename: `${slug}-result.png`,
          concept: spec.result.concept,
          prompt: spec.result.prompt,
          colors: spec.result.colors,
          mood: spec.result.mood
        }
      }
    };
  });

  return JSON.stringify(prompts, null, 2);
}

// Generate checklist for tracking progress
function generateChecklist() {
  let checklist = '# Portfolio Image Generation Checklist\n\n';
  checklist += 'Track your progress generating images for each case study.\n\n';
  checklist += '---\n\n';

  Object.entries(imageSpecs).forEach(([slug, spec]) => {
    checklist += `## ${spec.title}\n\n`;
    checklist += `- [ ] Before image: \`${slug}-before.png\`\n`;
    checklist += `- [ ] After image: \`${slug}-after.png\`\n`;
    checklist += `- [ ] Result image: \`${slug}-result.png\`\n`;
    checklist += `- [ ] Images optimized (< 200KB each)\n`;
    checklist += `- [ ] Images uploaded to \`/public/case-studies/\`\n`;
    checklist += `- [ ] Alt text added to case study markdown\n\n`;
  });

  checklist += '---\n\n';
  checklist += '## Summary\n\n';
  checklist += `Total images needed: ${Object.keys(imageSpecs).length * 3}\n`;
  checklist += 'Estimated time: 2-4 hours with AI tools\n';
  checklist += 'Estimated cost: $5-50 depending on tool\n';

  return checklist;
}

// Main execution
function main() {
  const outputDir = path.join(__dirname, '..', 'docs', 'generated');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate files
  const promptsMarkdown = generatePromptsMarkdown();
  const promptsJSON = generatePromptsJSON();
  const checklist = generateChecklist();

  // Write files
  fs.writeFileSync(
    path.join(outputDir, 'portfolio-image-prompts.md'),
    promptsMarkdown
  );
  console.log('✓ Generated: docs/generated/portfolio-image-prompts.md');

  fs.writeFileSync(
    path.join(outputDir, 'portfolio-image-prompts.json'),
    promptsJSON
  );
  console.log('✓ Generated: docs/generated/portfolio-image-prompts.json');

  fs.writeFileSync(
    path.join(outputDir, 'portfolio-image-checklist.md'),
    checklist
  );
  console.log('✓ Generated: docs/generated/portfolio-image-checklist.md');

  console.log('\n✓ All files generated successfully!');
  console.log('\nNext steps:');
  console.log('1. Review the generated prompts in docs/generated/');
  console.log('2. Use the prompts with your preferred AI image generation tool');
  console.log('3. Track progress using the checklist');
  console.log('4. Save generated images to public/case-studies/');
  console.log('5. Optimize images for web (< 200KB each)');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  imageSpecs,
  generatePromptsMarkdown,
  generatePromptsJSON,
  generateChecklist
};