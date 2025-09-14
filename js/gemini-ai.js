// Gemini AI Integration for NU Technocrats Utilities
// This file handles the integration with Google's Gemini AI API

class GeminiAI {
    constructor() {
        this.apiKey = null; // Will be set from environment or user input
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.isConfigured = false;
        this.conversationHistory = [];
        this.maxHistoryLength = 10;
        
        this.init();
    }

    async init() {
        // Check if API key is available in localStorage (for demo purposes)
        const storedApiKey = localStorage.getItem('gemini_api_key');
        if (storedApiKey) {
            this.apiKey = storedApiKey;
            this.isConfigured = true;
        } else {
            // Show API key input modal if not configured
            this.showApiKeyInput();
        }
    }

    showApiKeyInput() {
        const modal = document.createElement('div');
        modal.className = 'api-key-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-key"></i> Configure Gemini AI</h3>
                    <p>Enter your Gemini API key to enable AI assistance</p>
                </div>
                <div class="modal-body">
                    <div class="api-key-info">
                        <p><strong>How to get your API key:</strong></p>
                        <ol>
                            <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></li>
                            <li>Sign in with your Google account</li>
                            <li>Create a new API key</li>
                            <li>Copy and paste it below</li>
                        </ol>
                    </div>
                    <div class="form-group">
                        <label for="geminiApiKey">Gemini API Key:</label>
                        <input type="password" id="geminiApiKey" placeholder="Enter your Gemini API key" class="api-key-input">
                        <small>Your API key will be stored locally and used only for AI interactions</small>
                    </div>
                    <div class="api-key-actions">
                        <button class="btn btn-primary" onclick="geminiAI.setApiKey()">
                            <i class="fas fa-save"></i>
                            Save & Continue
                        </button>
                        <button class="btn btn-secondary" onclick="geminiAI.skipApiKey()">
                            Skip (Use Demo Mode)
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    setApiKey() {
        const apiKeyInput = document.getElementById('geminiApiKey');
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            this.showError('Please enter a valid API key');
            return;
        }

        this.apiKey = apiKey;
        this.isConfigured = true;
        localStorage.setItem('gemini_api_key', apiKey);
        
        // Remove modal
        const modal = document.querySelector('.api-key-modal');
        if (modal) {
            modal.remove();
        }

        this.showSuccess('Gemini AI configured successfully!');
    }

    skipApiKey() {
        // Remove modal and continue with demo mode
        const modal = document.querySelector('.api-key-modal');
        if (modal) {
            modal.remove();
        }
        
        this.showInfo('Using demo mode. AI responses will be simulated.');
    }

