// Utilities Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeResourceFilters();
    initializeChatInterface();
    initializeToolInteractions();
    initializeUploadForm();
    checkUserPermissions();
});

// Resource Filtering System
function initializeResourceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categoryCards = document.querySelectorAll('.category-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.dataset.filter;
            
            // Filter category cards
            categoryCards.forEach(card => {
                const cardLevels = card.dataset.level;
                
                if (filterValue === 'all' || cardLevels.includes(filterValue)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease-in';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Chat Interface with Gemini AI Integration
function initializeChatInterface() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    
    // Handle Enter key
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Auto-resize chat input
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
}

// Send message to AI assistant
async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat('user', message);
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Call Gemini AI API (placeholder - implement actual API call)
        const response = await callGeminiAPI(message);
        
        // Remove typing indicator
        hideTypingIndicator();
        
        // Add AI response to chat
        addMessageToChat('ai', response);
    } catch (error) {
        hideTypingIndicator();
        addMessageToChat('ai', 'Sorry, I\'m having trouble connecting right now. Please try again later.');
        console.error('AI API Error:', error);
    }
}

// Quick question buttons
function askQuickQuestion(question) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value = question;
    sendMessage();
}

// Add message to chat interface
function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (sender === 'user') {
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    } else {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    }
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    // Format message with markdown-like support
    const formattedMessage = formatMessage(message);
    content.innerHTML = formattedMessage;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Animate message appearance
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
        messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }, 100);
}

// Format message content
function formatMessage(message) {
    // Basic markdown-like formatting
    let formatted = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
    
    // Add syntax highlighting for code blocks
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    return formatted;
}

// Typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Placeholder Gemini AI API call
async function callGeminiAPI(message) {
    // This is a placeholder - implement actual Gemini API integration
    // For now, return simulated responses based on common tech questions
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const responses = {
        'react': 'React is a popular JavaScript library for building user interfaces. To get started:\n\n**1. Learn JavaScript basics**\n**2. Set up Node.js and npm**\n**3. Create a React app**: `npx create-react-app my-app`\n**4. Learn JSX, components, and hooks**\n\nWould you like specific resources for any of these topics?',
        'api': '**API Design Best Practices:**\n\n• Use RESTful principles\n• Consistent naming conventions\n• Proper HTTP status codes\n• Version your APIs\n• Implement rate limiting\n• Add comprehensive documentation\n• Use HTTPS for security\n• Validate input data\n\nWant me to elaborate on any of these points?',
        'machine learning': '**ML Project Ideas for Beginners:**\n\n• **Sentiment Analysis** - Analyze movie reviews\n• **House Price Prediction** - Using regression\n• **Image Classification** - Cat vs Dog classifier\n• **Recommendation System** - Movie/music recommendations\n• **Stock Price Prediction** - Time series analysis\n\nWhich area interests you most? I can provide more specific guidance!',
        'default': 'That\'s an interesting question! While I\'d love to help with that specific topic, I might not have the most current information. \n\nHere are some general suggestions:\n• Check our resource library for relevant materials\n• Join department discussions for peer insights\n• Consult with faculty mentors for expert guidance\n\nIs there a specific aspect of this topic you\'d like me to help you explore further?'
    };
    
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('react')) return responses.react;
    if (messageLower.includes('api')) return responses.api;
    if (messageLower.includes('machine learning') || messageLower.includes('ml')) return responses['machine learning'];
    
    return responses.default;
}

// Tool Interactions
function initializeToolInteractions() {
    // Add event listeners for tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
}

// Open development tool
function openTool(toolId) {
    const tools = {
        'git-tutorial': 'https://learngitbranching.js.org/',
        'code-formatter': '/tools/formatter.html',
        'color-generator': '/tools/color-palette.html',
        'sql-builder': '/tools/sql-builder.html',
        'debug-helper': '/tools/debug-assistant.html',
        'performance-monitor': '/tools/performance.html'
    };
    
    const url = tools[toolId];
    if (url) {
        if (url.startsWith('http')) {
            window.open(url, '_blank');
        } else {
            // Open internal tool (would need to implement these pages)
            showNotification('Tool will be available soon!', 'info');
        }
    }
}

