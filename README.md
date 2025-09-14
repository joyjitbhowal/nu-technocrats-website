# NU Technocrats Club Website 🚀

A modern, responsive website for the NU Technocrats Club - Innovation Through Technology.

## 🌟 Overview

This website serves as the digital hub for NU Technocrats Club, featuring comprehensive information about our community, events, projects, and members. Built with modern web technologies and responsive design principles.

## ✨ Features

### 🎯 **Complete Sections**
- **Home** - Hero section with statistics and call-to-action
- **About** - Mission, vision, and club features  
- **Announcements** - Latest news and updates
- **Events** - Workshops, seminars, competitions, networking
- **Members** - Executive team and core member profiles
- **Projects** - Showcase of completed and ongoing work
- **Resources** - Learning materials and development guides
- **Contact** - Contact form and club information

### 🔧 **Interactive Features**
- Filterable events and projects by category
- Animated statistics counters
- Smooth scrolling navigation
- Mobile hamburger menu
- Form validation and notifications
- Back-to-top functionality

### 📱 **Responsive Design**
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interactions
- Accessible navigation

## 🛠️ Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid/Flexbox
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icon library
- **Google Fonts (Inter)** - Typography

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nu-technocrats-website
   ```

2. **Open in browser**
   ```bash
   # Direct file access
   open index.html
   
   # Or with local server
   python -m http.server 8000
   npx live-server
   ```

3. **View the website**
   - File: `file:///path/to/index.html`
   - Server: `http://localhost:8000`

## 📁 Project Structure

```
nu-technocrats-website/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── script.js       # JavaScript functionality
├── images/             # Image assets
│   ├── logo.png
│   ├── members/
│   └── projects/
└── README.md           # Documentation
```

## 🎨 Customization

### Adding New Content

**Members:**
```html
<div class="member-card">
    <div class="member-photo">
        <img src="images/members/name.jpg" alt="Name">
    </div>
    <div class="member-info">
        <h4>Member Name</h4>
        <p class="member-role">Position</p>
        <!-- ... -->
    </div>
</div>
```

**Events:**
```html
<div class="event-card" data-category="workshop">
    <div class="event-header">
        <div class="event-date">
            <span class="day">25</span>
            <span class="month">Dec</span>
        </div>
        <div class="event-type workshop">Workshop</div>
    </div>
    <!-- ... -->
</div>
```

### Styling Updates

Modify CSS variables in `style.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    --text-dark: #1f2937;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Email**: info@nutechnocrats.club
- **Discord**: Join our community server
- **Office**: Tech Building Room 204
- **Hours**: Mon-Fri 4:00 PM - 8:00 PM

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ by NU Technocrats Club**