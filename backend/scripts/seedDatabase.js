const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Department = require('../models/Department');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

// Sample data
const sampleDepartments = [
    {
        name: 'Web Development',
        description: 'Master modern web technologies including React.js, Node.js, and full-stack development. Build responsive, scalable web applications and learn industry best practices.',
        shortDescription: 'Modern web technologies and full-stack development',
        icon: 'fas fa-code',
        color: '#2563eb',
        primarySkills: ['React.js', 'Node.js', 'JavaScript', 'HTML/CSS', 'MongoDB'],
        technologies: [
            { name: 'React.js', proficiencyLevel: 'advanced' },
            { name: 'Node.js', proficiencyLevel: 'advanced' },
            { name: 'Express.js', proficiencyLevel: 'intermediate' },
            { name: 'MongoDB', proficiencyLevel: 'intermediate' },
            { name: 'TypeScript', proficiencyLevel: 'intermediate' }
        ],
        focusAreas: ['Frontend Development', 'Backend Development', 'Full-Stack Projects'],
        memberCount: 22,
        activeProjects: 8,
        completedProjects: 15,
        isActive: true,
        isRecruiting: true,
        maxMembers: 30
    },
    {
        name: 'Artificial Intelligence & Machine Learning',
        description: 'Explore the frontiers of AI and ML with hands-on projects in deep learning, computer vision, NLP, and data science. Work with cutting-edge frameworks and real-world datasets.',
        shortDescription: 'AI, ML, and data science projects',
        icon: 'fas fa-brain',
        color: '#7c3aed',
        primarySkills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Machine Learning'],
        technologies: [
            { name: 'Python', proficiencyLevel: 'advanced' },
            { name: 'TensorFlow', proficiencyLevel: 'advanced' },
            { name: 'PyTorch', proficiencyLevel: 'intermediate' },
            { name: 'Scikit-learn', proficiencyLevel: 'intermediate' },
            { name: 'OpenCV', proficiencyLevel: 'intermediate' }
        ],
        focusAreas: ['Deep Learning', 'Computer Vision', 'Natural Language Processing', 'Data Analysis'],
        memberCount: 18,
        activeProjects: 6,
        completedProjects: 12,
        isActive: true,
        isRecruiting: true,
        maxMembers: 25
    },
    {
        name: 'Cybersecurity',
        description: 'Protect digital assets and learn ethical hacking techniques. Study network security, penetration testing, cryptography, and security analysis.',
        shortDescription: 'Ethical hacking and security analysis',
        icon: 'fas fa-shield-alt',
        color: '#dc2626',
        primarySkills: ['Ethical Hacking', 'Network Security', 'Penetration Testing', 'Cryptography'],
        technologies: [
            { name: 'Kali Linux', proficiencyLevel: 'advanced' },
            { name: 'Metasploit', proficiencyLevel: 'intermediate' },
            { name: 'Wireshark', proficiencyLevel: 'intermediate' },
            { name: 'Nmap', proficiencyLevel: 'advanced' },
            { name: 'Burp Suite', proficiencyLevel: 'intermediate' }
        ],
        focusAreas: ['Penetration Testing', 'Network Security', 'Web Application Security'],
        memberCount: 14,
        activeProjects: 4,
        completedProjects: 8,
        isActive: true,
        isRecruiting: true,
        maxMembers: 20
    },
    {
        name: 'Mobile Development',
        description: 'Create innovative mobile applications for iOS and Android platforms using modern frameworks and native technologies.',
        shortDescription: 'iOS and Android app development',
        icon: 'fas fa-mobile-alt',
        color: '#059669',
        primarySkills: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase'],
        technologies: [
            { name: 'Flutter', proficiencyLevel: 'advanced' },
            { name: 'React Native', proficiencyLevel: 'intermediate' },
            { name: 'Firebase', proficiencyLevel: 'intermediate' },
            { name: 'Swift', proficiencyLevel: 'beginner' },
            { name: 'Kotlin', proficiencyLevel: 'beginner' }
        ],
        focusAreas: ['Cross-Platform Development', 'UI/UX Design', 'App Store Publishing'],
        memberCount: 16,
        activeProjects: 5,
        completedProjects: 10,
        isActive: true,
        isRecruiting: true,
        maxMembers: 20
    },
    {
        name: 'UI/UX Design',
        description: 'Design user-centered interfaces and experiences. Learn design thinking, prototyping, and user research methodologies.',
        shortDescription: 'User interface and experience design',
        icon: 'fas fa-palette',
        color: '#f59e0b',
        primarySkills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
        technologies: [
            { name: 'Figma', proficiencyLevel: 'advanced' },
            { name: 'Adobe XD', proficiencyLevel: 'intermediate' },
            { name: 'Sketch', proficiencyLevel: 'beginner' },
            { name: 'InVision', proficiencyLevel: 'intermediate' }
        ],
        focusAreas: ['User Experience', 'Interface Design', 'Design Systems', 'User Research'],
        memberCount: 12,
        activeProjects: 7,
        completedProjects: 9,
        isActive: true,
        isRecruiting: true,
        maxMembers: 15
    }
];

