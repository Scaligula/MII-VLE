// Script.js - Common functionality for the VLE

// ===== Global User State =====
let currentUser = null;

// ===== Role-Based Navigation =====
async function initializeRoleBasedNav(expectedRole) {
  try {
    const response = await fetch('/api/me');
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/';
        return;
      }
      throw new Error('Failed to load user info');
    }

    const user = await response.json();
    currentUser = user; // Store user globally

    // Verify user has the expected role
    const userRole = user.role;
    if (userRole !== expectedRole) {
      window.location.href = '/';
      return;
    }

    // Update topbar with user information
    const topbarName = document.getElementById('topbarName');
    const topbarAvatar = document.getElementById('topbarAvatar');
    const topbarInitials = document.getElementById('topbarInitials');
    const userName = document.getElementById('userName');

    if (topbarName) topbarName.textContent = user.name || 'User';
    if (userName) userName.textContent = user.name || 'User';

    if (topbarInitials && user.name) {
      const initials = user.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
      topbarInitials.textContent = initials;
    }

    if (topbarAvatar && user.profilePicture) {
      topbarAvatar.innerHTML = `<img src="${user.profilePicture}" alt="Avatar">`;
    }

    // Show Admin Management link for super admins
    const adminMgmtNav = document.getElementById('adminMgmtNav');
    if (adminMgmtNav && user.adminLevel === 'super') {
      adminMgmtNav.style.display = 'flex';
    }

    // Mark the active nav item
    const currentFile = window.location.pathname.split('/').pop() || 'admin-dashboard.html';
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && href.includes(currentFile)) {
        item.classList.add('active');
      }
    });
  } catch (error) {
    console.error('Error initializing nav:', error);
    window.location.href = '/';
  }
}