// Resource Actions
function downloadResource(resourceId) {
    // Simulate resource download
    showNotification(`Downloading ${resourceId.replace('-', ' ')} resource...`, 'success');
    
    // In a real application, this would trigger an actual download
    setTimeout(() => {
        showNotification('Download completed!', 'success');
    }, 2000);
}

function previewResource(resourceId) {
    // Show resource preview modal
    showResourcePreview(resourceId);
}

function showResourcePreview(resourceId) {
    const modal = document.createElement('div');
    modal.className = 'resource-preview-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeResourcePreview()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Resource Preview</h3>
                <button class="modal-close" onclick="closeResourcePreview()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="preview-placeholder">
                    <i class="fas fa-file-alt"></i>
                    <h4>${resourceId.replace('-', ' ').toUpperCase()}</h4>
                    <p>Preview functionality will be available soon.</p>
                    <button class="btn btn-primary" onclick="downloadResource('${resourceId}')">
                        Download Resource
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeResourcePreview() {
    const modal = document.querySelector('.resource-preview-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Template Actions
function previewTemplate(templateId) {
    showNotification(`Opening ${templateId.replace('-', ' ')} template preview...`, 'info');
}

function downloadTemplate(templateId) {
    showNotification(`Downloading ${templateId.replace('-', ' ')} template...`, 'success');
}

// Upload Form Management
function initializeUploadForm() {
    const uploadForm = document.getElementById('resourceUploadForm');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('resourceFile');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleResourceUpload);
    }
    
    if (fileUploadArea && fileInput) {
        // Drag and drop functionality
        fileUploadArea.addEventListener('click', () => fileInput.click());
        
        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        fileUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
        });
        
        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            fileInput.files = files;
            updateFileDisplay(files);
        });
        
        fileInput.addEventListener('change', function(e) {
            updateFileDisplay(e.target.files);
        });
    }
}

function updateFileDisplay(files) {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileList = Array.from(files).map(file => file.name).join(', ');
    
    if (files.length > 0) {
        fileUploadArea.querySelector('p').textContent = `Selected: ${fileList}`;
    }
}

function handleResourceUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const title = formData.get('resourceTitle');
    
    // Simulate upload process
    showNotification('Uploading resource...', 'info');
    
    setTimeout(() => {
        showNotification(`"${title}" uploaded successfully!`, 'success');
        e.target.reset();
        hideUploadForm();
    }, 2000);
}

function hideUploadForm() {
    const uploadSection = document.getElementById('resourceUpload');
    if (uploadSection) {
        uploadSection.style.display = 'none';
    }
}

// Check user permissions and show/hide admin features
function checkUserPermissions() {
    // Simulate checking user role
    const userRole = localStorage.getItem('userRole') || 'student';
    
    if (userRole === 'admin' || userRole === 'contributor') {
        const uploadSection = document.getElementById('resourceUpload');
        if (uploadSection) {
            uploadSection.style.display = 'block';
        }
    }
}

// Utility function for notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Search functionality for resources
function searchResources() {
    const searchInput = document.getElementById('resourceSearch');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const resourceItems = document.querySelectorAll('.resource-item');
    
    resourceItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Export functions for global access
window.sendMessage = sendMessage;
window.askQuickQuestion = askQuickQuestion;
window.openTool = openTool;
window.downloadResource = downloadResource;
window.previewResource = previewResource;
window.closeResourcePreview = closeResourcePreview;
window.previewTemplate = previewTemplate;
window.downloadTemplate = downloadTemplate;
window.hideUploadForm = hideUploadForm;
window.searchResources = searchResources;