const sampleUsers = [
    {
        firstName: 'Admin',
        lastName: 'User',
        email: process.env.ADMIN_EMAIL || 'admin@nutechnocrats.club',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        membershipStatus: 'active',
        isActive: true,
        isEmailVerified: true,
        bio: 'System administrator for NU Technocrats Club',
        skills: ['System Administration', 'Full-Stack Development', 'Database Management']
    },
    {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        password: 'password123',
        studentId: 'CS2021001',
        role: 'president',
        membershipStatus: 'active',
        year: '4th-year',
        major: 'Computer Science',
        isActive: true,
        isEmailVerified: true,
        bio: 'Computer Science student passionate about web development and AI',
        skills: ['JavaScript', 'React', 'Python', 'Machine Learning'],
        interests: ['Web Development', 'AI/ML', 'Open Source'],
        projectsCompleted: 8,
        eventsAttended: 15,
        workshopsAttended: 12
    },
    {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        password: 'password123',
        studentId: 'CS2022002',
        role: 'vice-president',
        membershipStatus: 'active',
        year: '3rd-year',
        major: 'Computer Science',
        isActive: true,
        isEmailVerified: true,
        bio: 'AI enthusiast working on cutting-edge machine learning projects',
        skills: ['Python', 'TensorFlow', 'Data Science', 'Research'],
        interests: ['Machine Learning', 'Data Science', 'Research'],
        projectsCompleted: 6,
        eventsAttended: 20,
        workshopsAttended: 18
    },
    {
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike.davis@example.com',
        password: 'password123',
        studentId: 'CS2023003',
        role: 'department-head',
        membershipStatus: 'active',
        year: '2nd-year',
        major: 'Computer Science',
        isActive: true,
        isEmailVerified: true,
        bio: 'Frontend specialist with expertise in modern web technologies',
        skills: ['React', 'Vue.js', 'CSS', 'UI/UX'],
        interests: ['Frontend Development', 'UI/UX Design', 'Mobile Development'],
        projectsCompleted: 4,
        eventsAttended: 10,
        workshopsAttended: 8
    },
    {
        firstName: 'Emily',
        lastName: 'Wilson',
        email: 'emily.wilson@example.com',
        password: 'password123',
        studentId: 'CS2024004',
        role: 'member',
        membershipStatus: 'active',
        year: '1st-year',
        major: 'Information Systems',
        isActive: true,
        isEmailVerified: true,
        bio: 'New member eager to learn cybersecurity and ethical hacking',
        skills: ['Python', 'Linux', 'Networking'],
        interests: ['Cybersecurity', 'Ethical Hacking', 'Network Security'],
        projectsCompleted: 1,
        eventsAttended: 5,
        workshopsAttended: 3
    },
    {
        firstName: 'Alex',
        lastName: 'Thompson',
        email: 'alex.thompson@example.com',
        password: 'password123',
        role: 'student',
        membershipStatus: 'pending',
        year: '1st-year',
        major: 'Computer Engineering',
        isActive: true,
        isEmailVerified: true,
        bio: 'Interested in joining the club to learn mobile development',
        skills: ['Java', 'C++'],
        interests: ['Mobile Development', 'Game Development'],
        projectsCompleted: 0,
        eventsAttended: 2,
        workshopsAttended: 1
    }
];

