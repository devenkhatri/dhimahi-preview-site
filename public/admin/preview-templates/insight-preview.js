// Insight/Blog Preview Template for Decap CMS
const InsightPreview = createClass({
  render() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']);
    const excerpt = entry.getIn(['data', 'excerpt']);
    const body = entry.getIn(['data', 'body']);
    const author = entry.getIn(['data', 'author']);
    const publishDate = entry.getIn(['data', 'publishDate']);
    const tags = entry.getIn(['data', 'tags']);
    const featuredImage = entry.getIn(['data', 'featuredImage']);
    const category = entry.getIn(['data', 'category']);
    const seo = entry.getIn(['data', 'seo']);

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    return h('div', { className: 'cms-preview insight-preview' },
      // Header Section
      h('article', { className: 'bg-white' },
        h('div', { className: 'bg-gradient-to-br from-white via-blue-50 to-white py-16' },
          h('div', { className: 'container mx-auto px-4 max-w-4xl' },
            h('div', { className: 'text-center mb-12' },
              // Category Badge
              category && h('div', { className: 'inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4' },
                category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
              ),
              
              h('h1', { className: 'text-4xl md:text-5xl font-bold mb-6 leading-tight' }, 
                title || 'Article Title'
              ),
              
              h('p', { className: 'text-xl text-gray-600 max-w-3xl mx-auto mb-8' }, 
                excerpt || 'Article excerpt or summary'
              ),
              
              // Article Meta
              h('div', { className: 'flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-8' },
                author && h('div', { className: 'flex items-center gap-2' },
                  h('div', { className: 'w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs' },
                    author.charAt(0).toUpperCase()
                  ),
                  h('span', {}, `By ${author}`)
                ),
                publishDate && h('div', { className: 'flex items-center gap-2' },
                  h('span', {}, '📅'),
                  h('span', {}, formatDate(publishDate))
                ),
                h('div', { className: 'flex items-center gap-2' },
                  h('span', {}, '⏱️'),
                  h('span', {}, '5 min read')
                )
              ),
              
              // Tags
              tags && tags.size > 0 && h('div', { className: 'flex flex-wrap gap-2 justify-center mb-8' },
                tags.map((tag, index) =>
                  h('span', { 
                    key: index, 
                    className: 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm'
                  }, `#${tag}`)
                ).toArray()
              )
            )
          )
        ),

        // Featured Image Section
        featuredImage && h('div', { className: 'container mx-auto px-4 max-w-4xl mb-12' },
          h('div', { className: 'rounded-2xl overflow-hidden shadow-xl' },
            h('div', { className: 'aspect-video bg-gray-200 flex items-center justify-center' },
              h('img', { 
                src: featuredImage, 
                alt: title || 'Featured image',
                className: 'w-full h-full object-cover'
              })
            )
          )
        ),

        // Article Content
        h('div', { className: 'container mx-auto px-4 max-w-4xl' },
          h('div', { className: 'bg-white rounded-2xl shadow-lg p-8 mb-12' },
            body && h('div', { 
              className: `prose prose-slate max-w-none 
                prose-headings:font-semibold prose-headings:text-gray-900
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-0
                prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-blue-600
                prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-6
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-ul:space-y-2 prose-ul:mb-6
                prose-ol:space-y-2 prose-ol:mb-6
                prose-li:text-gray-700
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:my-6
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg`,
              dangerouslySetInnerHTML: { __html: body || '<p>Article content will appear here...</p>' }
            })
          )
        ),

        // SEO Preview Section (if SEO data exists)
        seo && h('div', { className: 'container mx-auto px-4 max-w-4xl mb-12' },
          h('div', { className: 'bg-gray-50 rounded-2xl p-6' },
            h('h3', { className: 'text-lg font-semibold mb-4 text-gray-800' }, 'SEO Preview'),
            h('div', { className: 'bg-white rounded-lg p-4 border border-gray-200' },
              h('div', { className: 'text-blue-600 text-lg font-medium mb-1' }, 
                seo.get('metaTitle') || title || 'Article Title'
              ),
              h('div', { className: 'text-green-600 text-sm mb-2' }, 
                'https://dhimahitechnolabs.com/insights/article-slug'
              ),
              h('div', { className: 'text-gray-600 text-sm' }, 
                seo.get('metaDescription') || excerpt || 'Article description for search engines'
              )
            )
          )
        ),

        // Author Bio Section
        author && h('div', { className: 'container mx-auto px-4 max-w-4xl mb-12' },
          h('div', { className: 'bg-blue-50 rounded-2xl p-8' },
            h('div', { className: 'flex items-start gap-4' },
              h('div', { className: 'w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl' },
                author.charAt(0).toUpperCase()
              ),
              h('div', {},
                h('h3', { className: 'text-xl font-semibold mb-2' }, `About ${author}`),
                h('p', { className: 'text-gray-700 mb-4' }, 
                  `${author} is a technology expert at Dhimahi Technolabs with extensive experience in helping SMEs adopt modern digital solutions.`
                ),
                h('div', { className: 'flex gap-3' },
                  h('a', { 
                    href: '#', 
                    className: 'text-blue-600 hover:underline text-sm'
                  }, 'View Profile'),
                  h('a', { 
                    href: '#', 
                    className: 'text-blue-600 hover:underline text-sm'
                  }, 'More Articles')
                )
              )
            )
          )
        ),

        // Related Articles Section
        h('div', { className: 'container mx-auto px-4 max-w-4xl mb-12' },
          h('div', { className: 'bg-gray-50 rounded-2xl p-8' },
            h('h3', { className: 'text-2xl font-bold mb-6 text-center' }, 'Related Articles'),
            h('div', { className: 'grid gap-6 md:grid-cols-3' },
              // Mock related articles
              Array.from({ length: 3 }, (_, index) =>
                h('div', { key: index, className: 'bg-white rounded-xl p-4 shadow-sm' },
                  h('div', { className: 'aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center' },
                    h('span', { className: 'text-gray-400 text-2xl' }, '📄')
                  ),
                  h('h4', { className: 'font-semibold text-sm mb-2' }, 'Related Article Title'),
                  h('p', { className: 'text-gray-600 text-xs mb-3' }, 'Brief description of the related article...'),
                  h('a', { 
                    href: '#', 
                    className: 'text-blue-600 text-xs font-medium hover:underline'
                  }, 'Read More →')
                )
              )
            )
          )
        ),

        // CTA Section
        h('div', { className: 'bg-blue-600 text-white py-16' },
          h('div', { className: 'container mx-auto px-4 max-w-4xl text-center' },
            h('h2', { className: 'text-3xl font-bold mb-4' }, 'Need Help Implementing These Ideas?'),
            h('p', { className: 'text-xl mb-8 opacity-90' },
              'Our team can help you apply these insights to your business. Get a free consultation today.'
            ),
            h('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
              h('button', { className: 'rounded-2xl bg-white text-blue-600 px-8 py-4 font-medium shadow-lg' },
                'Get Free Consultation'
              ),
              h('button', { className: 'rounded-2xl border border-white/70 px-8 py-4 font-medium' },
                'View More Insights'
              )
            )
          )
        )
      )
    );
  }
});

// Register the preview template
CMS.registerPreviewTemplate('insights', InsightPreview);