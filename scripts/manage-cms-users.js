#!/usr/bin/env node

/**
 * CMS User Management Script
 * Provides utilities for managing Decap CMS users, roles, and permissions
 */

const fs = require('fs');
const path = require('path');

// Configuration
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || 'dhimahi-site';
const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;

// User roles and their permissions
const USER_ROLES = {
  admin: {
    permissions: ['create', 'update', 'delete', 'publish', 'unpublish', 'media_library', 'user_management'],
    description: 'Full access to all content and user management'
  },
  editor: {
    permissions: ['create', 'update', 'media_library'],
    description: 'Can create and edit content, manage media'
  },
  contributor: {
    permissions: ['create', 'media_library'],
    description: 'Can create content and upload media'
  }
};

// Default user invitations template
const USER_INVITATION_TEMPLATE = {
  subject: 'Invitation to Dhimahi Technolabs Content Management System',
  body: `
You have been invited to manage content for the Dhimahi Technolabs website.

Your role: {{role}}
Permissions: {{permissions}}

To get started:
1. Click the invitation link in your email
2. Set up your password
3. Visit: https://dhimahi-preview-site.netlify.app/admin
4. Sign in with your credentials

If you have any questions, please contact the administrator.

Best regards,
Dhimahi Technolabs Team
  `
};

class CMSUserManager {
  constructor() {
    this.usersFile = path.join(__dirname, '../.cms-users.json');
    this.loadUsers();
  }

