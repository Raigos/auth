import request from 'supertest';
import app from './server';
import { MongoClient } from 'mongodb';
import * as mongodb from 'mongodb';

jest.mock('mongodb');

describe('Server', () => {
  let mockConnect: jest.Mock;
  let mockDb: jest.Mock;
  let mockCollection: jest.Mock;
  let mockCountDocuments: jest.Mock;

  beforeAll(() => {
    mockConnect = jest.fn().mockResolvedValue(undefined);
    mockCountDocuments = jest.fn().mockResolvedValue(0);
    mockCollection = jest.fn().mockReturnValue({ countDocuments: mockCountDocuments });
    mockDb = jest.fn().mockReturnValue({
      collection: mockCollection,
      command: jest.fn().mockResolvedValue({ ok: 1 }), // Mock the command method
    });

    (mongodb.MongoClient as jest.MockedClass<typeof MongoClient>).mockImplementation(
      () =>
        ({
          connect: mockConnect,
          db: mockDb,
          close: jest.fn(),
        }) as unknown as MongoClient
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should respond to GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, TypeScript with MongoDB!');
  });

  it('should handle MongoDB connection in /test-mongo', async () => {
    const response = await request(app).get('/test-mongo');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Connected to MongoDB. Document count: 0');
  });

  it('should handle errors correctly', async () => {
    // Temporarily mock db to throw an error
    mockDb.mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const response = await request(app).get('/test-mongo');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Test error');

    // Reset the mock for subsequent tests
    mockDb.mockReturnValue({
      collection: mockCollection,
      command: jest.fn().mockResolvedValue({ ok: 1 }),
    });
  });
});
