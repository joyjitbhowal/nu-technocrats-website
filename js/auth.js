/**
 * Authentication JavaScript for NU Technocrats Club
 * Handles login, registration, password strength, and form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js loaded and initializing...'); // Debug log
    
    // Initialize authentication functionality
    initializeAuthTabs();
    initializePasswordToggles();
    initializePasswordStrength();
    initializeForms();
    initializeModals();
    initializeRoleSelection();
    
    // Ensure login form is shown by default
    switchTab('login');
    
    // Add global switchTab function to window for inline onclick handlers
    window.switchTab = switchTab;
    window.togglePassword = togglePassword;
    
    console.log('Auth.js initialization complete!'); // Debug log
});

/**
 * Initialize tab switching functionality
 */
function initializeAuthTabs() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form-container');

    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            switchTab(targetTab);
        });
    });
    
    // Add event listeners for auth footer links
    const switchToRegister = document.querySelector('.switch-to-register');
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('register');
        });
    }
    
    const switchToLogin = document.querySelector('.switch-to-login');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('login');
        });
    }
}

/**
 * Switch between login and registration tabs
 */
function switchTab(tabName) {
    console.log('Switching to tab:', tabName); // Debug log
    
    // Update tab active states
    document.querySelectorAll('.auth-tab').forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update form visibility
    document.querySelectorAll('.auth-form-container').forEach(container => {
        if (container.id === `${tabName}-form`) {
            container.classList.add('active');
            container.style.display = 'block';
        } else {
            container.classList.remove('active');
            container.style.display = 'none';
        }
    });

    // Reset forms when switching
    const activeForm = document.querySelector(`#${tabName}-form form`);
    if (activeForm) {
        activeForm.reset();
        clearFormErrors(activeForm);
    }
    
    // Hide password strength indicator when switching
    const passwordStrength = document.getElementById('passwordStrength');
    if (passwordStrength) {
        passwordStrength.classList.remove('show');
    }
}

/**
 * Initialize password toggle functionality
 */
function initializePasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find the password input in the same form group
            const formGroup = this.closest('.form-group');
            const passwordInput = formGroup.querySelector('input[type="password"], input[type="text"]');
            
            if (passwordInput) {
                togglePasswordForInput(passwordInput, this);
            }
        });
    });
}

/**
 * Toggle password visibility for a specific input
 */
function togglePasswordForInput(passwordInput, toggleBtn) {
    const icon = toggleBtn.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * Toggle password visibility (legacy function for HTML onclick handlers)
 */
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleBtn = passwordInput.parentNode.querySelector('.password-toggle');
    
    if (passwordInput && toggleBtn) {
        togglePasswordForInput(passwordInput, toggleBtn);
    }
}

/**
 * Initialize password strength indicator
 */
function initializePasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }

    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            checkPasswordMatch();
        });
    }
}

/**
 * Check password strength and update indicator
 */
function checkPasswordStrength(password) {
    const strengthIndicator = document.getElementById('passwordStrength');
    const strengthBar = strengthIndicator.querySelector('.strength-bar');
    const strengthText = strengthIndicator.querySelector('.strength-text');

    if (password.length === 0) {
        strengthIndicator.classList.remove('show');
        return;
    }

    strengthIndicator.classList.add('show');

    let strength = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) strength++;
    else feedback.push('At least 8 characters');

    // Lowercase check
    if (/[a-z]/.test(password)) strength++;
    else feedback.push('lowercase letter');

    // Uppercase check
    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('uppercase letter');

    // Number check
    if (/\d/.test(password)) strength++;
    else feedback.push('number');

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
    else feedback.push('special character');

    // Update strength indicator
    strengthBar.className = 'strength-bar';
    if (strength <= 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = `Weak password${feedback.length > 0 ? ' - Add: ' + feedback.slice(0, 2).join(', ') : ''}`;
        strengthText.style.color = '#ef4444';
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
        strengthText.textContent = `Good password${feedback.length > 0 ? ' - Add: ' + feedback.slice(0, 1).join(', ') : ''}`;
        strengthText.style.color = '#f59e0b';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Strong password!';
        strengthText.style.color = '#10b981';
    }
}

/**
 * Check if passwords match
 */
function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmInput = document.getElementById('confirmPassword');

    if (confirmPassword.length === 0) {
        confirmInput.style.borderColor = '';
        return;
    }

    if (password === confirmPassword) {
        confirmInput.style.borderColor = '#10b981';
    } else {
        confirmInput.style.borderColor = '#ef4444';
    }
}

/**
 * Initialize form submission handlers
 */
function initializeForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }

    // Forgot password form
    const forgotPasswordForm = document.querySelector('#forgotPasswordModal form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
}

