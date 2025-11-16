const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Mock users (in a real app, this would be in a database)
const mockUsers = [
    {
        id: 'user_S0001',
        email: 'anna.virtanen@nursinghome.com',
        password: '$2b$10$example_hash_here', // Will be replaced with real hash
        role: 'nurse',
        staffId: 'S0001',
        firstName: 'Anna',
        lastName: 'Virtanen'
    },
    {
        id: 'user_S0098',
        email: 'zachariah.kiehn36@nursinghome.com',
        password: '$2b$10$example_hash_here', // Will be replaced with real hash
        role: 'admin',
        staffId: 'S0098',
        firstName: 'Zachariah',
        lastName: 'Kiehn'
    }
];

// Initialize mock users with proper password hashes
const initializeUsers = async () => {
    const hashedPassword = await bcrypt.hash('nursing123', 10);
    mockUsers.forEach(user => {
        user.password = hashedPassword;
    });
};

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'auth-service' });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Find user
        const user = mockUsers.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                sub: user.id,
                email: user.email,
                role: user.role,
                staffId: user.staffId,
                firstName: user.firstName,
                lastName: user.lastName
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    staffId: user.staffId,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Token validation endpoint
app.post('/api/auth/validate', (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.json({
            success: true,
            data: {
                user: {
                    id: decoded.sub,
                    email: decoded.email,
                    role: decoded.role,
                    staffId: decoded.staffId,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName
                }
            }
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
});

// Logout endpoint (for completeness, though JWT is stateless)
app.post('/api/auth/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Get current user info
app.get('/api/auth/me', (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.json({
            success: true,
            data: {
                id: decoded.sub,
                email: decoded.email,
                role: decoded.role,
                staffId: decoded.staffId,
                firstName: decoded.firstName,
                lastName: decoded.lastName
            }
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Initialize users
initializeUsers().catch(console.error);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3002;
    app.listen(port, () => {
        console.log(`Auth service listening at http://localhost:${port}`);
        console.log('Mock users available:');
        console.log('- anna.virtanen@nursinghome.com (nurse)');
        console.log('- zachariah.kiehn36@nursinghome.com (admin)');
        console.log('- Password for all users: nursing123');
    });
}

module.exports = app;