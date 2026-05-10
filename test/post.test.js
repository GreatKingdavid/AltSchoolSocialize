require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 
const User = require('../models/User');
const Post = require('../models/Post');

let token;
let userId;
let postId;

beforeAll(async () => {
    // 1. Ensure Database Connection
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.DATABASE_URL || process.env.MONGO_URI);
    }

    await User.deleteMany({});
    await Post.deleteMany({});

    // 2. Signup
    await request(app)
        .post('/api/v1/auth/signup')
        .send({
            first_name: "Test",
            last_name: "User",
            username: "tester",
            email: "test@exam.com",
            password: "Password123!"
        });

    // 3. Login
    const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: "test@exam.com", password: "Password123!" });
    
    // Extraction Logic (Fixed Syntax)
    token = loginRes.body.token || (loginRes.body.data && loginRes.body.data.token);
    
    // Use the data wrapper if your API uses it
    const userPayload = loginRes.body.user  (loginRes.body.data && loginRes.body.data.user) || loginRes.body.data;
    userId = userPayload ? (userPayload._id || userPayload.id) : null;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Social Media API Exam Suite', () => {

    it('should create a new post as a draft', async () => {
        const res = await request(app)
            .post('/api/v1/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "My Exam Post",
                content: "Content for the social media app",
                tags: ["nodejs", "exam"]
            });

        expect(res.statusCode).toEqual(201);
        const postData = res.body.data || res.body;
        postId = postData._id || postData.id;
    });

    it('should allow owner to publish their post', async () => {
        const res = await request(app)
            .patch(`/api/v1/posts/${postId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ state: 'published' });

        expect(res.statusCode).toEqual(200);
    });

    it('should handle post liking', async () => {
        const res = await request(app)
            .post(`/api/v1/posts/${postId}/like`)
            .set('Authorization', `Bearer ${token}`);

        expect([200, 201]).toContain(res.statusCode);
    });

    it('should not allow self-following', async () => {
        // Double check your route name: is it /users/ or /auth/ or /api/v1/users?
        const res = await request(app)
            .post(`/api/v1/users/follow/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect([400, 403]).toContain(res.statusCode); 
    });

    it('should return published posts with pagination', async () => {
        const res = await request(app).get('/api/v1/posts?state=published&page=1');
        expect(res.statusCode).toEqual(200);
        
        const data = res.body.posts || res.body.data || res.body;
        expect(Array.isArray(data) || Array.isArray(data.posts)).toBe(true);
    });
});it('should return published posts with pagination', async () => {
    const res = await request(app).get('/api/v1/posts?state=published&page=1');
    expect(res.statusCode).toEqual(200);
    
    // Fixed: Added the || operators back in
    const data = res.body.posts || res.body.data || res.body;
    
    // Fixed: Added || between the Array checks
    const isDataArray = Array.isArray(data) || (data && Array.isArray(data.posts));
    expect(isDataArray).toBe(true);
});