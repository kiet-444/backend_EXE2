
// Unit tests for: register




const User = require('../../models/User');
const { register } = require('../path/to/your/module');
const User = require('../../models/User');
const httpMocks = require('node-mocks-http');
const { register } = require('../Auth.controllers');

jest.mock("../../models/User");

describe('register() register method', () => {
    // Happy Path
    describe('Happy Path', () => {
        it('should register a user successfully when all fields are valid', async () => {
            // Arrange
            const req = httpMocks.createRequest({
                method: 'POST',
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    address: '123 Test St',
                    phoneNumber: '1234567890'
                }
            });
            const res = httpMocks.createResponse();
            User.findOne.mockResolvedValue(null);
            User.prototype.save = jest.fn().mockResolvedValue();

            // Act
            await register(req, res);

            // Assert
            expect(res.statusCode).toBe(201);
            expect(res._getJSONData()).toEqual({ message: 'User registered successfully', error_code: 0 });
        });
    });

    // Edge Cases
    describe('Edge Cases', () => {
        it('should return 400 if any required field is missing', async () => {
            // Arrange
            const req = httpMocks.createRequest({
                method: 'POST',
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    address: '123 Test St'
                    // Missing phoneNumber
                }
            });
            const res = httpMocks.createResponse();

            // Act
            await register(req, res);

            // Assert
            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({ message: 'Missing required fields' });
        });

        it('should return 400 for invalid phone number format', async () => {
            // Arrange
            const req = httpMocks.createRequest({
                method: 'POST',
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    address: '123 Test St',
                    phoneNumber: '12345' // Invalid format
                }
            });
            const res = httpMocks.createResponse();

            // Act
            await register(req, res);

            // Assert
            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({ message: 'Invalid phone number format' });
        });

        it('should return 409 if user already exists', async () => {
            // Arrange
            const req = httpMocks.createRequest({
                method: 'POST',
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    address: '123 Test St',
                    phoneNumber: '1234567890'
                }
            });
            const res = httpMocks.createResponse();
            User.findOne.mockResolvedValue({ email: 'test@example.com' });

            // Act
            await register(req, res);

            // Assert
            expect(res.statusCode).toBe(409);
            expect(res._getJSONData()).toEqual({ message: 'User already exists' });
        });

        it('should return 500 if there is a server error', async () => {
            // Arrange
            const req = httpMocks.createRequest({
                method: 'POST',
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    address: '123 Test St',
                    phoneNumber: '1234567890'
                }
            });
            const res = httpMocks.createResponse();
            User.findOne.mockRejectedValue(new Error('Database error'));

            // Act
            await register(req, res);

            // Assert
            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toEqual({ message: 'Failed to register user', error: expect.anything() });
        });
    });
});

// End of unit tests for: register
