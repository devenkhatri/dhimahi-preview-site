# Requirements Document

## Introduction

This feature will transform the hardcoded resources on the resources page into a dynamic content management system. Currently, all resources (checklists, guides, templates, and calculators) are hardcoded in the React component, making it difficult for content managers to add, update, or remove resources without developer intervention. This feature will create a new "Resources" content type in the existing Decap CMS, allowing non-technical users to manage business resources through the CMS interface while maintaining the existing user experience and functionality.

## Requirements

### Requirement 1

**User Story:** As a content manager, I want to add new business resources through the CMS interface, so that I can expand our resource library without requiring developer assistance.

#### Acceptance Criteria

1. WHEN a content manager accesses the CMS THEN they SHALL see a "Resources" collection in the navigation
2. WHEN a content manager clicks "New Resource" THEN the system SHALL present a form with all necessary resource fields
3. WHEN a content manager fills out the resource form and saves THEN the system SHALL create a new resource file in the content directory
4. WHEN a new resource is published THEN it SHALL automatically appear on the resources page without code changes

### Requirement 2

**User Story:** As a content manager, I want to edit existing resources through the CMS, so that I can keep resource information current and accurate.

#### Acceptance Criteria

1. WHEN a content manager views the Resources collection THEN they SHALL see all existing resources in a list format
2. WHEN a content manager clicks on an existing resource THEN they SHALL be able to edit all resource properties
3. WHEN a content manager updates a resource and saves THEN the changes SHALL be reflected on the live website
4. WHEN a content manager deletes a resource THEN it SHALL be removed from the website immediately

### Requirement 3

**User Story:** As a website visitor, I want to download business resources with the same experience as before, so that the CMS migration doesn't disrupt my user journey.

#### Acceptance Criteria

1. WHEN a visitor accesses the resources page THEN they SHALL see all published resources displayed in the same layout
2. WHEN a visitor clicks on a resource download form THEN the system SHALL function identically to the current implementation
3. WHEN a visitor submits their information THEN they SHALL receive the resource download as before
4. WHEN resources are reordered in the CMS THEN they SHALL appear in the new order on the website

### Requirement 4

**User Story:** As a developer, I want the resources page to dynamically load content from the CMS, so that the codebase is maintainable and content-driven.

#### Acceptance Criteria

1. WHEN the resources page loads THEN it SHALL fetch resource data from markdown files instead of hardcoded arrays
2. WHEN no resources are available THEN the system SHALL display an appropriate fallback message
3. WHEN the CMS content structure changes THEN the system SHALL handle missing fields gracefully
4. WHEN resources are filtered or sorted THEN the system SHALL maintain performance comparable to the hardcoded version

### Requirement 5

**User Story:** As a content manager, I want to control which resource appears as "featured" on the homepage, so that I can highlight our most valuable resources.

#### Acceptance Criteria

1. WHEN creating or editing a resource THEN the content manager SHALL have an option to mark it as "featured"
2. WHEN multiple resources are marked as featured THEN the system SHALL display the most recently published one
3. WHEN no resources are marked as featured THEN the system SHALL default to the first resource in the list
4. WHEN a featured resource is unpublished THEN the system SHALL automatically select the next available featured resource

### Requirement 6

**User Story:** As a content manager, I want to organize resources by type and manage their display order, so that visitors can easily find relevant resources.

#### Acceptance Criteria

1. WHEN creating a resource THEN the content manager SHALL be able to select from predefined resource types (checklist, guide, template, calculator)
2. WHEN creating a resource THEN the content manager SHALL be able to set a display order number
3. WHEN viewing the resources page THEN resources SHALL be sorted by their display order
4. WHEN resources have the same order number THEN they SHALL be sorted by publication date (newest first)

### Requirement 7

**User Story:** As a website visitor, I want to see accurate resource metadata (file size, page count, type), so that I can make informed decisions about which resources to download.

#### Acceptance Criteria

1. WHEN a content manager creates a resource THEN they SHALL be required to specify file size, page count, and resource type
2. WHEN a visitor views a resource THEN they SHALL see the file size, page count, and type displayed clearly
3. WHEN resource files are updated THEN the content manager SHALL be able to update the metadata accordingly
4. WHEN metadata is missing THEN the system SHALL display placeholder values or hide the missing information gracefully