  /**
   * Load users from local storage
   */
  loadUsers() {
    try {
      if (fs.existsSync(this.usersFile)) {
        const data = fs.readFileSync(this.usersFile, 'utf8');
        this.users = JSON.parse(data);
      } else {
        this.users = {
          users: [],
          invitations: [],
          lastUpdated: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = { users: [], invitations: [], lastUpdated: new Date().toISOString() };
    }
  }

  /**
   * Save users to local storage
   */
  saveUsers() {
    try {
      this.users.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.usersFile, JSON.stringify(this.users, null, 2));
      console.log('✅ Users data saved successfully');
    } catch (error) {
      console.error('❌ Error saving users:', error);
    }
  }

  /**
   * Add a new user invitation
   */
  inviteUser(email, role = 'editor', name = '') {
    // Validate role
    if (!USER_ROLES[role]) {
      throw new Error(`Invalid role: ${role}. Valid roles: ${Object.keys(USER_ROLES).join(', ')}`);
    }

    // Check if user already exists
    const existingUser = this.users.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error(`User ${email} already exists with role: ${existingUser.role}`);
    }

    // Check if invitation already sent
    const existingInvitation = this.users.invitations.find(i => i.email === email && i.status === 'pending');
    if (existingInvitation) {
      throw new Error(`Invitation already sent to ${email} on ${existingInvitation.sentAt}`);
    }

    // Create invitation
    const invitation = {
      id: this.generateId(),
      email,
      role,
      name,
      status: 'pending',
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      permissions: USER_ROLES[role].permissions
    };

    this.users.invitations.push(invitation);
    this.saveUsers();

    console.log(`✅ Invitation created for ${email} with role: ${role}`);
    console.log(`📧 Send the following invitation details:`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role} (${USER_ROLES[role].description})`);
    console.log(`   Permissions: ${USER_ROLES[role].permissions.join(', ')}`);
    console.log(`   Expires: ${new Date(invitation.expiresAt).toLocaleDateString()}`);

    return invitation;
  }

  /**
   * Accept an invitation (simulate user signup)
   */
  acceptInvitation(email, userId) {
    const invitation = this.users.invitations.find(i => i.email === email && i.status === 'pending');
    if (!invitation) {
      throw new Error(`No pending invitation found for ${email}`);
    }

    // Check if invitation is expired
    if (new Date() > new Date(invitation.expiresAt)) {
      invitation.status = 'expired';
      this.saveUsers();
      throw new Error(`Invitation for ${email} has expired`);
    }

    // Create user
    const user = {
      id: userId || this.generateId(),
      email: invitation.email,
      name: invitation.name || invitation.email,
      role: invitation.role,
      permissions: invitation.permissions,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      invitedBy: 'system'
    };

    this.users.users.push(user);
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date().toISOString();

    this.saveUsers();

    console.log(`✅ User ${email} successfully added with role: ${user.role}`);
    return user;
  }

  /**
   * Update user role
   */
  updateUserRole(email, newRole) {
    if (!USER_ROLES[newRole]) {
      throw new Error(`Invalid role: ${newRole}. Valid roles: ${Object.keys(USER_ROLES).join(', ')}`);
    }

    const user = this.users.users.find(u => u.email === email);
    if (!user) {
      throw new Error(`User ${email} not found`);
    }

    const oldRole = user.role;
    user.role = newRole;
    user.permissions = USER_ROLES[newRole].permissions;
    user.updatedAt = new Date().toISOString();

    this.saveUsers();

    console.log(`✅ User ${email} role updated from ${oldRole} to ${newRole}`);
    return user;
  }

  /**
   * Deactivate user
   */
  deactivateUser(email) {
    const user = this.users.users.find(u => u.email === email);
    if (!user) {
      throw new Error(`User ${email} not found`);
    }

    user.status = 'inactive';
    user.deactivatedAt = new Date().toISOString();

    this.saveUsers();

    console.log(`✅ User ${email} has been deactivated`);
    return user;
  }

  /**
   * Reactivate user
   */
  reactivateUser(email) {
    const user = this.users.users.find(u => u.email === email);
    if (!user) {
      throw new Error(`User ${email} not found`);
    }

    user.status = 'active';
    user.reactivatedAt = new Date().toISOString();
    delete user.deactivatedAt;

    this.saveUsers();

    console.log(`✅ User ${email} has been reactivated`);
    return user;
  }

  /**
   * List all users
   */
  listUsers() {
    console.log('\n📋 CMS Users:');
    console.log('='.repeat(80));
    
    if (this.users.users.length === 0) {
      console.log('No users found.');
      return;
    }

    this.users.users.forEach(user => {
      const status = user.status === 'active' ? '✅' : '❌';
      console.log(`${status} ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Created: ${new Date(user.createdAt).toLocaleDateString()}`);
      if (user.lastLoginAt) {
        console.log(`   Last Login: ${new Date(user.lastLoginAt).toLocaleDateString()}`);
      }
      console.log('');
    });
  }

  /**
   * List pending invitations
   */
  listInvitations() {
    console.log('\n📧 Pending Invitations:');
    console.log('='.repeat(80));

    const pendingInvitations = this.users.invitations.filter(i => i.status === 'pending');
    
    if (pendingInvitations.length === 0) {
      console.log('No pending invitations.');
      return;
    }

    pendingInvitations.forEach(invitation => {
      const isExpired = new Date() > new Date(invitation.expiresAt);
      const status = isExpired ? '⏰ EXPIRED' : '⏳ PENDING';
      
      console.log(`${status} ${invitation.email}`);
      console.log(`   Role: ${invitation.role}`);
      console.log(`   Sent: ${new Date(invitation.sentAt).toLocaleDateString()}`);
      console.log(`   Expires: ${new Date(invitation.expiresAt).toLocaleDateString()}`);
      console.log('');
    });
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get user statistics
   */
  getStats() {
    const stats = {
      totalUsers: this.users.users.length,
      activeUsers: this.users.users.filter(u => u.status === 'active').length,
      inactiveUsers: this.users.users.filter(u => u.status === 'inactive').length,
      pendingInvitations: this.users.invitations.filter(i => i.status === 'pending').length,
      expiredInvitations: this.users.invitations.filter(i => i.status === 'pending' && new Date() > new Date(i.expiresAt)).length,
      roleDistribution: {}
    };

    // Calculate role distribution
    Object.keys(USER_ROLES).forEach(role => {
      stats.roleDistribution[role] = this.users.users.filter(u => u.role === role).length;
    });

    return stats;
  }

  /**
   * Display statistics
   */
  displayStats() {
    const stats = this.getStats();
    
    console.log('\n📊 CMS User Statistics:');
    console.log('='.repeat(50));
    console.log(`Total Users: ${stats.totalUsers}`);
    console.log(`Active Users: ${stats.activeUsers}`);
    console.log(`Inactive Users: ${stats.inactiveUsers}`);
    console.log(`Pending Invitations: ${stats.pendingInvitations}`);
    console.log(`Expired Invitations: ${stats.expiredInvitations}`);
    console.log('\nRole Distribution:');
    Object.entries(stats.roleDistribution).forEach(([role, count]) => {
      console.log(`  ${role}: ${count}`);
    });
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const userManager = new CMSUserManager();

  try {
    switch (command) {
      case 'invite':
        const email = args[1];
        const role = args[2] || 'editor';
        const name = args[3] || '';
        
        if (!email) {
          console.error('❌ Email is required');
          console.log('Usage: npm run cms:invite <email> [role] [name]');
          process.exit(1);
        }
        
        userManager.inviteUser(email, role, name);
        break;

      case 'accept':
        const acceptEmail = args[1];
        const userId = args[2];
        
        if (!acceptEmail) {
          console.error('❌ Email is required');
          console.log('Usage: npm run cms:accept <email> [userId]');
          process.exit(1);
        }
        
        userManager.acceptInvitation(acceptEmail, userId);
        break;

      case 'update-role':
        const updateEmail = args[1];
        const newRole = args[2];
        
        if (!updateEmail || !newRole) {
          console.error('❌ Email and role are required');
          console.log('Usage: npm run cms:update-role <email> <role>');
          process.exit(1);
        }
        
        userManager.updateUserRole(updateEmail, newRole);
        break;

      case 'deactivate':
        const deactivateEmail = args[1];
        
        if (!deactivateEmail) {
          console.error('❌ Email is required');
          console.log('Usage: npm run cms:deactivate <email>');
          process.exit(1);
        }
        
        userManager.deactivateUser(deactivateEmail);
        break;

      case 'reactivate':
        const reactivateEmail = args[1];
        
        if (!reactivateEmail) {
          console.error('❌ Email is required');
          console.log('Usage: npm run cms:reactivate <email>');
          process.exit(1);
        }
        
        userManager.reactivateUser(reactivateEmail);
        break;

      case 'list':
        userManager.listUsers();
        break;

      case 'invitations':
        userManager.listInvitations();
        break;

      case 'stats':
        userManager.displayStats();
        break;

      case 'roles':
        console.log('\n👥 Available Roles:');
        console.log('='.repeat(50));
        Object.entries(USER_ROLES).forEach(([role, config]) => {
          console.log(`${role.toUpperCase()}:`);
          console.log(`  Description: ${config.description}`);
          console.log(`  Permissions: ${config.permissions.join(', ')}`);
          console.log('');
        });
        break;

      default:
        console.log('🔧 CMS User Management Tool');
        console.log('='.repeat(50));
        console.log('Available commands:');
        console.log('  invite <email> [role] [name]  - Invite a new user');
        console.log('  accept <email> [userId]       - Accept an invitation');
        console.log('  update-role <email> <role>    - Update user role');
        console.log('  deactivate <email>            - Deactivate user');
        console.log('  reactivate <email>            - Reactivate user');
        console.log('  list                          - List all users');
        console.log('  invitations                   - List pending invitations');
        console.log('  stats                         - Show user statistics');
        console.log('  roles                         - Show available roles');
        console.log('');
        console.log('Examples:');
        console.log('  node scripts/manage-cms-users.js invite john@example.com editor "John Doe"');
        console.log('  node scripts/manage-cms-users.js update-role john@example.com admin');
        console.log('  node scripts/manage-cms-users.js list');
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { CMSUserManager, USER_ROLES };