// Students Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchAndFilter();
    initializeViewSwitching();
    initializeMemberDirectory();
    checkAdminAccess();
    loadMemberData();
});

// Global variables
let allMembers = [];
let filteredMembers = [];
let currentPage = 1;
const membersPerPage = 12;
let currentView = 'grid';
let isLoading = false;

// Sample member data (in production, this would come from an API)
const memberDatabase = [
    {
        id: 'alex-johnson',
        name: 'Alex Johnson',
        title: 'Club President',
        department: 'web-development',
        year: '4th-year',
        role: 'president',
        skills: ['Full Stack', 'React', 'Leadership', 'Node.js'],
        projects: 8,
        email: 'alex@nutechnocrats.com',
        linkedin: 'https://linkedin.com/in/alexjohnson',
        github: 'https://github.com/alexjohnson',
        photo: 'images/members/president.jpg',
        status: 'online',
        bio: 'Passionate full-stack developer with 3 years of experience. Leading the club towards innovation and collaboration.',
        joinedDate: '2021-09-01',
        featured: true,
        executive: true
    },
    {
        id: 'sarah-chen',
        name: 'Sarah Chen',
        title: 'Vice President',
        department: 'ai-ml',
        year: '4th-year',
        role: 'vice-president',
        skills: ['Python', 'TensorFlow', 'Data Science', 'Machine Learning'],
        projects: 6,
        email: 'sarah@nutechnocrats.com',
        linkedin: 'https://linkedin.com/in/sarahchen',
        github: 'https://github.com/sarahchen',
        photo: 'images/members/vice-president.jpg',
        status: 'online',
        bio: 'AI enthusiast working on cutting-edge machine learning projects and research.',
        joinedDate: '2021-09-01',
        featured: true,
        executive: true
    },
    {
        id: 'mike-rodriguez',
        name: 'Mike Rodriguez',
        title: 'Web Development Head',
        department: 'web-development',
        year: '3rd-year',
        role: 'department-head',
        skills: ['React', 'Node.js', 'MongoDB', 'GraphQL'],
        projects: 5,
        email: 'mike@nutechnocrats.com',
        linkedin: 'https://linkedin.com/in/mikerodriguez',
        github: 'https://github.com/mikerodriguez',
        photo: 'images/members/web-head.jpg',
        status: 'away',
        bio: 'Frontend specialist with expertise in modern web technologies and UI frameworks.',
        joinedDate: '2022-01-15'
    },
    {
        id: 'emily-davis',
        name: 'Emily Davis',
        title: 'Cybersecurity Head',
        department: 'cybersecurity',
        year: '3rd-year',
        role: 'department-head',
        skills: ['Ethical Hacking', 'Network Security', 'Penetration Testing', 'CISSP'],
        projects: 4,
        email: 'emily@nutechnocrats.com',
        linkedin: 'https://linkedin.com/in/emilydavis',
        github: 'https://github.com/emilydavis',
        photo: 'images/members/security-head.jpg',
        status: 'online',
        bio: 'Cybersecurity expert focused on protecting digital assets and ethical hacking.',
        joinedDate: '2022-02-01'
    },
    {
        id: 'david-kim',
        name: 'David Kim',
        title: 'Mobile Dev Team Lead',
        department: 'mobile-development',
        year: '2nd-year',
        role: 'team-lead',
        skills: ['Flutter', 'React Native', 'Firebase', 'Dart'],
        projects: 3,
        email: 'david@nutechnocrats.com',
        linkedin: 'https://linkedin.com/in/davidkim',
        github: 'https://github.com/davidkim',
        photo: 'images/members/member1.jpg',
        status: 'online',
        bio: 'Mobile app developer creating cross-platform solutions for real-world problems.',
        joinedDate: '2022-09-01'
    },
    {
        id: 'lisa-wang',
        name: 'Lisa Wang',
        title: 'UI/UX Designer',
        department: 'ui-ux',
        year: '2nd-year',
        role: 'member',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        projects: 2,
        email: 'lisa@nutechnocrats.com',
        linkedin: 'https://linkedin.com/in/lisawang',
        github: 'https://github.com/lisawang',
        photo: 'images/members/member2.jpg',
        status: 'away',
        bio: 'Creative designer focused on user-centered design and intuitive interfaces.',
        joinedDate: '2023-01-15'
    }
    // Add more members as needed...
];

