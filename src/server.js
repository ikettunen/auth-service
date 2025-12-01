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
// Using existing staff IDs from staff-service Oracle database
const mockUsers = [
    // Doctors (Lääkäri)
    {
        id: 'user_1003',
        email: 'jukka.makinen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'doctor',
        staffId: '1003',
        firstName: 'Jukka',
        lastName: 'Mäkinen'
    },
    {
        id: 'user_1009',
        email: 'timo.lehtonen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'doctor',
        staffId: '1009',
        firstName: 'Timo',
        lastName: 'Lehtonen'
    },
    
    // Nurses (Sairaanhoitaja)
    {
        id: 'user_1001',
        email: 'anna.virtanen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'nurse',
        staffId: '1001',
        firstName: 'Anna',
        lastName: 'Virtanen'
    },
    {
        id: 'user_1006',
        email: 'sari.koskinen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'nurse',
        staffId: '1006',
        firstName: 'Sari',
        lastName: 'Koskinen'
    },
    {
        id: 'user_1013',
        email: 'eero.laaksonen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'nurse',
        staffId: '1013',
        firstName: 'Eero',
        lastName: 'Laaksonen'
    },
    
    // Head Nurse (Osastonhoitaja)
    {
        id: 'user_1004',
        email: 'maria.nieminen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'head_nurse',
        staffId: '1004',
        firstName: 'Maria',
        lastName: 'Nieminen'
    },
    
    // Care Assistants (Lähihoitaja)
    {
        id: 'user_1002',
        email: 'liisa.korhonen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'care_assistant',
        staffId: '1002',
        firstName: 'Liisa',
        lastName: 'Korhonen'
    },
    {
        id: 'user_1007',
        email: 'mikko.heikkinen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'care_assistant',
        staffId: '1007',
        firstName: 'Mikko',
        lastName: 'Heikkinen'
    },
    {
        id: 'user_1014',
        email: 'pirjo.makela@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'care_assistant',
        staffId: '1014',
        firstName: 'Pirjo',
        lastName: 'Mäkelä'
    },
    
    // Physiotherapist (Fysioterapeutti)
    {
        id: 'user_1005',
        email: 'pekka.laine@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'physiotherapist',
        staffId: '1005',
        firstName: 'Pekka',
        lastName: 'Laine'
    },
    
    // Psychologist (Psykologi)
    {
        id: 'user_1008',
        email: 'kaisa.jarvinen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'psychologist',
        staffId: '1008',
        firstName: 'Kaisa',
        lastName: 'Järvinen'
    },
    
    // Social Worker (Sosiaalityöntekijä)
    {
        id: 'user_1010',
        email: 'hanna.salo@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'social_worker',
        staffId: '1010',
        firstName: 'Hanna',
        lastName: 'Salo'
    },
    
    // Pharmacist (Proviisoori)
    {
        id: 'user_1011',
        email: 'juha.rantanen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'pharmacist',
        staffId: '1011',
        firstName: 'Juha',
        lastName: 'Rantanen'
    },
    
    // Radiographer (Röntgenhoitaja)
    {
        id: 'user_1012',
        email: 'maija.tuominen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'radiographer',
        staffId: '1012',
        firstName: 'Maija',
        lastName: 'Tuominen'
    },
    
    // Additional Nurses for 24/7 coverage
    {
        id: 'user_1015',
        email: 'laura.virtamo@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'nurse',
        staffId: '1015',
        firstName: 'Laura',
        lastName: 'Virtamo'
    },
    {
        id: 'user_1016',
        email: 'mika.saarinen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'nurse',
        staffId: '1016',
        firstName: 'Mika',
        lastName: 'Saarinen'
    },
    {
        id: 'user_1017',
        email: 'tiina.aho@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'nurse',
        staffId: '1017',
        firstName: 'Tiina',
        lastName: 'Aho'
    },
    
    // Janitor
    {
        id: 'user_1018',
        email: 'kari.maenpaa@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'janitor',
        staffId: '1018',
        firstName: 'Kari',
        lastName: 'Mäenpää'
    },
    
    // Cook/Cleaner
    {
        id: 'user_1019',
        email: 'tuula.virtanen@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'cook_cleaner',
        staffId: '1019',
        firstName: 'Tuula',
        lastName: 'Virtanen'
    },
    
    // Admin (for testing)
    {
        id: 'user_admin',
        email: 'admin@hoitokoti.fi',
        password: '$2b$10$example_hash_here',
        role: 'admin',
        staffId: 'ADMIN001',
        firstName: 'Admin',
        lastName: 'User'
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
        console.log('\n=== Available Users (Password: nursing123) ===\n');
        
        console.log('Doctors:');
        console.log('  - jukka.makinen@hoitokoti.fi (ID: 1003)');
        console.log('  - timo.lehtonen@hoitokoti.fi (ID: 1009)');
        
        console.log('\nNurses:');
        console.log('  - anna.virtanen@hoitokoti.fi (ID: 1001)');
        console.log('  - sari.koskinen@hoitokoti.fi (ID: 1006)');
        console.log('  - eero.laaksonen@hoitokoti.fi (ID: 1013)');
        console.log('  - maria.nieminen@hoitokoti.fi (ID: 1004) - Head Nurse');
        
        console.log('\nCare Assistants:');
        console.log('  - liisa.korhonen@hoitokoti.fi (ID: 1002)');
        console.log('  - mikko.heikkinen@hoitokoti.fi (ID: 1007)');
        console.log('  - pirjo.makela@hoitokoti.fi (ID: 1014)');
        
        console.log('\nAdditional Nurses (24/7 Coverage):');
        console.log('  - laura.virtamo@hoitokoti.fi (ID: 1015)');
        console.log('  - mika.saarinen@hoitokoti.fi (ID: 1016)');
        console.log('  - tiina.aho@hoitokoti.fi (ID: 1017)');
        
        console.log('\nOther Staff:');
        console.log('  - pekka.laine@hoitokoti.fi (ID: 1005) - Physiotherapist');
        console.log('  - kaisa.jarvinen@hoitokoti.fi (ID: 1008) - Psychologist');
        console.log('  - hanna.salo@hoitokoti.fi (ID: 1010) - Social Worker');
        console.log('  - juha.rantanen@hoitokoti.fi (ID: 1011) - Pharmacist');
        console.log('  - maija.tuominen@hoitokoti.fi (ID: 1012) - Radiographer');
        console.log('  - kari.maenpaa@hoitokoti.fi (ID: 1018) - Janitor');
        console.log('  - tuula.virtanen@hoitokoti.fi (ID: 1019) - Cook/Cleaner');
        
        console.log('\nAdmin:');
        console.log('  - admin@hoitokoti.fi (ADMIN001)');
        
        console.log('\n===========================================\n');
    });
}

module.exports = app;