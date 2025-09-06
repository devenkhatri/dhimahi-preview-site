// Pages Preview Template for Decap CMS (About, Contact, etc.)
const PagesPreview = createClass({
  render() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']);
    const introduction = entry.getIn(['data', 'introduction']);
    const mission = entry.getIn(['data', 'mission']);
    const vision = entry.getIn(['data', 'vision']);
    const values = entry.getIn(['data', 'values']);
    const timeline = entry.getIn(['data', 'timeline']);
    const team = entry.getIn(['data', 'team']);
    const contactInfo = entry.getIn(['data', 'contactInfo']);
    const body = entry.getIn(['data', 'body']);

    return h('div', { className: 'cms-preview pages-preview' },
      // Header Section
      h('div', { className: 'bg-gradient-to-br from-white via-blue-50 to-white py-16' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'text-center mb-12' },
            h('h1', { className: 'text-4xl md:text-5xl font-bold mb-6' }, title || 'Page Title'),
            introduction && h('p', { className: 'text-xl text-gray-600 max-w-3xl mx-auto' }, introduction)
          )
        )
      ),

      // Mission & Vision Section (for About page)
      (mission || vision) && h('div', { className: 'py-12' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'grid gap-8 md:grid-cols-2' },
            mission && h('div', { className: 'bg-blue-50 rounded-2xl p-8' },
              h('h2', { className: 'text-2xl font-bold mb-4 text-blue-800' }, mission.get('title') || 'Our Mission'),
              h('p', { className: 'text-blue-700 leading-relaxed' }, mission.get('statement'))
            ),
            vision && h('div', { className: 'bg-green-50 rounded-2xl p-8' },
              h('h2', { className: 'text-2xl font-bold mb-4 text-green-800' }, vision.get('title') || 'Our Vision'),
              h('p', { className: 'text-green-700 leading-relaxed' }, vision.get('statement'))
            )
          )
        )
      ),

      // Values Section
      values && h('div', { className: 'py-12 bg-gray-50' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('h2', { className: 'text-3xl font-bold text-center mb-12' }, 'Our Values'),
          h('div', { className: 'grid gap-8 md:grid-cols-3' },
            values.map((value, index) =>
              h('div', { key: index, className: 'bg-white rounded-2xl p-6 shadow-lg text-center' },
                h('div', { className: 'text-4xl mb-4' }, value.get('icon') || '⭐'),
                h('h3', { className: 'text-xl font-semibold mb-3' }, value.get('title')),
                h('p', { className: 'text-gray-600' }, value.get('description'))
              )
            ).toArray()
          )
        )
      ),

      // Timeline Section
      timeline && h('div', { className: 'py-12' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('h2', { className: 'text-3xl font-bold text-center mb-12' }, 'Our Journey'),
          h('div', { className: 'space-y-8' },
            timeline.map((item, index) =>
              h('div', { key: index, className: 'flex gap-6' },
                h('div', { className: 'flex-shrink-0' },
                  h('div', { className: 'w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold' },
                    item.get('year')
                  )
                ),
                h('div', { className: 'flex-1 bg-white rounded-2xl p-6 shadow-lg' },
                  h('h3', { className: 'text-xl font-semibold mb-2' }, item.get('title')),
                  h('p', { className: 'text-gray-600' }, item.get('description'))
                )
              )
            ).toArray()
          )
        )
      ),

      // Team Section
      team && h('div', { className: 'py-12 bg-gray-50' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('h2', { className: 'text-3xl font-bold text-center mb-12' }, 'Meet Our Team'),
          h('div', { className: 'grid gap-8 md:grid-cols-2 lg:grid-cols-3' },
            team.map((member, index) =>
              h('div', { key: index, className: 'bg-white rounded-2xl p-6 shadow-lg text-center' },
                h('div', { className: 'w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4' },
                  member.get('name') ? member.get('name').charAt(0).toUpperCase() : '👤'
                ),
                h('h3', { className: 'text-xl font-semibold mb-1' }, member.get('name')),
                h('p', { className: 'text-blue-600 font-medium mb-3' }, member.get('role')),
                h('p', { className: 'text-gray-600 text-sm mb-4' }, member.get('bio')),
                member.get('expertise') && h('div', { className: 'flex flex-wrap gap-2 justify-center' },
                  member.get('expertise').map((skill, skillIndex) =>
                    h('span', { key: skillIndex, className: 'bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs' },
                      skill
                    )
                  ).toArray()
                )
              )
            ).toArray()
          )
        )
      ),

      // Contact Information Section
      contactInfo && h('div', { className: 'py-12' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('h2', { className: 'text-3xl font-bold text-center mb-12' }, 'Get In Touch'),
          h('div', { className: 'grid gap-8 md:grid-cols-3' },
            contactInfo.get('email') && h('div', { className: 'bg-white rounded-2xl p-6 shadow-lg text-center' },
              h('div', { className: 'text-3xl mb-4' }, '📧'),
              h('h3', { className: 'text-lg font-semibold mb-2' }, 'Email Us'),
              h('p', { className: 'text-gray-600' }, contactInfo.get('email'))
            ),
            contactInfo.get('phone') && h('div', { className: 'bg-white rounded-2xl p-6 shadow-lg text-center' },
              h('div', { className: 'text-3xl mb-4' }, '📞'),
              h('h3', { className: 'text-lg font-semibold mb-2' }, 'Call Us'),
              h('p', { className: 'text-gray-600' }, contactInfo.get('phone'))
            ),
            contactInfo.get('address') && h('div', { className: 'bg-white rounded-2xl p-6 shadow-lg text-center' },
              h('div', { className: 'text-3xl mb-4' }, '📍'),
              h('h3', { className: 'text-lg font-semibold mb-2' }, 'Visit Us'),
              h('p', { className: 'text-gray-600' }, contactInfo.get('address'))
            )
          )
        )
      ),

      // Main Content Section
      body && h('div', { className: 'py-12' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'bg-white rounded-2xl shadow-lg p-8' },
            h('div', { 
              className: 'prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-gray-900',
              dangerouslySetInnerHTML: { __html: body }
            })
          )
        )
      ),

      // CTA Section
      h('div', { className: 'py-16 bg-blue-600 text-white' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl text-center' },
          h('h2', { className: 'text-3xl font-bold mb-4' }, 'Ready to Work Together?'),
          h('p', { className: 'text-xl mb-8 opacity-90' },
            'Let\'s discuss how we can help your business grow with the right technology solutions.'
          ),
          h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
            h('button', { className: 'rounded-2xl bg-white text-blue-600 px-8 py-4 font-medium shadow-lg' },
              'Get Free Consultation'
            ),
            h('button', { className: 'rounded-2xl border border-white/70 px-8 py-4 font-medium' },
              'View Our Services'
            )
          )
        )
      )
    );
  }
});

// Register the preview template for different page types
CMS.registerPreviewTemplate('pages', PagesPreview);