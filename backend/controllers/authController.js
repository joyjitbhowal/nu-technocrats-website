const crypto = require('crypto');
const User = require('../models/User');
const Department = require('../models/Department');
const sendEmail = require('../services/emailService');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            studentId,
            year,
            major,
            department,
            skills,
            interests,
            phone,
            linkedinUrl,
            githubUrl,
            bio
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email'
            });
        }

        // Check if student ID is already taken (if provided)
        if (studentId) {
            const existingStudentId = await User.findOne({ studentId });
            if (existingStudentId) {
                return res.status(400).json({
                    success: false,
                    error: 'Student ID is already registered'
                });
            }
        }

        // Validate department if provided
        let departmentDoc = null;
        if (department) {
            departmentDoc = await Department.findById(department);
            if (!departmentDoc) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid department selected'
                });
            }
        }

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            studentId,
            year: year || '1st-year',
            major,
            department: departmentDoc ? departmentDoc._id : undefined,
            skills: skills || [],
            interests: interests || [],
            phone,
            linkedinUrl,
            githubUrl,
            bio,
            membershipStatus: 'pending' // Default status for new registrations
        });

        // Generate email verification token
        const verificationToken = user.getEmailVerificationToken();
        await user.save({ validateBeforeSave: false });

        // Send verification email
        try {
            const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
            
            await sendEmail({
                email: user.email,
                subject: 'NU Technocrats Club - Email Verification',
                template: 'emailVerification',
                context: {
                    firstName: user.firstName,
                    verificationUrl,
                    clubName: 'NU Technocrats Club'
                }
            });

            console.log(`✅ Verification email sent to ${user.email}`);
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            // Don't fail registration if email fails
        }

        // Send response (don't send password)
        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                membershipStatus: user.membershipStatus,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Registration failed'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email and password'
            });
        }

        // Check for user (include password for verification)
        const user = await User.findOne({ email }).select('+password').populate('department', 'name color');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account has been deactivated. Please contact admin.'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during login'
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('department', 'name color slug icon')
            .select('-password');

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            bio: req.body.bio,
            skills: req.body.skills,
            interests: req.body.interests,
            linkedinUrl: req.body.linkedinUrl,
            githubUrl: req.body.githubUrl,
            major: req.body.major,
            year: req.body.year
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => 
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        // Handle department change (if allowed)
        if (req.body.department && req.user.membershipStatus === 'pending') {
            const department = await Department.findById(req.body.department);
            if (department) {
                fieldsToUpdate.department = department._id;
            }
        }

        // Handle preferences
        if (req.body.preferences) {
            fieldsToUpdate.preferences = {
                ...req.user.preferences,
                ...req.body.preferences
            };
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        }).populate('department', 'name color slug');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Profile update failed'
        });
    }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Please provide current and new password'
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.matchPassword(currentPassword))) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        sendTokenResponse(user, 200, res, 'Password updated successfully');

    } catch (error) {
        console.error('Update password error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Password update failed'
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No user found with this email'
            });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset url
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'NU Technocrats Club - Password Reset',
                template: 'passwordReset',
                context: {
                    firstName: user.firstName,
                    resetUrl,
                    clubName: 'NU Technocrats Club'
                }
            });

            res.status(200).json({
                success: true,
                message: 'Password reset email sent'
            });

        } catch (error) {
            console.error('Email sending error:', error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                error: 'Email could not be sent'
            });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendTokenResponse(user, 200, res, 'Password reset successful');

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Password reset failed'
        });
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const emailVerificationToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            emailVerificationToken,
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired verification token'
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Private
const resendVerification = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                error: 'Email is already verified'
            });
        }

        const verificationToken = user.getEmailVerificationToken();
        await user.save({ validateBeforeSave: false });

        const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'NU Technocrats Club - Email Verification',
                template: 'emailVerification',
                context: {
                    firstName: user.firstName,
                    verificationUrl,
                    clubName: 'NU Technocrats Club'
                }
            });

            res.status(200).json({
                success: true,
                message: 'Verification email sent'
            });

        } catch (error) {
            console.error('Email sending error:', error);
            res.status(500).json({
                success: false,
                error: 'Email could not be sent'
            });
        }

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, message = null) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message: message || 'Authentication successful',
        token,
        user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            membershipStatus: user.membershipStatus,
            department: user.department,
            isEmailVerified: user.isEmailVerified,
            profilePicture: user.profilePicture,
            lastLogin: user.lastLogin
        }
    });
};

module.exports = {
    register,
    login,
    logout,
    getMe,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification
};