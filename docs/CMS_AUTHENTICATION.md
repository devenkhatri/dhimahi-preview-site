# CMS Authentication and User Management

This document outlines the authentication and user management system for the Decap CMS integration.

## Overview

The CMS uses Netlify Identity for authentication with Git Gateway backend, providing secure access control and user management for content editors.

## Authentication Flow

### 1. Initial Setup

The CMS is configured with:
- **Backend**: Git Gateway (Netlify Identity)
- **Editorial Workflow**: Enabled for content approval
- **Invite-only Access**: Registration is disabled, access by invitation only
- **Role-based Permissions**: Three user roles with different access levels

### 2. User Authentication Process

1. **Access Admin Interface**: Users visit `/admin`
2. **Authentication Check**: System checks for valid Netlify Identity session
3. **Login Required**: If not authenticated, shows login interface
4. **Identity Verification**: Netlify Identity handles authentication
5. **Role Assignment**: User role determines available permissions
6. **CMS Access**: Authenticated users can access appropriate CMS features

## User Roles and Permissions

### Admin Role
- **Permissions**: Full access to all features
  - Create, update, delete content
  - Publish and unpublish content
  - Manage media library
  - User management (invite/remove users)
- **Use Case**: Site administrators and technical leads

### Editor Role
- **Permissions**: Content management
  - Create and update content
  - Manage media library
  - Cannot publish directly (requires approval)
- **Use Case**: Content managers and marketing team

### Contributor Role
- **Permissions**: Limited content creation
  - Create new content
  - Upload media files
  - Cannot edit existing content
  - Cannot publish content
- **Use Case**: Guest writers and content contributors

## Security Features

### Authentication Security
- **Secure Token Management**: Tokens stored in sessionStorage (not persistent)
- **Session Timeout**: 8-hour session timeout for security
- **Rate Limiting**: Maximum 5 login attempts with 15-minute lockout
- **Origin Validation**: Requests validated against allowed domains
- **HTTPS Enforcement**: All authentication requires HTTPS

### Content Security
- **Input Sanitization**: All user input sanitized to prevent XSS
- **File Upload Validation**: Strict file type and size restrictions
- **Content Security Policy**: Comprehensive CSP headers
- **Audit Logging**: All security events logged for monitoring

### Access Control
- **Invite-only Registration**: No public registration allowed
- **Role-based Access**: Permissions enforced at application level
- **Editorial Workflow**: Content changes require approval before publishing
- **Git-based Audit Trail**: All changes tracked in Git history

## User Management

### Inviting New Users

Use the user management script to invite new users:

```bash
# Invite a new editor
npm run cms:invite user@example.com editor "User Name"

# Invite an admin
npm run cms:invite admin@example.com admin "Admin Name"

# Invite a contributor
npm run cms:invite writer@example.com contributor "Writer Name"
```

### Managing Existing Users

```bash
# List all users
npm run cms:users

# View pending invitations
npm run cms:invitations

# Update user role
node scripts/manage-cms-users.js update-role user@example.com admin

# Deactivate user
node scripts/manage-cms-users.js deactivate user@example.com

# View user statistics
npm run cms:stats
```

### User Lifecycle

1. **Invitation**: Admin invites user with specific role
2. **Email Notification**: User receives invitation email
3. **Account Setup**: User clicks invitation link and sets password
4. **Role Assignment**: User automatically assigned invited role
5. **Access Granted**: User can access CMS with role permissions
6. **Ongoing Management**: Admin can update roles or deactivate users

## Configuration

### Netlify Identity Settings

Configure in Netlify dashboard:
- **Registration**: Set to "Invite only"
- **External Providers**: Enable GitHub for easier access
- **Email Templates**: Customize invitation and confirmation emails
- **JWT Expiry**: Set to 8 hours for security

### CMS Configuration