const sampleAnnouncements = [
    {
        title: 'Welcome to the New Academic Year!',
        content: 'We\'re excited to kick off another year of innovation and learning. Join us for our orientation session this Friday at 6 PM in Tech Building Room 204. We\'ll be introducing new members to our departments and upcoming events.',
        excerpt: 'Join us for orientation this Friday at 6 PM for an exciting year ahead!',
        category: 'general',
        priority: 'high',
        status: 'published',
        visibility: 'public',
        isFeatured: true,
        tags: ['orientation', 'new-year', 'welcome'],
        publishDate: new Date(),
        views: 150
    },
    {
        title: 'Hackathon Registration Now Open',
        content: 'Register for our annual hackathon happening October 22-23. Theme: "AI for Social Good". Prizes worth $5000! Teams of 2-4 members. Registration deadline: October 15th.',
        excerpt: 'Annual hackathon with AI for Social Good theme. Register by Oct 15th!',
        category: 'event',
        priority: 'urgent',
        status: 'published',
        visibility: 'public',
        isFeatured: true,
        isPinned: true,
        tags: ['hackathon', 'competition', 'ai', 'prizes'],
        publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        views: 300
    },
    {
        title: 'New Workshop Series: Web Development Fundamentals',
        content: 'Starting September 20th, join our 6-week workshop series covering HTML, CSS, JavaScript, and modern frameworks. Perfect for beginners and those looking to strengthen their foundation.',
        excerpt: '6-week web development workshop series starting Sept 20th.',
        category: 'academic',
        priority: 'normal',
        status: 'published',
        visibility: 'public',
        tags: ['workshop', 'web-development', 'beginner'],
        publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        views: 120
    }
];

// Seeding functions
const seedDepartments = async () => {
    console.log('🌱 Seeding departments...');
    
    // Clear existing departments
    await Department.deleteMany({});
    
    // Insert sample departments
    const departments = await Department.insertMany(sampleDepartments);
    console.log(`✅ Created ${departments.length} departments`);
    
    return departments;
};

const seedUsers = async (departments) => {
    console.log('🌱 Seeding users...');
    
    // Clear existing users
    await User.deleteMany({});
    
    // Assign departments to users (except admin)
    const usersWithDepartments = sampleUsers.map((user, index) => {
        if (user.role !== 'admin' && departments.length > 0) {
            // Assign departments based on user interests/skills
            if (user.skills.includes('React') || user.skills.includes('JavaScript')) {
                user.department = departments.find(d => d.name === 'Web Development')?._id;
            } else if (user.skills.includes('Python') && user.skills.includes('Machine Learning')) {
                user.department = departments.find(d => d.name === 'Artificial Intelligence & Machine Learning')?._id;
            } else if (user.interests?.includes('Cybersecurity')) {
                user.department = departments.find(d => d.name === 'Cybersecurity')?._id;
            } else if (user.interests?.includes('Mobile Development')) {
                user.department = departments.find(d => d.name === 'Mobile Development')?._id;
            } else {
                // Assign random department
                user.department = departments[index % departments.length]._id;
            }
        }
        return user;
    });
    
    const users = await User.insertMany(usersWithDepartments);
    console.log(`✅ Created ${users.length} users`);
    
    return users;
};

