// Service Preview Template for Decap CMS
const ServicePreview = createClass({
  render() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']);
    const icon = entry.getIn(['data', 'icon']);
    const excerpt = entry.getIn(['data', 'excerpt']);
    const features = entry.getIn(['data', 'features']);
    const processSteps = entry.getIn(['data', 'processSteps']);
    const technologyStack = entry.getIn(['data', 'technologyStack']);
    const faqs = entry.getIn(['data', 'faqs']);
    const timeline = entry.getIn(['data', 'timeline']);
    const startingPrice = entry.getIn(['data', 'startingPrice']);
    const body = entry.getIn(['data', 'body']);

    return h('div', { className: 'cms-preview service-preview' },
      // Header Section
      h('div', { className: 'bg-gradient-to-br from-white via-blue-50 to-white py-16' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'text-center mb-12' },
            h('div', { className: 'text-6xl mb-4' }, icon || '🔧'),
            h('h1', { className: 'text-4xl md:text-5xl font-bold mb-4' }, title || 'Service Title'),
            h('p', { className: 'text-xl text-gray-600 max-w-3xl mx-auto mb-6' }, excerpt || 'Service description'),
            
            // Quick Info
            (startingPrice || timeline) && h('div', { className: 'flex flex-wrap justify-center gap-4 mb-6' },
              startingPrice && h('div', { className: 'bg-blue-100 text-blue-700 px-6 py-3 rounded-full font-medium' },
                `Starting from ${startingPrice}`
              ),
              timeline && h('div', { className: 'bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium' },
                `⏱️ Typical timeline: ${timeline}`
              )
            ),
            
            h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
              h('button', { className: 'rounded-2xl bg-blue-600 px-8 py-4 font-medium text-white shadow-lg' },
                'Get Free Consultation'
              ),
              h('button', { className: 'rounded-2xl border border-gray-300 px-8 py-4 font-medium' },
                'Download Service Guide'
              )
            )
          )
        )
      ),

      // Key Features Section
      features && h('div', { className: 'py-12 bg-gray-50' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'bg-white rounded-2xl p-8' },
            h('h2', { className: 'text-2xl font-bold text-center mb-6' }, 'What We Offer'),
            h('div', { className: 'grid gap-4 md:grid-cols-2' },
              features.map((feature, index) =>
                h('div', { key: index, className: 'flex items-center' },
                  h('span', { className: 'w-2 h-2 bg-blue-600 rounded-full mr-3' }),
                  h('span', { className: 'font-medium' }, feature)
                )
              ).toArray()
            )
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

      // Process Steps Section
      processSteps && h('div', { className: 'py-12 bg-gray-50' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('h2', { className: 'text-3xl font-bold text-center mb-12' }, 'Our Process'),
          h('div', { className: 'space-y-8' },
            processSteps.map((step, index) =>
              h('div', { key: index, className: 'bg-white rounded-2xl p-6 shadow-lg' },
                h('div', { className: 'flex items-start gap-4' },
                  h('div', { className: 'flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg' },
                    step.get('step') || (index + 1)
                  ),
                  h('div', { className: 'flex-1' },
                    h('h3', { className: 'text-xl font-semibold mb-2' }, step.get('title')),
                    h('p', { className: 'text-gray-600 mb-4' }, step.get('description')),
                    h('div', { className: 'flex flex-wrap gap-4 text-sm' },
                      step.get('duration') && h('span', { className: 'bg-blue-100 text-blue-700 px-3 py-1 rounded-full' },
                        `⏱️ ${step.get('duration')}`
                      ),
                      step.get('deliverables') && h('div', { className: 'flex flex-wrap gap-2' },
                        step.get('deliverables').map((deliverable, idx) =>
                          h('span', { key: idx, className: 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs' },
                            deliverable
                          )
                        ).toArray()
                      )
                    )
                  )
                )
              )
            ).toArray()
          )
        )
      ),

      // Technology Stack Section
      technologyStack && h('div', { className: 'py-12' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('h2', { className: 'text-3xl font-bold text-center mb-12' }, 'Technology Stack'),
          h('div', { className: 'grid gap-8 md:grid-cols-2' },
            technologyStack.map((category, index) =>
              h('div', { key: index, className: 'bg-white rounded-2xl p-6 shadow-lg' },
                h('h3', { className: 'text-xl font-semibold mb-4' }, category.get('category')),
                h('div', { className: 'grid gap-3' },
                  category.get('technologies') && category.get('technologies').map((tech, techIndex) =>
                    h('div', { key: techIndex, className: 'flex items-center gap-3 p-3 bg-gray-50 rounded-lg' },
                      h('span', { className: 'text-2xl' }, tech.get('icon') || '⚡'),
                      h('div', {},
                        h('div', { className: 'font-medium' }, tech.get('name')),
                        h('div', { className: 'text-sm text-gray-600' }, tech.get('description'))
                      )
                    )
                  ).toArray()
                )
              )
            ).toArray()
          )
        )
      ),

      // FAQ Section
      faqs && h('div', { className: 'py-12 bg-gray-50' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('h2', { className: 'text-3xl font-bold text-center mb-12' }, 'Frequently Asked Questions'),
          h('div', { className: 'space-y-4' },
            faqs.map((faq, index) =>
              h('div', { key: index, className: 'bg-white rounded-2xl p-6 shadow-lg' },
                h('h3', { className: 'text-lg font-semibold mb-3 text-blue-600' }, faq.get('question')),
                h('div', { 
                  className: 'text-gray-700 prose prose-sm max-w-none',
                  dangerouslySetInnerHTML: { __html: faq.get('answer') || '' }
                })
              )
            ).toArray()
          )
        )
      ),

      // CTA Section
      h('div', { className: 'py-16 bg-blue-600 text-white' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl text-center' },
          h('h2', { className: 'text-3xl font-bold mb-4' }, 'Ready to Get Started?'),
          h('p', { className: 'text-xl mb-8 opacity-90' },
            `Let's discuss how our ${(title || 'service').toLowerCase()} can help your business grow.`
          ),
          h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
            h('button', { className: 'rounded-2xl bg-white text-blue-600 px-8 py-4 font-medium shadow-lg' },
              'Get Free Consultation'
            ),
            h('button', { className: 'rounded-2xl border border-white/70 px-8 py-4 font-medium' },
              'View All Services'
            )
          )
        )
      )
    );
  }
});

// Register the preview template
CMS.registerPreviewTemplate('services', ServicePreview);