Key settings in `public/admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main
  editorial_workflow: true
  squash_merges: true

publish_mode: editorial_workflow
access_control:
  default_role: editor
  roles:
    admin: [create, update, delete, publish, unpublish, media_library]
    editor: [create, update, media_library]
    contributor: [create, media_library]
```

### Environment Variables

Required environment variables:

```bash
NETLIFY_IDENTITY_ENABLED=true
NETLIFY_IDENTITY_SIGNUP=invite_only
NETLIFY_IDENTITY_CONFIRM_IDENTITY=true
NETLIFY_IDENTITY_RECOVERY=true
NETLIFY_IDENTITY_EXTERNAL_PROVIDERS=github
```

## Security Best Practices

### For Administrators

1. **Regular Access Review**: Periodically review user access and roles
2. **Strong Passwords**: Enforce strong password requirements
3. **Monitor Activity**: Review audit logs for suspicious activity
4. **Timely Deactivation**: Remove access for departing team members
5. **Role Principle**: Assign minimum necessary permissions

### For Users

1. **Secure Passwords**: Use strong, unique passwords
2. **Session Management**: Log out when finished editing
3. **Suspicious Activity**: Report any unusual account activity
4. **Content Backup**: Understand that all changes are tracked in Git
5. **Access Sharing**: Never share login credentials

## Troubleshooting

### Common Authentication Issues

**Problem**: Cannot access admin interface
- **Solution**: Check if user has been invited and confirmed account
- **Check**: Verify email address and role assignment

**Problem**: "Access Denied" errors
- **Solution**: Verify user role has required permissions
- **Check**: Contact admin to update role if needed

**Problem**: Login attempts blocked
- **Solution**: Wait 15 minutes after failed attempts
- **Check**: Ensure correct email and password

**Problem**: Session expires frequently
- **Solution**: This is normal security behavior (8-hour timeout)
- **Check**: Save work frequently and re-authenticate as needed

### Technical Issues

**Problem**: CMS not loading after authentication
- **Solution**: Check browser console for JavaScript errors
- **Check**: Verify all CMS scripts are loading correctly

**Problem**: Content not saving
- **Solution**: Check network connection and authentication status
- **Check**: Verify user has appropriate permissions for the action

**Problem**: Media uploads failing
- **Solution**: Check file size (max 10MB) and type restrictions
- **Check**: Verify user has media_library permission

## Monitoring and Auditing

### Security Events Logged

- User login/logout events
- Failed authentication attempts
- Permission denied events
- Content creation/modification
- File uploads
- Role changes

### Audit Trail

All content changes are tracked through:
- **Git History**: Complete change history with author attribution
- **CMS Audit Log**: User actions within the CMS interface
- **Session Logs**: Authentication and session management events

### Monitoring Recommendations

1. **Regular Log Review**: Check security events weekly
2. **Failed Login Monitoring**: Alert on multiple failed attempts
3. **Permission Changes**: Monitor role and permission updates
4. **Content Changes**: Review significant content modifications
5. **User Activity**: Track user engagement and access patterns

## Emergency Procedures

### Compromised Account

1. **Immediate Action**: Deactivate user account
2. **Password Reset**: Force password reset for affected user
3. **Access Review**: Check what content user had access to
4. **Change Audit**: Review recent changes made by user
5. **Security Update**: Update security measures if needed

### System Breach

1. **Isolate System**: Temporarily disable CMS access
2. **Assess Damage**: Review all recent changes and access logs
3. **Reset Credentials**: Force password reset for all users
4. **Update Security**: Implement additional security measures
5. **Restore Service**: Re-enable access with enhanced monitoring

## Support and Contact

For authentication and user management issues:

1. **Technical Issues**: Check this documentation first
2. **Access Requests**: Contact system administrator
3. **Security Concerns**: Report immediately to admin team
4. **Feature Requests**: Submit through proper channels

---

**Last Updated**: January 2025
**Version**: 1.0
**Maintained By**: Development Team