    async generateResponse(userMessage, context = {}) {
        if (!this.isConfigured) {
            return this.getDemoResponse(userMessage);
        }

        try {
            // Add context to the conversation
            const contextualMessage = this.buildContextualMessage(userMessage, context);
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: contextualMessage
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            };

            const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                
                // Update conversation history
                this.updateConversationHistory(userMessage, aiResponse);
                
                return aiResponse;
            } else {
                throw new Error('Invalid response format from Gemini API');
            }

        } catch (error) {
            console.error('Gemini AI Error:', error);
            
            if (error.message.includes('API request failed')) {
                return "I'm having trouble connecting to the AI service right now. Please check your API key or try again later.";
            }
            
            return "Sorry, I encountered an error processing your request. Please try again.";
        }
    }

    buildContextualMessage(userMessage, context) {
        let contextualMessage = '';

        // Add system context
        contextualMessage += `You are a helpful AI assistant for the NU Technocrats Club, a technical club focusing on technology education and innovation. You help students with:

- Programming and development questions
- Project guidance and architecture advice
- Technology explanations and tutorials
- Learning resource recommendations
- Career guidance in technology fields

Current context: ${context.page || 'Utilities & Resources page'}
Club departments: Web Development, AI/ML, Cybersecurity, Mobile Development, IoT & Robotics, UI/UX Design, Content Creation

Please provide helpful, accurate, and educational responses. Keep responses concise but informative.

User question: ${userMessage}`;

        return contextualMessage;
    }

    updateConversationHistory(userMessage, aiResponse) {
        this.conversationHistory.push({
            user: userMessage,
            ai: aiResponse,
            timestamp: new Date().toISOString()
        });

        // Keep only the last N conversations to manage context length
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }
    }

    getDemoResponse(userMessage) {
        // Enhanced demo responses with more variety
        const messageLower = userMessage.toLowerCase();
        
        const responses = {
            // Programming languages
            'javascript': `JavaScript is a versatile programming language! Here's what you should know:

**For Beginners:**
• Start with variables, functions, and DOM manipulation
• Practice with interactive projects like calculators or games
• Learn ES6+ features (arrow functions, async/await, destructuring)

**Resources:**
• MDN Web Docs for comprehensive reference
• FreeCodeCamp for hands-on practice
• Our Web Development department has great resources!

What specific aspect of JavaScript interests you?`,

            'python': `Python is perfect for beginners and powerful for experts! 

**Why Python?**
• Clean, readable syntax
• Excellent for AI/ML, web development, data science
• Huge community and library ecosystem

**Learning Path:**
1. Basic syntax and data structures
2. Object-oriented programming
3. Popular frameworks (Django, Flask, FastAPI)
4. Specialized libraries (NumPy, pandas, TensorFlow)

Check out our AI/ML department resources for Python projects!`,

            'react': `React is a fantastic choice for modern web development!

**Getting Started:**
1. **Prerequisites:** HTML, CSS, JavaScript (ES6+)
2. **Core Concepts:** Components, JSX, Props, State
3. **Modern React:** Hooks (useState, useEffect, custom hooks)
4. **Tools:** Create React App, Vite, React Developer Tools

**Project Ideas:**
• Todo app with local storage
• Weather dashboard with API integration
• E-commerce product catalog

Our Web Dev department has React resources and mentors available!`,

            // Technologies and concepts
            'api': `APIs are crucial for modern applications! Here's a comprehensive guide:

**REST API Best Practices:**
• Use meaningful HTTP status codes (200, 201, 404, 500)
• Consistent naming conventions (plural nouns for collections)
• Version your APIs (/v1/, /v2/)
• Implement proper authentication (JWT, OAuth)
• Add rate limiting and caching
• Comprehensive documentation (OpenAPI/Swagger)

**Design Principles:**
• Stateless operations
• Resource-based URLs
• JSON for data exchange
• Error handling with clear messages

Need help with a specific API project?`,

            'database': `Databases are the backbone of applications! Let's explore:

**SQL Databases (PostgreSQL, MySQL):**
• ACID compliance for data integrity
• Complex relationships and joins
• Strong consistency
• Perfect for transactional data

**NoSQL Databases (MongoDB, Redis):**
• Flexible schema design
• Horizontal scaling
• Document/key-value storage
• Great for rapid development

**Design Tips:**
• Normalize your data structure
• Index frequently queried columns
• Use connection pooling
• Implement proper backup strategies

What type of project are you working on?`,

            // AI and Machine Learning
            'machine learning': `Machine Learning is an exciting field! Here's your roadmap:

**Beginner Path:**
1. **Math Foundation:** Statistics, Linear Algebra basics
2. **Python Libraries:** NumPy, pandas, matplotlib
3. **ML Libraries:** scikit-learn, TensorFlow, PyTorch
4. **Practice Projects:** Start with supervised learning

**Project Ideas:**
• **Classification:** Email spam detection, image recognition
• **Regression:** House price prediction, stock analysis
• **Clustering:** Customer segmentation, recommendation systems
• **NLP:** Sentiment analysis, chatbots

**Resources:**
• Kaggle for datasets and competitions
• Coursera ML courses
• Our AI/ML department has mentors and study groups!

Which ML area interests you most?`,

            'ai': `Artificial Intelligence is transforming every industry!

**Current Hot Topics:**
• **Large Language Models:** GPT, Gemini, Claude
• **Computer Vision:** Object detection, facial recognition
• **Generative AI:** Image/text/code generation
• **Edge AI:** Running AI on mobile/IoT devices

**Getting Started:**
1. Learn Python fundamentals
2. Understand neural networks basics
3. Practice with TensorFlow/PyTorch
4. Work on real-world projects

**Ethical Considerations:**
• Bias in AI systems
• Privacy and data protection
• Transparency and explainability
• Job displacement concerns

Want to explore a specific AI application?`,

            // Career guidance
            'career': `Great question! Tech careers offer amazing opportunities:

**Popular Career Paths:**
• **Software Developer:** Web, mobile, desktop applications
• **Data Scientist:** Analytics, ML, business intelligence  
• **Cybersecurity Specialist:** Threat analysis, penetration testing
• **UI/UX Designer:** User experience, interface design
• **DevOps Engineer:** Infrastructure, CI/CD, cloud platforms
• **Product Manager:** Strategy, roadmaps, user research

**Building Your Profile:**
• Create a strong GitHub portfolio
• Contribute to open source projects
• Build real-world applications
• Network within tech communities
• Keep learning new technologies

**Interview Preparation:**
• Practice coding problems (LeetCode, HackerRank)
• Build system design knowledge
• Prepare behavioral questions
• Mock interviews with peers

What field interests you most? I can provide more specific guidance!`,

            // Default response
            'default': `That's a thoughtful question! While I'd love to provide detailed guidance on that specific topic, here are some ways to explore it further:

**Learning Strategies:**
• Break down complex topics into smaller components
• Find hands-on projects related to your question
• Connect with peers in relevant departments
• Consult with faculty mentors for expert insights

**NU Technocrats Resources:**
• Check our resource library for relevant materials
• Join department Discord channels for discussions  
• Attend workshops and tech talks
• Participate in collaborative projects

**External Resources:**
• Official documentation and tutorials
• GitHub repositories and examples
• Stack Overflow for specific problems
• YouTube channels for visual learning

Would you like me to help you find resources for any particular technology or concept?`
        };

        // Check for specific topics
        if (messageLower.includes('javascript') || messageLower.includes('js')) return responses.javascript;
        if (messageLower.includes('python')) return responses.python;
        if (messageLower.includes('react')) return responses.react;
        if (messageLower.includes('api') && !messageLower.includes('rapid')) return responses.api;
        if (messageLower.includes('database') || messageLower.includes('sql') || messageLower.includes('mongodb')) return responses.database;
        if (messageLower.includes('machine learning') || messageLower.includes('ml')) return responses['machine learning'];
        if (messageLower.includes('ai') || messageLower.includes('artificial intelligence')) return responses.ai;
        if (messageLower.includes('career') || messageLower.includes('job') || messageLower.includes('interview')) return responses.career;

        return responses.default;
    }

    // Smart resource recommendations based on user query
    getResourceRecommendations(userMessage) {
        const messageLower = userMessage.toLowerCase();
        const recommendations = [];

        if (messageLower.includes('web') || messageLower.includes('html') || messageLower.includes('css') || messageLower.includes('javascript')) {
            recommendations.push({
                title: 'React.js Complete Guide',
                category: 'Web Development',
                level: 'Intermediate',
                type: 'PDF + Videos'
            });
        }

        if (messageLower.includes('ai') || messageLower.includes('ml') || messageLower.includes('python')) {
            recommendations.push({
                title: 'Machine Learning with Python',
                category: 'AI & Machine Learning', 
                level: 'Intermediate',
                type: 'Jupyter Notebooks'
            });
        }

        if (messageLower.includes('security') || messageLower.includes('hacking') || messageLower.includes('cybersecurity')) {
            recommendations.push({
                title: 'Ethical Hacking Toolkit',
                category: 'Cybersecurity',
                level: 'Advanced', 
                type: 'Tools + Guides'
            });
        }

        return recommendations;
    }

    // Utility methods for UI feedback
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type) {
        // Use the existing notification system from utilities.js
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Clean up resources
    clearConversationHistory() {
        this.conversationHistory = [];
    }

    removeApiKey() {
        this.apiKey = null;
        this.isConfigured = false;
        localStorage.removeItem('gemini_api_key');
        this.showInfo('API key removed. Switching to demo mode.');
    }
}

// Initialize Gemini AI instance
const geminiAI = new GeminiAI();

// Export for global access
window.geminiAI = geminiAI;

// Integration with utilities.js
// Override the callGeminiAPI function in utilities.js
window.callGeminiAPI = async function(message) {
    const context = {
        page: 'Utilities & Resources',
        user: 'student', // Could be retrieved from localStorage
        timestamp: new Date().toISOString()
    };
    
    return await geminiAI.generateResponse(message, context);
};

// Add API key management to utilities page
document.addEventListener('DOMContentLoaded', function() {
    // Add API configuration button to the AI assistant header
    const aiHeader = document.querySelector('.ai-header');
    if (aiHeader) {
        const configButton = document.createElement('button');
        configButton.className = 'ai-config-btn';
        configButton.innerHTML = '<i class="fas fa-cog"></i>';
        configButton.title = 'Configure AI Settings';
        configButton.onclick = () => geminiAI.showApiKeyInput();
        
        aiHeader.appendChild(configButton);
    }
});