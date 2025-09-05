/**
 * Custom media widget for Decap CMS
 * Provides enhanced media management with automatic alt text and optimization
 */

// Media widget with enhanced features
const MediaWidget = createClass({
  displayName: 'MediaWidget',

  getInitialState() {
    return {
      showBrowser: false,
      selectedMedia: this.props.value || null,
      altText: '',
      caption: '',
      isGeneratingAlt: false
    };
  },

  componentDidMount() {
    // Load existing alt text and caption if available
    if (this.props.value && typeof this.props.value === 'object') {
      this.setState({
        selectedMedia: this.props.value.src || this.props.value,
        altText: this.props.value.alt || '',
        caption: this.props.value.caption || ''
      });
    }
  },

  handleMediaSelect(media) {
    const mediaData = {
      src: media.src || media,
      alt: this.state.altText || this.generateAltText(media.filename || media),
      caption: this.state.caption
    };

    this.setState({
      selectedMedia: media.src || media,
      showBrowser: false
    });

    // Update the field value
    this.props.onChange(mediaData);
  },

  handleAltTextChange(event) {
    const altText = event.target.value;
    this.setState({ altText });

    // Update the field value with new alt text
    const mediaData = {
      src: this.state.selectedMedia,
      alt: altText,
      caption: this.state.caption
    };
    this.props.onChange(mediaData);
  },

  handleCaptionChange(event) {
    const caption = event.target.value;
    this.setState({ caption });

    // Update the field value with new caption
    const mediaData = {
      src: this.state.selectedMedia,
      alt: this.state.altText,
      caption: caption
    };
    this.props.onChange(mediaData);
  },

  generateAltText(filename) {
    if (!filename) return '';
    
    // Extract meaningful text from filename
    const cleanName = filename
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words

    // Determine context based on field name or collection
    const fieldName = this.props.field.get('name', '').toLowerCase();
    const collection = this.props.collection?.get('name', '').toLowerCase();
    
    let prefix = 'Image of';
    if (collection === 'case-studies' || fieldName.includes('case')) {
      prefix = 'Case study image showing';
    } else if (collection === 'services' || fieldName.includes('service')) {
      prefix = 'Service illustration for';
    } else if (collection === 'insights' || fieldName.includes('insight') || fieldName.includes('blog')) {
      prefix = 'Article image for';
    } else if (fieldName.includes('team') || fieldName.includes('author')) {
      prefix = 'Team member photo of';
    } else if (fieldName.includes('testimonial') || fieldName.includes('client')) {
      prefix = 'Client testimonial from';
    }

    return `${prefix} ${cleanName}`;
  },

  handleGenerateAltText() {
    if (!this.state.selectedMedia) return;

    this.setState({ isGeneratingAlt: true });

    // Extract filename from URL
    const filename = this.state.selectedMedia.split('/').pop() || '';
    const generatedAlt = this.generateAltText(filename);

    setTimeout(() => {
      this.setState({
        altText: generatedAlt,
        isGeneratingAlt: false
      });

      // Update the field value
      const mediaData = {
        src: this.state.selectedMedia,
        alt: generatedAlt,
        caption: this.state.caption
      };
      this.props.onChange(mediaData);
    }, 500);
  },

  handleRemoveMedia() {
    this.setState({
      selectedMedia: null,
      altText: '',
      caption: ''
    });
    this.props.onChange(null);
  },

  render() {
    const { selectedMedia, altText, caption, showBrowser, isGeneratingAlt } = this.state;
    const { field } = this.props;
    const fieldName = field.get('name', '');
    const isRequired = field.get('required', false);

    return h('div', { className: 'media-widget' }, [
      // Media preview
      selectedMedia && h('div', { 
        key: 'preview',
        className: 'media-preview',
        style: {
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '12px',
          backgroundColor: '#f9f9f9'
        }
      }, [
        h('div', {
          style: {
            position: 'relative',
            display: 'inline-block',
            maxWidth: '200px'
          }
        }, [
          h('img', {
            src: selectedMedia,
            alt: altText || 'Preview',
            style: {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '4px'
            }
          }),
          h('button', {
            type: 'button',
            onClick: this.handleRemoveMedia,
            style: {
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#ff4757',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '12px'
            }
          }, '×')
        ]),
        
        // Alt text input
        h('div', { style: { marginTop: '12px' } }, [
          h('label', {
            style: {
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '4px',
              color: '#333'
            }
          }, 'Alt Text (Required for Accessibility)'),
          h('div', { style: { display: 'flex', gap: '8px' } }, [
            h('input', {
              type: 'text',
              value: altText,
              onChange: this.handleAltTextChange,
              placeholder: 'Describe what the image shows...',
              style: {
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }
            }),
            h('button', {
              type: 'button',
              onClick: this.handleGenerateAltText,
              disabled: isGeneratingAlt,
              style: {
                padding: '8px 12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: isGeneratingAlt ? 'not-allowed' : 'pointer',
                opacity: isGeneratingAlt ? 0.6 : 1
              }
            }, isGeneratingAlt ? 'Generating...' : 'Auto-generate')
          ])
        ]),

        // Caption input
        h('div', { style: { marginTop: '8px' } }, [
          h('label', {
            style: {
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '4px',
              color: '#333'
            }
          }, 'Caption (Optional)'),
          h('input', {
            type: 'text',
            value: caption,
            onChange: this.handleCaptionChange,
            placeholder: 'Optional caption for the image...',
            style: {
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }
          })
        ])
      ]),

      // Media selection button
      !selectedMedia && h('button', {
        key: 'select',
        type: 'button',
        onClick: () => this.setState({ showBrowser: true }),
        style: {
          width: '100%',
          padding: '12px',
          border: '2px dashed #ddd',
          borderRadius: '4px',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#666'
        }
      }, `Select ${fieldName || 'Image'}`),

      // Change media button
      selectedMedia && h('button', {
        key: 'change',
        type: 'button',
        onClick: () => this.setState({ showBrowser: true }),
        style: {
          padding: '8px 16px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          marginTop: '8px'
        }
      }, 'Change Image'),

      // Media browser modal (simplified)
      showBrowser && h('div', {
        key: 'browser',
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, [
        h('div', {
          style: {
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }
        }, [
          h('h3', { style: { marginTop: 0 } }, 'Select Media'),
          h('p', {}, 'Media browser would be integrated here with the CMS media library.'),
          h('div', { style: { marginTop: '20px', textAlign: 'right' } }, [
            h('button', {
              type: 'button',
              onClick: () => this.setState({ showBrowser: false }),
              style: {
                padding: '8px 16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px'
              }
            }, 'Cancel')
          ])
        ])
      ])
    ]);
  }
});

// Register the widget
if (typeof CMS !== 'undefined') {
  CMS.registerWidget('enhanced-image', MediaWidget);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MediaWidget;
}