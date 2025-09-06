// Settings Preview Template for Decap CMS
const SettingsPreview = createClass({
  render() {
    const entry = this.props.entry;
    const siteTitle = entry.getIn(['data', 'siteTitle']);
    const siteDescription = entry.getIn(['data', 'siteDescription']);
    const contactEmail = entry.getIn(['data', 'contactEmail']);
    const phone = entry.getIn(['data', 'phone']);
    const address = entry.getIn(['data', 'address']);
    const socialMedia = entry.getIn(['data', 'socialMedia']);

    return h('div', { className: 'cms-preview settings-preview' },
      // Header Section
      h('div', { className: 'bg-gradient-to-br from-white via-blue-50 to-white py-16' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'text-center mb-12' },
            h('h1', { className: 'text-4xl md:text-5xl font-bold mb-6' }, 'Site Settings Preview'),
            h('p', { className: 'text-xl text-gray-600 max-w-3xl mx-auto' }, 
              'This preview shows how your site settings will appear across the website.'
            )
          )
        )
      ),

      // Site Information Section
      h('div', { className: 'py-12' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'bg-white rounded-2xl shadow-lg p-8 mb-8' },
            h('h2', { className: 'text-2xl font-bold mb-6 text-center' }, 'Site Information'),
            h('div', { className: 'grid gap-6 md:grid-cols-2' },
              h('div', { className: 'bg-blue-50 rounded-xl p-6' },
                h('h3', { className: 'text-lg font-semibold mb-2 text-blue-800' }, 'Site Title'),
                h('p', { className: 'text-blue-700 text-lg' }, siteTitle || 'Your Site Title'),
                h('p', { className: 'text-blue-600 text-sm mt-2' }, 'This appears in browser tabs and search results')
              ),
              h('div', { className: 'bg-green-50 rounded-xl p-6' },
                h('h3', { className: 'text-lg font-semibold mb-2 text-green-800' }, 'Site Description'),
                h('p', { className: 'text-green-700' }, siteDescription || 'Your site description'),
                h('p', { className: 'text-green-600 text-sm mt-2' }, 'Used for SEO meta descriptions')
              )
            )
          )
        )
      ),

      // Contact Information Section
      h('div', { className: 'py-12 bg-gray-50' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'bg-white rounded-2xl shadow-lg p-8' },
            h('h2', { className: 'text-2xl font-bold mb-6 text-center' }, 'Contact Information'),
            h('div', { className: 'grid gap-6 md:grid-cols-3' },
              h('div', { className: 'text-center p-6 bg-gray-50 rounded-xl' },
                h('div', { className: 'text-3xl mb-3' }, '📧'),
                h('h3', { className: 'text-lg font-semibold mb-2' }, 'Email'),
                h('p', { className: 'text-gray-700' }, contactEmail || 'your@email.com'),
                h('p', { className: 'text-gray-500 text-sm mt-2' }, 'Primary contact email')
              ),
              h('div', { className: 'text-center p-6 bg-gray-50 rounded-xl' },
                h('div', { className: 'text-3xl mb-3' }, '📞'),
                h('h3', { className: 'text-lg font-semibold mb-2' }, 'Phone'),
                h('p', { className: 'text-gray-700' }, phone || '+91 XXXXX XXXXX'),
                h('p', { className: 'text-gray-500 text-sm mt-2' }, 'Business phone number')
              ),
              h('div', { className: 'text-center p-6 bg-gray-50 rounded-xl' },
                h('div', { className: 'text-3xl mb-3' }, '📍'),
                h('h3', { className: 'text-lg font-semibold mb-2' }, 'Address'),
                h('p', { className: 'text-gray-700' }, address || 'Your business address'),
                h('p', { className: 'text-gray-500 text-sm mt-2' }, 'Physical location')
              )
            )
          )
        )
      ),

      // Social Media Section
      socialMedia && h('div', { className: 'py-12' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'bg-white rounded-2xl shadow-lg p-8' },
            h('h2', { className: 'text-2xl font-bold mb-6 text-center' }, 'Social Media Links'),
            h('div', { className: 'grid gap-4 md:grid-cols-3' },
              socialMedia.get('linkedin') && h('div', { className: 'flex items-center gap-3 p-4 bg-blue-50 rounded-xl' },
                h('div', { className: 'text-2xl' }, '💼'),
                h('div', {},
                  h('h3', { className: 'font-semibold text-blue-800' }, 'LinkedIn'),
                  h('p', { className: 'text-blue-600 text-sm truncate' }, socialMedia.get('linkedin'))
                )
              ),
              socialMedia.get('twitter') && h('div', { className: 'flex items-center gap-3 p-4 bg-sky-50 rounded-xl' },
                h('div', { className: 'text-2xl' }, '🐦'),
                h('div', {},
                  h('h3', { className: 'font-semibold text-sky-800' }, 'Twitter'),
                  h('p', { className: 'text-sky-600 text-sm truncate' }, socialMedia.get('twitter'))
                )
              ),
              socialMedia.get('facebook') && h('div', { className: 'flex items-center gap-3 p-4 bg-indigo-50 rounded-xl' },
                h('div', { className: 'text-2xl' }, '📘'),
                h('div', {},
                  h('h3', { className: 'font-semibold text-indigo-800' }, 'Facebook'),
                  h('p', { className: 'text-indigo-600 text-sm truncate' }, socialMedia.get('facebook'))
                )
              )
            )
          )
        )
      ),

      // SEO Preview Section
      h('div', { className: 'py-12 bg-gray-50' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'bg-white rounded-2xl shadow-lg p-8' },
            h('h2', { className: 'text-2xl font-bold mb-6 text-center' }, 'SEO Preview'),
            h('p', { className: 'text-gray-600 text-center mb-6' }, 
              'This is how your site will appear in search engine results:'
            ),
            h('div', { className: 'bg-gray-50 rounded-xl p-6 max-w-2xl mx-auto' },
              h('div', { className: 'text-blue-600 text-lg font-medium mb-1' }, 
                siteTitle || 'Your Site Title'
              ),
              h('div', { className: 'text-green-600 text-sm mb-2' }, 
                'https://yourwebsite.com'
              ),
              h('div', { className: 'text-gray-600 text-sm' }, 
                siteDescription || 'Your site description will appear here in search results'
              )
            )
          )
        )
      ),

      // Usage Information
      h('div', { className: 'py-12' },
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'bg-blue-50 rounded-2xl p-8' },
            h('h2', { className: 'text-2xl font-bold mb-6 text-center text-blue-800' }, 'How These Settings Are Used'),
            h('div', { className: 'grid gap-6 md:grid-cols-2' },
              h('div', { className: 'bg-white rounded-xl p-6' },
                h('h3', { className: 'text-lg font-semibold mb-3 text-blue-700' }, 'Site Title & Description'),
                h('ul', { className: 'text-gray-700 space-y-2 text-sm' },
                  h('li', {}, '• Browser tab titles'),
                  h('li', {}, '• Search engine results'),
                  h('li', {}, '• Social media sharing'),
                  h('li', {}, '• Website header/footer')
                )
              ),
              h('div', { className: 'bg-white rounded-xl p-6' },
                h('h3', { className: 'text-lg font-semibold mb-3 text-blue-700' }, 'Contact Information'),
                h('ul', { className: 'text-gray-700 space-y-2 text-sm' },
                  h('li', {}, '• Contact page display'),
                  h('li', {}, '• Footer information'),
                  h('li', {}, '• Contact forms'),
                  h('li', {}, '• Local SEO optimization')
                )
              )
            )
          )
        )
      )
    );
  }
});

// Register the preview template
CMS.registerPreviewTemplate('settings', SettingsPreview);