// Case Study Preview Template for Decap CMS
const CaseStudyPreview = createClass({
  render() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']);
    const excerpt = entry.getIn(['data', 'excerpt']);
    const client = entry.getIn(['data', 'client']);
    const projectType = entry.getIn(['data', 'projectType']);
    const duration = entry.getIn(['data', 'duration']);
    const teamSize = entry.getIn(['data', 'teamSize']);
    const challenge = entry.getIn(['data', 'challenge']);
    const solution = entry.getIn(['data', 'solution']);
    const results = entry.getIn(['data', 'results']);
    const images = entry.getIn(['data', 'images']);
    const technologies = entry.getIn(['data', 'technologies']);
    const testimonial = entry.getIn(['data', 'testimonial']);
    const body = entry.getIn(['data', 'body']);
    const category = entry.getIn(['data', 'category']);

    return h('div', { className: 'cms-preview case-study-preview' },
      // Header Section
      h('div', { className: 'bg-gradient-to-br from-white via-blue-50 to-white py-16' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'text-center mb-12' },
            // Category Badge
            category && h('div', { className: 'inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4' },
              category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
            ),
            
            h('h1', { className: 'text-4xl md:text-5xl font-bold mb-4' }, title || 'Case Study Title'),
            h('p', { className: 'text-xl text-gray-600 max-w-3xl mx-auto mb-8' }, excerpt || 'Case study description'),
            
            // Project Info
            h('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-8' },
              client && h('div', { className: 'bg-white rounded-lg p-4 shadow-sm' },
                h('div', { className: 'text-sm text-gray-500 mb-1' }, 'Client'),
                h('div', { className: 'font-semibold' }, client.get('name')),
                h('div', { className: 'text-sm text-gray-600' }, client.get('industry'))
              ),
              projectType && h('div', { className: 'bg-white rounded-lg p-4 shadow-sm' },
                h('div', { className: 'text-sm text-gray-500 mb-1' }, 'Project Type'),
                h('div', { className: 'font-semibold' }, projectType)
              ),
              duration && h('div', { className: 'bg-white rounded-lg p-4 shadow-sm' },
                h('div', { className: 'text-sm text-gray-500 mb-1' }, 'Duration'),
                h('div', { className: 'font-semibold' }, duration)
              ),
              teamSize && h('div', { className: 'bg-white rounded-lg p-4 shadow-sm' },
                h('div', { className: 'text-sm text-gray-500 mb-1' }, 'Team Size'),
                h('div', { className: 'font-semibold' }, `${teamSize} members`)
              )
            )
          )
        )
      ),

      // Image Gallery Section
      images && images.size > 0 && h('div', { className: 'py-12 bg-gray-50' },
        h('div', { className: 'container mx-auto px-4 max-w-6xl' },
          h('h2', { className: 'text-3xl font-bold text-center mb-12' }, 'Project Gallery'),
          h('div', { className: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' },
            images.map((image, index) =>
              h('div', { key: index, className: 'bg-white rounded-2xl overflow-hidden shadow-lg' },
                h('div', { className: 'aspect-video bg-gray-200 flex items-center justify-center' },
                  image.get('src') ? 
                    h('img', { 
                      src: image.get('src'), 
                      alt: image.get('alt') || 'Project image',
                      className: 'w-full h-full object-cover'
                    }) :
                    h('div', { className: 'text-gray-400 text-center' },
                      h('div', { className: 'text-4xl mb-2' }, '🖼️'),
                      h('div', {}, 'Project Image')
                    )
                ),
                h('div', { className: 'p-4' },
                  image.get('type') && h('div', { className: 'inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-2' },
                    image.get('type').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  ),
                  image.get('alt') && h('div', { className: 'font-medium text-sm' }, image.get('alt')),
                  image.get('caption') && h('div', { className: 'text-gray-600 text-xs mt-1' }, image.get('caption'))
                )
              )
            ).toArray()
          )
        )
      ),

      // Challenge Section
      challenge && h('div', { className: 'py-12' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'bg-red-50 rounded-2xl p-8' },
            h('h2', { className: 'text-3xl font-bold mb-6 text-red-800' }, 'The Challenge'),
            h('div', { 
              className: 'prose prose-slate max-w-none text-red-700',
              dangerouslySetInnerHTML: { __html: challenge }
            })
          )
        )
      ),

      // Solution Section
      solution && h('div', { className: 'py-12 bg-gray-50' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'bg-blue-50 rounded-2xl p-8' },
            h('h2', { className: 'text-3xl font-bold mb-6 text-blue-800' }, 'Our Solution'),
            h('div', { className: 'grid gap-4' },
              solution.map((item, index) =>
                h('div', { key: index, className: 'flex items-start gap-3' },
                  h('div', { className: 'flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1' },
                    index + 1
                  ),
                  h('div', { className: 'text-blue-700 font-medium' }, item)
                )
              ).toArray()
            )
          )
        )
      ),

      // Results Section
      results && h('div', { className: 'py-12' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'bg-green-50 rounded-2xl p-8' },
            h('h2', { className: 'text-3xl font-bold mb-6 text-green-800' }, 'Results & Impact'),
            h('div', { className: 'grid gap-6 md:grid-cols-2' },
              results.map((result, index) =>
                h('div', { key: index, className: 'bg-white rounded-xl p-6 shadow-sm' },
                  h('div', { className: 'flex items-center gap-3 mb-3' },
                    h('span', { className: 'text-2xl' }, result.get('icon') || '📈'),
                    h('div', {},
                      h('div', { className: 'text-2xl font-bold text-green-600' },
                        result.get('value') + (result.get('improvement') === 'increase' ? ' ↗️' : result.get('improvement') === 'decrease' ? ' ↘️' : '')
                      ),
                      h('div', { className: 'text-sm text-gray-600' }, result.get('label'))
                    )
                  ),
                  result.get('timeframe') && h('div', { className: 'text-xs text-gray-500' },
                    `Achieved ${result.get('timeframe')}`
                  )
                )
              ).toArray()
            )
          )
        )
      ),

      // Technology Stack Section
      technologies && h('div', { className: 'py-12 bg-gray-50' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('h2', { className: 'text-3xl font-bold text-center mb-12' }, 'Technology Stack'),
          h('div', { className: 'flex flex-wrap gap-3 justify-center' },
            technologies.map((tech, index) =>
              h('div', { key: index, className: 'bg-white rounded-full px-4 py-2 shadow-sm border' },
                h('span', { className: 'font-medium text-sm' }, tech.get('name')),
                tech.get('category') && h('span', { className: 'text-xs text-gray-500 ml-2' }, 
                  `(${tech.get('category')})`
                )
              )
            ).toArray()
          )
        )
      ),

      // Content Section
      body && h('div', { className: 'py-12' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { 
            className: 'prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-gray-900',
            dangerouslySetInnerHTML: { __html: body }
          })
        )
      ),

      // Testimonial Section
      testimonial && h('div', { className: 'py-12 bg-blue-600 text-white' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl text-center' },
          h('h2', { className: 'text-3xl font-bold mb-8' }, 'Client Testimonial'),
          h('div', { className: 'bg-white/10 rounded-2xl p-8' },
            h('blockquote', { className: 'text-xl italic mb-6' }, `"${testimonial.get('quote')}"`),
            h('div', { className: 'font-semibold' },
              `${testimonial.get('author')}, ${testimonial.get('position')}`
            ),
            h('div', { className: 'text-blue-200 text-sm' }, testimonial.get('company'))
          )
        )
      ),

      // CTA Section
      h('div', { className: 'py-16 bg-gray-900 text-white' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl text-center' },
          h('h2', { className: 'text-3xl font-bold mb-4' }, 'Ready for Similar Results?'),
          h('p', { className: 'text-xl mb-8 opacity-90' },
            'Let\'s discuss how we can help your business achieve similar success.'
          ),
          h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
            h('button', { className: 'rounded-2xl bg-blue-600 px-8 py-4 font-medium shadow-lg' },
              'Start Your Project'
            ),
            h('button', { className: 'rounded-2xl border border-white/70 px-8 py-4 font-medium' },
              'View More Case Studies'
            )
          )
        )
      )
    );
  }
});

// Register the preview template
CMS.registerPreviewTemplate('caseStudies', CaseStudyPreview);