
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
            body: {}
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
        it('should login successfully with valid email and password', async () => {
            // Arrange
            req.body = { identifier: 'test@example.com', password: 'password123' };
            User.findOne.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            // Act
            await login(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
            expect(jwt.sign).toHaveBeenCalledWith({ id: 'userId123', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'mockToken' });
        });

        it('should login successfully with valid username and password', async () => {
            // Arrange
            req.body = { identifier: 'testuser', password: 'password123' };
            User.findOne.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            // Act
            await login(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
            expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
            expect(jwt.sign).toHaveBeenCalledWith({ id: 'userId123', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'mockToken' });
        });
    });

    describe('Edge Cases', () => {
        it('should return 401 for invalid email', async () => {
            // Arrange
            req.body = { identifier: 'invalid@example.com', password: 'password123' };
            User.findOne.mockResolvedValue(null);

            // Act
            await login(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: 'invalid@example.com' });
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        it('should return 401 for invalid username', async () => {
            // Arrange
            req.body = { identifier: 'invaliduser', password: 'password123' };
            User.findOne.mockResolvedValue(null);

            // Act
            await login(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ username: 'invaliduser' });
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        it('should return 401 for incorrect password', async () => {
            // Arrange
            req.body = { identifier: 'test@example.com', password: 'wrongpassword' };
            User.findOne.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(false);

            // Act
            await login(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(mockUser.comparePassword).toHaveBeenCalledWith('wrongpassword');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        it('should handle server errors gracefully', async () => {
            // Arrange
            req.body = { identifier: 'test@example.com', password: 'password123' };
            User.findOne.mockRejectedValue(new Error('Database error'));

            // Act
            await login(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Failed to login', error: expect.any(Error) });
        });
    });
});

// End of unit tests for: login