const seedAnnouncements = async (users) => {
    console.log('🌱 Seeding announcements...');
    
    // Clear existing announcements
    await Announcement.deleteMany({});
    
    // Assign authors to announcements
    const admin = users.find(u => u.role === 'admin');
    const president = users.find(u => u.role === 'president');
    
    const announcementsWithAuthors = sampleAnnouncements.map((announcement, index) => {
        announcement.author = index === 0 ? president?._id : admin?._id;
        return announcement;
    });
    
    const announcements = await Announcement.insertMany(announcementsWithAuthors);
    console.log(`✅ Created ${announcements.length} announcements`);
    
    return announcements;
};

const seedEvents = async (users, departments) => {
    console.log('🌱 Seeding sample events...');
    
    // Clear existing events
    await Event.deleteMany({});
    
    const sampleEvents = [
        {
            title: 'Web Development Workshop',
            description: 'Learn the basics of modern web development with HTML5, CSS3, and JavaScript ES6+. Perfect for beginners looking to start their web development journey.',
            shortDescription: 'Modern web development basics workshop',
            category: 'workshop',
            type: 'offline',
            difficulty: 'beginner',
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
            venue: {
                name: 'Tech Building Room 204',
                address: 'NU Campus',
                room: '204',
                capacity: 30
            },
            organizer: users.find(u => u.role === 'department-head')?._id,
            department: departments.find(d => d.name === 'Web Development')?._id,
            maxAttendees: 25,
            currentAttendees: 18,
            status: 'published',
            visibility: 'public',
            tags: ['web-development', 'html', 'css', 'javascript'],
            skillsLearned: ['HTML5', 'CSS3', 'JavaScript ES6'],
            prerequisites: ['Basic computer skills'],
            isFeatured: true
        },
        {
            title: 'AI in Healthcare Seminar',
            description: 'Industry expert Dr. Sarah Johnson discusses the revolutionary impact of AI in healthcare, covering recent breakthroughs and future prospects.',
            shortDescription: 'AI healthcare applications seminar',
            category: 'seminar',
            type: 'offline',
            difficulty: 'intermediate',
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000), // 1.5 hours
            venue: {
                name: 'Main Auditorium',
                address: 'NU Campus',
                capacity: 150
            },
            organizer: users.find(u => u.role === 'vice-president')?._id,
            department: departments.find(d => d.name === 'Artificial Intelligence & Machine Learning')?._id,
            maxAttendees: 100,
            currentAttendees: 75,
            status: 'published',
            visibility: 'public',
            tags: ['ai', 'healthcare', 'seminar', 'industry'],
            skillsLearned: ['AI Applications', 'Healthcare Technology'],
            speakers: [{
                name: 'Dr. Sarah Johnson',
                bio: 'Leading AI researcher with 15+ years in healthcare applications',
                title: 'Chief AI Officer',
                company: 'MedTech Innovations',
                isExternal: true
            }],
            isFeatured: true
        }
    ];
    
    const events = await Event.insertMany(sampleEvents);
    console.log(`✅ Created ${events.length} events`);
    
    return events;
};

// Update department member counts
const updateDepartmentCounts = async (users, departments) => {
    console.log('🔄 Updating department member counts...');
    
    for (const department of departments) {
        const memberCount = users.filter(u => 
            u.department && u.department.toString() === department._id.toString()
        ).length;
        
        await Department.findByIdAndUpdate(department._id, { memberCount });
    }
    
    console.log('✅ Updated department member counts');
};

// Main seeding function
const seedDatabase = async () => {
    try {
        console.log('🚀 Starting database seeding...');
        
        await connectDB();
        
        // Seed in order due to dependencies
        const departments = await seedDepartments();
        const users = await seedUsers(departments);
        const announcements = await seedAnnouncements(users);
        const events = await seedEvents(users, departments);
        
        // Update department member counts
        await updateDepartmentCounts(users, departments);
        
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   👥 Users: ${users.length}`);
        console.log(`   🏢 Departments: ${departments.length}`);
        console.log(`   📢 Announcements: ${announcements.length}`);
        console.log(`   📅 Events: ${events.length}`);
        
        console.log('\n🔐 Admin Credentials:');
        console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@nutechnocrats.club'}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;