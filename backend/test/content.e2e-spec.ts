import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ContentController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/content (GET)', () => {
    it('should return all active content', () => {
      return request(app.getHttpServer())
        .get('/content')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should filter content by topic', () => {
      return request(app.getHttpServer())
        .get('/content?topic=blockchain')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/content/:id (GET)', () => {
    it('should return 404 for non-existent content', () => {
      return request(app.getHttpServer())
        .get('/content/non-existent-id')
        .expect(404);
    });
  });

  describe('/admin/content (POST)', () => {
    it('should create new content', () => {
      const createContentDto = {
        title: 'Test Article',
        body: 'This is a test article body content.',
        topic: 'testing',
      };

      return request(app.getHttpServer())
        .post('/admin/content')
        .send(createContentDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(createContentDto.title);
          expect(res.body.body).toBe(createContentDto.body);
          expect(res.body.topic).toBe(createContentDto.topic);
          expect(res.body.isActive).toBe(true);
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidDto = {
        title: '', // Empty title should fail validation
        body: 'Test body',
        topic: 'test',
      };

      return request(app.getHttpServer())
        .post('/admin/content')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/admin/content (GET)', () => {
    it('should return all content including inactive', () => {
      return request(app.getHttpServer())
        .get('/admin/content')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/admin/content/:id (GET)', () => {
    it('should return 404 for non-existent content', () => {
      return request(app.getHttpServer())
        .get('/admin/content/non-existent-id')
        .expect(404);
    });
  });

  describe('/admin/content/:id (PATCH)', () => {
    let createdContentId: string;

    beforeAll(async () => {
      // Create a test content first
      const createContentDto = {
        title: 'Original Title',
        body: 'Original body content.',
        topic: 'test',
      };

      const response = await request(app.getHttpServer())
        .post('/admin/content')
        .send(createContentDto);

      createdContentId = response.body.id;
    });

    it('should update content', () => {
      const updateDto = {
        title: 'Updated Title',
        body: 'Updated body content.',
      };

      return request(app.getHttpServer())
        .patch(`/admin/content/${createdContentId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe(updateDto.title);
          expect(res.body.body).toBe(updateDto.body);
          expect(res.body.topic).toBe('test'); // Should remain unchanged
        });
    });

    it('should return 404 for non-existent content', () => {
      const updateDto = {
        title: 'Updated Title',
      };

      return request(app.getHttpServer())
        .patch('/admin/content/non-existent-id')
        .send(updateDto)
        .expect(404);
    });
  });

  describe('/admin/content/:id (DELETE)', () => {
    let contentToDeleteId: string;

    beforeAll(async () => {
      // Create a test content first
      const createContentDto = {
        title: 'Content to Delete',
        body: 'This content will be deleted.',
        topic: 'test',
      };

      const response = await request(app.getHttpServer())
        .post('/admin/content')
        .send(createContentDto);

      contentToDeleteId = response.body.id;
    });

    it('should delete content', () => {
      return request(app.getHttpServer())
        .delete(`/admin/content/${contentToDeleteId}`)
        .expect(204);
    });

    it('should return 404 for non-existent content', () => {
      return request(app.getHttpServer())
        .delete('/admin/content/non-existent-id')
        .expect(404);
    });
  });

  describe('Content filtering and retrieval flow', () => {
    let testContentId: string;

    beforeAll(async () => {
      // Create test content
      const createContentDto = {
        title: 'Blockchain Basics',
        body: 'Introduction to blockchain technology and its applications.',
        topic: 'blockchain',
      };

      const response = await request(app.getHttpServer())
        .post('/admin/content')
        .send(createContentDto);

      testContentId = response.body.id;
    });

    it('should retrieve content by ID', () => {
      return request(app.getHttpServer())
        .get(`/content/${testContentId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(testContentId);
          expect(res.body.title).toBe('Blockchain Basics');
          expect(res.body.topic).toBe('blockchain');
        });
    });

    it('should filter content by blockchain topic', () => {
      return request(app.getHttpServer())
        .get('/content?topic=blockchain')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          // Should contain our test content
          const blockchainContent = res.body.find(
            (content: any) => content.topic === 'blockchain'
          );
          expect(blockchainContent).toBeDefined();
        });
    });
  });
}); 