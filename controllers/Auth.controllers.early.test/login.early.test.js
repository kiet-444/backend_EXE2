
// Unit tests for: login




const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { login } = require('../path/to/your/module');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { login } = require('../Auth.controllers');

jest.mock("../../models/User");
jest.mock("jsonwebtoken");

describe('login() login method', () => {
    let req, res, mockUser;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        mockUser = {
            _id: 'userId123',
            role: 'user',
            comparePassword: jest.fn()
        };
    });

    describe('Happy Path', () => {
        it('should login successfully and return a JWT token', async () => {
            // Arrange
            User.findOne.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            // Act
            await login(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(mockUser.comparePassword).toHaveBeenCalledWith(req.body.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: mockUser._id, role: mockUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'mockToken' });
        });
    });

    describe('Edge Cases', () => {
        it('should return 401 if user is not found', async () => {
            // Arrange
            User.findOne.mockResolvedValue(null);

            // Act
            await login(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        it('should return 401 if password does not match', async () => {
            // Arrange
            User.findOne.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(false);

            // Act
            await login(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(mockUser.comparePassword).toHaveBeenCalledWith(req.body.password);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        it('should return 500 if there is a server error', async () => {
            // Arrange
            const error = new Error('Server error');
            User.findOne.mockRejectedValue(error);

            // Act
            await login(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Failed to login', error });
        });
    });
});

// End of unit tests for: login
