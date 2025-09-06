// Homepage Preview Template for Decap CMS
const HomepagePreview = createClass({
  render() {
    const entry = this.props.entry;
    const hero = entry.getIn(['data', 'hero']);
    const servicesOverview = entry.getIn(['data', 'servicesOverview']);
    const testimonials = entry.getIn(['data', 'testimonials']);
    const contactCTA = entry.getIn(['data', 'contactCTA']);

    return h('div', { className: 'cms-preview' },
      // Hero Section Preview
      h('section', { className: 'hero-preview bg-gradient-to-br from-white via-blue-50 to-white py-16' },
        h('div', { className: 'container mx-auto px-4' },
          h('div', { className: 'text-center max-w-4xl mx-auto' },
            // Trust Badge
            hero && h('div', { className: 'inline-flex items-center gap-2 rounded-full bg-blue-100 border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 mb-6' },
              h('span', { className: 'w-2 h-2 bg-green-500 rounded-full' }),
              hero.get('trustBadge')
            ),
            
            // Main Headline
            hero && h('h1', { className: 'text-4xl md:text-6xl font-bold leading-tight mb-6' },
              h('span', { className: 'text-gray-900' }, hero.get('mainHeadline'))
            ),
            
            // Subheadline
            hero && h('div', { 
              className: 'text-xl text-gray-700 mb-8 leading-relaxed',
              dangerouslySetInnerHTML: { __html: hero.get('subheadline') || '' }
            }),
            
            // Statistics
            hero && hero.get('statistics') && h('div', { className: 'grid grid-cols-3 gap-6 mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 max-w-2xl mx-auto' },
              hero.get('statistics').map((stat, index) =>
                h('div', { key: index, className: 'text-center' },
                  h('div', { className: 'text-2xl font-bold text-blue-600' },
                    stat.get('value') + stat.get('suffix')
                  ),
                  h('div', { className: 'text-sm text-gray-600 mt-1' }, stat.get('label'))
                )
              ).toArray()
            ),
            
            // CTA Buttons
            hero && h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center mb-6' },
              h('button', { className: 'rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg' },
                hero.getIn(['ctaButton', 'text']) || 'Get Started'
              ),
              h('button', { className: 'rounded-2xl border-2 border-blue-200 bg-white px-8 py-4 font-semibold text-blue-600' },
                'Explore Services'
              )
            )
          )
        )
      ),
      
      // Services Overview Preview
      servicesOverview && h('section', { className: 'services-preview py-16 bg-gray-50' },
        h('div', { className: 'container mx-auto px-4' },
          h('div', { className: 'text-center mb-12' },
            h('h2', { className: 'text-3xl font-bold mb-4' }, servicesOverview.get('title')),
            h('p', { className: 'text-xl text-gray-600 max-w-3xl mx-auto' }, servicesOverview.get('description'))
          ),
          
          // Featured Services
          servicesOverview.get('featuredServices') && h('div', { className: 'grid gap-6 md:grid-cols-3' },
            servicesOverview.get('featuredServices').map((service, index) =>
              h('div', { key: index, className: 'rounded-2xl bg-white p-6 shadow-lg' },
                h('div', { className: 'text-3xl mb-4' }, service.get('icon') || '🔧'),
                h('h3', { className: 'text-xl font-semibold mb-2' }, service.get('title')),
                h('p', { className: 'text-gray-600 mb-4' }, service.get('description')),
                h('a', { 
                  href: service.get('link') || '#',
                  className: 'text-blue-600 font-medium hover:underline'
                }, 'Learn More →')
              )
            ).toArray()
          )
        )
      ),
      
      // Testimonials Preview
      testimonials && h('section', { className: 'testimonials-preview py-16' },
        h('div', { className: 'container mx-auto px-4' },
          h('div', { className: 'text-center mb-12' },
            h('h2', { className: 'text-3xl font-bold mb-4' }, 'Client Success Stories'),
            h('p', { className: 'text-xl text-gray-600' }, 'What our clients say about working with us')
          ),
          
          testimonials && h('div', { className: 'grid gap-6 md:grid-cols-3' },
            testimonials.map((testimonial, index) =>
              h('div', { key: index, className: 'rounded-2xl bg-white p-6 shadow-lg' },
                h('div', { className: 'flex mb-4' },
                  Array.from({ length: testimonial.get('rating') || 5 }, (_, i) =>
                    h('span', { key: i, className: 'text-yellow-400' }, '★')
                  )
                ),
                h('p', { className: 'italic leading-relaxed mb-4' }, `"${testimonial.get('testimonial')}"`),
                h('div', { className: 'text-sm text-gray-600' },
                  `— ${testimonial.get('clientName')}, ${testimonial.get('company')}`
                )
              )
            ).toArray()
          )
        )
      ),
      
      // Contact CTA Preview
      contactCTA && h('section', { className: 'contact-cta-preview py-16' },
        h('div', { className: 'container mx-auto px-4' },
          h('div', { className: 'rounded-2xl bg-blue-600 text-white p-8 text-center' },
            h('h2', { className: 'text-3xl font-bold mb-4' }, contactCTA.get('title')),
            h('p', { 
              className: 'text-xl mb-8 opacity-90',
              dangerouslySetInnerHTML: { __html: contactCTA.get('description') || '' }
            }),
            h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
              h('button', { className: 'rounded-xl bg-white text-blue-600 px-6 py-3 font-medium' },
                contactCTA.getIn(['primaryButton', 'text']) || 'Get Started'
              ),
              h('button', { className: 'rounded-xl border border-white/70 px-6 py-3 font-medium' },
                contactCTA.getIn(['secondaryButton', 'text']) || 'Learn More'
              )
            )
          )
        )
      )
    );
  }
});

// Register the preview template
CMS.registerPreviewTemplate('homepage', HomepagePreview);