/**
 * Handle login form submission
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    showLoading(submitBtn, 'Signing in...');
    
    try {
        // Validate form
        if (!validateLoginForm(form)) {
            hideLoading(submitBtn, '<i class="fas fa-sign-in-alt"></i> Sign In');
            return;
        }

        const loginData = {
            email: formData.get('loginEmail'),
            password: formData.get('loginPassword'),
            rememberMe: formData.get('rememberMe') === 'on'
        };

        // API call simulation (replace with actual API endpoint)
        const response = await simulateAPICall('/api/auth/login', loginData);
        
        if (response.success) {
            showNotification('Login successful! Welcome back.', 'success');
            
            // Show role selection modal if multiple roles
            if (response.user.roles && response.user.roles.length > 1) {
                showRoleSelectionModal(response.user.roles);
            } else {
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = response.redirectUrl || '/dashboard.html';
                }, 1500);
            }
        } else {
            throw new Error(response.message || 'Login failed');
        }

    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message || 'Login failed. Please try again.', 'error');
    } finally {
        hideLoading(submitBtn, '<i class="fas fa-sign-in-alt"></i> Sign In');
    }
}

/**
 * Handle registration form submission
 */
async function handleRegistration(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    showLoading(submitBtn, 'Joining...');
    
    try {
        // Validate form
        if (!validateRegistrationForm(form)) {
            hideLoading(submitBtn, '<i class="fas fa-user-plus"></i> Join the Club');
            return;
        }

        const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked'))
            .map(input => input.value);

        const registrationData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            studentId: formData.get('studentId'),
            department: formData.get('department'),
            year: formData.get('year'),
            interests: interests,
            experience: formData.get('experience'),
            motivation: formData.get('motivation'),
            password: formData.get('password'),
            agreeTerms: formData.get('agreeTerms') === 'on',
            newsletter: formData.get('newsletter') === 'on'
        };

        // API call simulation (replace with actual API endpoint)
        const response = await simulateAPICall('/api/auth/register', registrationData);
        
        if (response.success) {
            showNotification('Registration submitted! Check your email for confirmation.', 'success');
            form.reset();
            clearFormErrors(form);
            
            // Show success message and switch to login
            setTimeout(() => {
                switchTab('login');
            }, 2000);
        } else {
            throw new Error(response.message || 'Registration failed');
        }

    } catch (error) {
        console.error('Registration error:', error);
        showNotification(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        hideLoading(submitBtn, '<i class="fas fa-user-plus"></i> Join the Club');
    }
}

/**
 * Handle forgot password form submission
 */
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    showLoading(submitBtn, 'Sending...');
    
    try {
        const resetData = {
            email: formData.get('resetEmail')
        };

        // API call simulation
        const response = await simulateAPICall('/api/auth/forgot-password', resetData);
        
        if (response.success) {
            showNotification('Password reset link sent to your email!', 'success');
            closeForgotPassword();
        } else {
            throw new Error(response.message || 'Failed to send reset link');
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        showNotification(error.message || 'Failed to send reset link.', 'error');
    } finally {
        hideLoading(submitBtn, 'Send Reset Link');
    }
}

/**
 * Validate login form
 */
function validateLoginForm(form) {
    const email = form.querySelector('[name="loginEmail"]').value.trim();
    const password = form.querySelector('[name="loginPassword"]').value;

    clearFormErrors(form);

    let isValid = true;

    if (!email) {
        showFieldError(form.querySelector('[name="loginEmail"]'), 'Email or Student ID is required');
        isValid = false;
    }

    if (!password) {
        showFieldError(form.querySelector('[name="loginPassword"]'), 'Password is required');
        isValid = false;
    }

    return isValid;
}

/**
 * Validate registration form
 */
function validateRegistrationForm(form) {
    clearFormErrors(form);
    
    let isValid = true;
    const fields = [
        { name: 'firstName', message: 'First name is required' },
        { name: 'lastName', message: 'Last name is required' },
        { name: 'email', message: 'Email is required' },
        { name: 'studentId', message: 'Student ID is required' },
        { name: 'department', message: 'Department is required' },
        { name: 'year', message: 'Academic year is required' },
        { name: 'experience', message: 'Experience level is required' },
        { name: 'password', message: 'Password is required' },
        { name: 'confirmPassword', message: 'Password confirmation is required' }
    ];

    // Check required fields
    fields.forEach(field => {
        const input = form.querySelector(`[name="${field.name}"]`);
        if (!input.value.trim()) {
            showFieldError(input, field.message);
            isValid = false;
        }
    });

    // Email validation
    const email = form.querySelector('[name="email"]').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        showFieldError(form.querySelector('[name="email"]'), 'Please enter a valid email address');
        isValid = false;
    }

    // Password confirmation
    const password = form.querySelector('[name="password"]').value;
    const confirmPassword = form.querySelector('[name="confirmPassword"]').value;
    if (password !== confirmPassword) {
        showFieldError(form.querySelector('[name="confirmPassword"]'), 'Passwords do not match');
        isValid = false;
    }

    // Terms agreement
    const agreeTerms = form.querySelector('[name="agreeTerms"]');
    if (!agreeTerms.checked) {
        showNotification('Please agree to the Terms of Service and Code of Conduct', 'error');
        isValid = false;
    }

    // At least one interest
    const interests = form.querySelectorAll('input[name="interests"]:checked');
    if (interests.length === 0) {
        showNotification('Please select at least one technical interest', 'error');
        isValid = false;
    }

    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.75rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