// Initialize search and filter functionality
function initializeSearchAndFilter() {
    const searchInput = document.getElementById('memberSearch');
    const clearButton = document.getElementById('clearSearch');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');

    // Search input handling
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }

    // Clear search button
    if (clearButton) {
        clearButton.addEventListener('click', clearSearch);
    }

    // Filter buttons
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }

    // Real-time filtering on dropdown changes
    ['departmentFilter', 'yearFilter', 'roleFilter'].forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

// Handle search input
function handleSearch(e) {
    const searchTerm = e.target.value;
    const clearButton = document.getElementById('clearSearch');
    
    if (searchTerm.length > 0) {
        clearButton.style.display = 'flex';
    } else {
        clearButton.style.display = 'none';
    }

    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        applyFilters();
    }, 300);
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('memberSearch');
    const clearButton = document.getElementById('clearSearch');
    
    searchInput.value = '';
    clearButton.style.display = 'none';
    applyFilters();
}

// Apply all filters
function applyFilters() {
    const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
    const departmentFilter = document.getElementById('departmentFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const roleFilter = document.getElementById('roleFilter').value;

    filteredMembers = allMembers.filter(member => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            member.name.toLowerCase().includes(searchTerm) ||
            member.title.toLowerCase().includes(searchTerm) ||
            member.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
            member.department.toLowerCase().includes(searchTerm);

        // Department filter
        const matchesDepartment = departmentFilter === '' || member.department === departmentFilter;

        // Year filter
        const matchesYear = yearFilter === '' || member.year === yearFilter;

        // Role filter
        const matchesRole = roleFilter === '' || member.role === roleFilter;

        return matchesSearch && matchesDepartment && matchesYear && matchesRole;
    });

    // Reset pagination
    currentPage = 1;
    
    // Update results count
    updateResultsCount();
    
    // Render filtered members
    renderMembers();
}

// Reset all filters
function resetFilters() {
    document.getElementById('memberSearch').value = '';
    document.getElementById('departmentFilter').value = '';
    document.getElementById('yearFilter').value = '';
    document.getElementById('roleFilter').value = '';
    document.getElementById('clearSearch').style.display = 'none';

    filteredMembers = [...allMembers];
    currentPage = 1;
    updateResultsCount();
    renderMembers();
}

// Update results count display
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    const totalResults = filteredMembers.length;
    const displayedResults = Math.min(currentPage * membersPerPage, totalResults);

    if (resultsCount) {
        resultsCount.textContent = `Showing ${displayedResults} of ${totalResults} members`;
    }
}

// Initialize view switching
function initializeViewSwitching() {
    const viewButtons = document.querySelectorAll('.view-toggle');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            switchView(view);
            
            // Update active state
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Switch between different view modes
function switchView(view) {
    currentView = view;
    const membersGrid = document.getElementById('membersGrid');
    
    // Remove existing view classes
    membersGrid.classList.remove('grid-view', 'list-view', 'table-view');
    
    // Add new view class
    membersGrid.classList.add(`${view}-view`);
    
    // Re-render with new view
    renderMembers();
}

// Initialize member directory
function initializeMemberDirectory() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreMembers);
    }
}

// Load member data
function loadMemberData() {
    // In production, this would be an API call
    allMembers = [...memberDatabase];
    filteredMembers = [...allMembers];
    
    updateStatistics();
    updateResultsCount();
    renderMembers();
}

// Update member statistics
function updateStatistics() {
    const activeMembers = allMembers.filter(member => member.status === 'online').length;
    const departments = [...new Set(allMembers.map(member => member.department))].length;
    const totalProjects = allMembers.reduce((sum, member) => sum + member.projects, 0);

    // Update stat displays
    const totalMembersEl = document.getElementById('totalMembers');
    const activeMembersEl = document.getElementById('activeMembers');
    const departmentCountEl = document.getElementById('departmentCount');
    const ongoingProjectsEl = document.getElementById('ongoingProjects');

    if (totalMembersEl) totalMembersEl.textContent = allMembers.length + '+';
    if (activeMembersEl) activeMembersEl.textContent = activeMembers;
    if (departmentCountEl) departmentCountEl.textContent = departments;
    if (ongoingProjectsEl) ongoingProjectsEl.textContent = totalProjects;
}

// Render members based on current view and filters
function renderMembers() {
    const membersGrid = document.getElementById('membersGrid');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!membersGrid) return;

    // Show loading indicator
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }

    // Clear existing members (except sample ones for demo)
    const existingCards = membersGrid.querySelectorAll('.member-card');
    existingCards.forEach(card => {
        if (!card.classList.contains('featured')) {
            card.remove();
        }
    });

    // Determine members to display
    const startIndex = 0;
    const endIndex = currentPage * membersPerPage;
    const membersToDisplay = filteredMembers.slice(startIndex, endIndex);

    // Render members
    setTimeout(() => {
        membersToDisplay.forEach((member, index) => {
            // Skip if member already exists (for featured members)
            if (document.querySelector(`[data-member-id="${member.id}"]`)) {
                return;
            }

            const memberCard = createMemberCard(member);
            membersGrid.appendChild(memberCard);

            // Animate card appearance
            setTimeout(() => {
                memberCard.style.opacity = '1';
                memberCard.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        // Show/hide load more button
        if (loadMoreBtn) {
            const hasMoreMembers = filteredMembers.length > currentPage * membersPerPage;
            loadMoreBtn.style.display = hasMoreMembers ? 'block' : 'none';
        }

        isLoading = false;
    }, 500);
}

// Create member card HTML
function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = `member-card ${member.featured ? 'featured' : ''} ${member.executive ? 'executive' : ''}`;
    card.setAttribute('data-member-id', member.id);
    card.setAttribute('data-department', member.department);
    card.setAttribute('data-year', member.year);
    card.setAttribute('data-role', member.role);
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.3s ease';

    const departmentClass = member.department.replace(/[^a-zA-Z0-9]/g, '-');
    const statusClass = member.status || 'offline';
    const roleClass = member.role.replace(/[^a-zA-Z0-9]/g, '-');

    card.innerHTML = `
        <div class="member-photo">
            <img src="${member.photo}" alt="${member.name}" loading="lazy">
            <div class="member-status ${statusClass}"></div>
            ${member.role !== 'member' ? `<div class="member-role-badge ${roleClass}">${getRoleBadgeText(member.role)}</div>` : ''}
        </div>
        <div class="member-info">
            <h3 class="member-name">${member.name}</h3>
            <p class="member-title">${member.title}</p>
            <div class="member-department">
                <span class="dept-tag ${departmentClass}">${getDepartmentName(member.department)}</span>
            </div>
            <div class="member-skills">
                ${member.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                ${member.skills.length > 3 ? `<span class="skill-tag more">+${member.skills.length - 3}</span>` : ''}
            </div>
            <div class="member-stats">
                <div class="stat">
                    <i class="fas fa-project-diagram"></i>
                    <span>${member.projects} Projects</span>
                </div>
                <div class="stat">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${getYearText(member.year)}</span>
                </div>
            </div>
            <div class="member-contact">
                <a href="mailto:${member.email}" class="contact-btn" title="Email">
                    <i class="fas fa-envelope"></i>
                </a>
                <a href="${member.linkedin}" class="contact-btn" target="_blank" title="LinkedIn">
                    <i class="fab fa-linkedin"></i>
                </a>
                <a href="${member.github}" class="contact-btn" target="_blank" title="GitHub">
                    <i class="fab fa-github"></i>
                </a>
                <button class="contact-btn" onclick="viewProfile('${member.id}')" title="View Profile">
                    <i class="fas fa-user"></i>
                </button>
            </div>
        </div>
    `;

    return card;
}

// Helper functions
function getRoleBadgeText(role) {
    const roleMap = {
        'president': 'President',
        'vice-president': 'Vice President',
        'secretary': 'Secretary',
        'treasurer': 'Treasurer',
        'department-head': 'Dept Head',
        'team-lead': 'Team Lead'
    };
    return roleMap[role] || role;
}

function getDepartmentName(department) {
    const deptMap = {
        'web-development': 'Web Development',
        'ai-ml': 'AI & Machine Learning',
        'cybersecurity': 'Cybersecurity',
        'mobile-development': 'Mobile Development',
        'iot-robotics': 'IoT & Robotics',
        'ui-ux': 'UI/UX Design',
        'content-creation': 'Content Creation'
    };
    return deptMap[department] || department;
}

function getYearText(year) {
    const yearMap = {
        '1st-year': '1st Year',
        '2nd-year': '2nd Year',
        '3rd-year': '3rd Year',
        '4th-year': '4th Year',
        'alumni': 'Alumni'
    };
    return yearMap[year] || year;
}

// Load more members
function loadMoreMembers() {
    if (isLoading) return;
    
    isLoading = true;
    currentPage++;
    updateResultsCount();
    renderMembers();
}

// View member profile
function viewProfile(memberId) {
    const member = allMembers.find(m => m.id === memberId);
    if (!member) return;

    const modal = document.getElementById('memberModal');
    const profileContent = document.getElementById('memberProfileContent');

    if (!modal || !profileContent) return;

    // Create profile content
    profileContent.innerHTML = `
        <div class="profile-header">
            <div class="profile-photo">
                <img src="${member.photo}" alt="${member.name}">
                <div class="profile-status ${member.status}"></div>
            </div>
            <div class="profile-info">
                <h2>${member.name}</h2>
                <p class="profile-title">${member.title}</p>
                <div class="profile-department">
                    <span class="dept-tag ${member.department.replace(/[^a-zA-Z0-9]/g, '-')}">${getDepartmentName(member.department)}</span>
                </div>
                <div class="profile-contact-links">
                    <a href="mailto:${member.email}" class="profile-contact-btn">
                        <i class="fas fa-envelope"></i>
                        <span>Email</span>
                    </a>
                    <a href="${member.linkedin}" class="profile-contact-btn" target="_blank">
                        <i class="fab fa-linkedin"></i>
                        <span>LinkedIn</span>
                    </a>
                    <a href="${member.github}" class="profile-contact-btn" target="_blank">
                        <i class="fab fa-github"></i>
                        <span>GitHub</span>
                    </a>
                </div>
            </div>
        </div>

        <div class="profile-details">
            <div class="profile-section">
                <h3><i class="fas fa-user"></i> About</h3>
                <p>${member.bio}</p>
            </div>

            <div class="profile-section">
                <h3><i class="fas fa-cogs"></i> Skills & Expertise</h3>
                <div class="skills-list">
                    ${member.skills.map(skill => `<span class="skill-tag large">${skill}</span>`).join('')}
                </div>
            </div>

            <div class="profile-section">
                <h3><i class="fas fa-chart-bar"></i> Statistics</h3>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <div class="stat-number">${member.projects}</div>
                        <div class="stat-label">Projects Completed</div>
                    </div>
                    <div class="profile-stat">
                        <div class="stat-number">${getYearText(member.year)}</div>
                        <div class="stat-label">Academic Year</div>
                    </div>
                    <div class="profile-stat">
                        <div class="stat-number">${formatDate(member.joinedDate)}</div>
                        <div class="stat-label">Member Since</div>
                    </div>
                </div>
            </div>

            <div class="profile-section">
                <h3><i class="fas fa-project-diagram"></i> Recent Projects</h3>
                <div class="projects-preview">
                    <p class="projects-placeholder">Project details will be loaded from the member's portfolio...</p>
                </div>
            </div>
        </div>
    `;

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close member profile modal
function closeMemberModal() {
    const modal = document.getElementById('memberModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
    });
}

// Check admin access and show/hide admin controls
function checkAdminAccess() {
    const userRole = localStorage.getItem('userRole') || 'student';
    const adminControls = document.getElementById('adminControls');
    
    if (adminControls && (userRole === 'admin' || userRole === 'coordinator')) {
        adminControls.style.display = 'block';
    }
}

// Admin functions (placeholders for now)
function addNewMember() {
    showNotification('Add Member functionality will be implemented soon!', 'info');
}

function exportMembers() {
    // Create CSV export
    const csvContent = generateMemberCSV();
    downloadCSV(csvContent, 'members-export.csv');
    showNotification('Member directory exported successfully!', 'success');
}

function importMembers() {
    showNotification('Import Members functionality will be implemented soon!', 'info');
}

function manageDepartments() {
    showNotification('Department Management will be implemented soon!', 'info');
}

function selectAllMembers() {
    showNotification('Bulk selection functionality will be implemented soon!', 'info');
}

function sendBulkEmail() {
    showNotification('Bulk email functionality will be implemented soon!', 'info');
}

function bulkArchive() {
    showNotification('Bulk archive functionality will be implemented soon!', 'info');
}

// Generate CSV content for export
function generateMemberCSV() {
    const headers = ['Name', 'Title', 'Department', 'Year', 'Role', 'Skills', 'Projects', 'Email'];
    const rows = allMembers.map(member => [
        member.name,
        member.title,
        getDepartmentName(member.department),
        getYearText(member.year),
        getRoleBadgeText(member.role),
        member.skills.join('; '),
        member.projects,
        member.email
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    return csvContent;
}

// Download CSV file
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Utility function for notifications (reuse from utilities.js if available)
function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback notification
        alert(message);
    }
}

// Export functions for global access
window.viewProfile = viewProfile;
window.closeMemberModal = closeMemberModal;
window.addNewMember = addNewMember;
window.exportMembers = exportMembers;
window.importMembers = importMembers;
window.manageDepartments = manageDepartments;
window.selectAllMembers = selectAllMembers;
window.sendBulkEmail = sendBulkEmail;
window.bulkArchive = bulkArchive;