/**
 * Clear form errors
 */
function clearFormErrors(form) {
    // Reset border colors
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '';
    });

    // Remove error messages
    form.querySelectorAll('.field-error').forEach(error => {
        error.remove();
    });
}

/**
 * Initialize modal functionality
 */
function initializeModals() {
    // Forgot password modal
    const forgotPasswordLinks = document.querySelectorAll('.forgot-password');
    forgotPasswordLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPassword();
        });
    });
    
    // Modal close button
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeForgotPassword();
        });
    }
}

/**
 * Show forgot password modal
 */
function showForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
    
    // Focus on email input
    setTimeout(() => {
        modal.querySelector('input[type="email"]').focus();
    }, 300);
}

/**
 * Close forgot password modal
 */
function closeForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.querySelector('form').reset();
    }, 300);
}

/**
 * Initialize role selection functionality
 */
function initializeRoleSelection() {
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove previous selection
            roleButtons.forEach(b => b.classList.remove('selected'));
            
            // Select current
            this.classList.add('selected');
            
            // Handle role selection
            const role = this.dataset.role;
            selectRole(role);
        });
    });
}

/**
 * Show role selection modal
 */
function showRoleSelectionModal(roles) {
    const modal = document.getElementById('roleModal');
    modal.style.display = 'flex';
    
    // Filter role buttons based on available roles
    const roleButtons = modal.querySelectorAll('.role-btn');
    roleButtons.forEach(btn => {
        const role = btn.dataset.role;
        btn.style.display = roles.includes(role) ? 'flex' : 'none';
    });
}

/**
 * Select role and proceed
 */
function selectRole(role) {
    // API call to set user role
    setTimeout(() => {
        showNotification(`Role selected: ${role}`, 'success');
        
        // Redirect based on role
        const redirectUrls = {
            student: '/student-dashboard.html',
            committee: '/committee-dashboard.html',
            coordinator: '/coordinator-dashboard.html',
            mentor: '/mentor-dashboard.html',
            admin: '/admin-dashboard.html'
        };
        
        setTimeout(() => {
            window.location.href = redirectUrls[role] || '/dashboard.html';
        }, 1500);
    }, 500);
}

/**
 * Show loading state on button
 */
function showLoading(button, text) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
}

/**
 * Hide loading state on button
 */
function hideLoading(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Simulate API call (replace with actual API endpoints)
 */
async function simulateAPICall(endpoint, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate different responses based on endpoint
            if (endpoint.includes('login')) {
                resolve({
                    success: true,
                    user: {
                        id: 1,
                        name: data.email.split('@')[0],
                        email: data.email,
                        roles: ['student'] // or ['student', 'committee'] for multiple roles
                    },
                    redirectUrl: '/student-dashboard.html'
                });
            } else if (endpoint.includes('register')) {
                resolve({
                    success: true,
                    message: 'Registration successful'
                });
            } else if (endpoint.includes('forgot-password')) {
                resolve({
                    success: true,
                    message: 'Reset link sent'
                });
            } else {
                resolve({
                    success: false,
                    message: 'Unknown endpoint'
                });
            }
        }, 1500); // Simulate network delay
    });
}

/**
 * Close modal when clicking outside
 */
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal') || e.target.classList.contains('role-modal')) {
        e.target.style.display = 'none';
        e.target.classList.remove('show');
    }
});

/**
 * Handle escape key to close modals
 */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show, .role-modal').forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('show');
        });
    }
});

/**
 * Social login handlers
 */
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-social.google')) {
        e.preventDefault();
        handleSocialLogin('google');
    } else if (e.target.closest('.btn-social.github')) {
        e.preventDefault();
        handleSocialLogin('github');
    }
});

/**
 * Handle social login
 */
function handleSocialLogin(provider) {
    showNotification(`${provider} login will be available soon!`, 'info');
    
    // In a real implementation, this would redirect to OAuth provider
    // window.location.href = `/api/auth/${provider}`;
}