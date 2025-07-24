import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PuzzleCategoryController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /puzzle-categories/puzzles-by-category', () => {
    it('should return puzzles grouped by categories', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/puzzles-by-category')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          // Each category should have the required properties
          if (res.body.length > 0) {
            const category = res.body[0];
            expect(category).toHaveProperty('id');
            expect(category).toHaveProperty('name');
            expect(category).toHaveProperty('description');
            expect(category).toHaveProperty('slug');
            expect(category).toHaveProperty('icon');
            expect(category).toHaveProperty('color');
            expect(category).toHaveProperty('sortOrder');
            expect(category).toHaveProperty('puzzles');
            expect(category).toHaveProperty('puzzleCount');
            expect(Array.isArray(category.puzzles)).toBeTruthy();
            expect(typeof category.puzzleCount).toBe('number');
          }
        });
    });
  });

  describe('GET /puzzle-categories/categories', () => {
    it('should return all categories', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/categories')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          if (res.body.length > 0) {
            const category = res.body[0];
            expect(category).toHaveProperty('id');
            expect(category).toHaveProperty('name');
            expect(category).toHaveProperty('description');
            expect(category).toHaveProperty('slug');
            expect(category).toHaveProperty('icon');
            expect(category).toHaveProperty('color');
            expect(category).toHaveProperty('isActive');
            expect(category).toHaveProperty('sortOrder');
          }
        });
    });
  });

  describe('POST /puzzle-categories/seed-categories', () => {
    it('should seed initial categories', () => {
      return request(app.getHttpServer())
        .post('/puzzle-categories/seed-categories')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('Initial categories seeded successfully');
        });
    });
  });

  describe('POST /puzzle-categories/categories', () => {
    it('should create a new category', () => {
      const categoryData = {
        name: 'Test Category',
        description: 'A test category for e2e testing',
        slug: 'test-category',
        icon: '🧪',
        color: '#FF6B6B',
        sortOrder: 10,
      };

      return request(app.getHttpServer())
        .post('/puzzle-categories/categories')
        .send(categoryData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(categoryData.name);
          expect(res.body.description).toBe(categoryData.description);
          expect(res.body.slug).toBe(categoryData.slug);
          expect(res.body.icon).toBe(categoryData.icon);
          expect(res.body.color).toBe(categoryData.color);
          expect(res.body.sortOrder).toBe(categoryData.sortOrder);
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/puzzle-categories/categories')
        .send({})
        .expect(400);
    });
  });

  describe('GET /puzzle-categories/categories/:id', () => {
    it('should return category by ID', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/categories/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 1);
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('puzzles');
          expect(Array.isArray(res.body.puzzles)).toBeTruthy();
        });
    });

    it('should return 404 for non-existent category', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/categories/999')
        .expect(404);
    });
  });

  describe('GET /puzzle-categories/categories/slug/:slug', () => {
    it('should return category by slug', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/categories/slug/blockchain-basics')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('slug', 'blockchain-basics');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('description');
        });
    });

    it('should return 404 for non-existent slug', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/categories/slug/non-existent')
        .expect(404);
    });
  });

  describe('POST /puzzle-categories/puzzles', () => {
    it('should create a new puzzle', () => {
      const puzzleData = {
        title: 'Test Puzzle',
        description: 'A test puzzle for e2e testing',
        difficulty: 'BEGINNER',
        points: 15,
        estimatedTime: 20,
        categoryIds: [1],
      };

      return request(app.getHttpServer())
        .post('/puzzle-categories/puzzles')
        .send(puzzleData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(puzzleData.title);
          expect(res.body.description).toBe(puzzleData.description);
          expect(res.body.difficulty).toBe(puzzleData.difficulty);
          expect(res.body.points).toBe(puzzleData.points);
          expect(res.body.estimatedTime).toBe(puzzleData.estimatedTime);
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/puzzle-categories/puzzles')
        .send({})
        .expect(400);
    });

    it('should validate difficulty enum', () => {
      const puzzleData = {
        title: 'Test Puzzle',
        description: 'A test puzzle',
        difficulty: 'INVALID_DIFFICULTY',
      };

      return request(app.getHttpServer())
        .post('/puzzle-categories/puzzles')
        .send(puzzleData)
        .expect(400);
    });
  });

  describe('GET /puzzle-categories/puzzles', () => {
    it('should return all puzzles', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/puzzles')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          if (res.body.length > 0) {
            const puzzle = res.body[0];
            expect(puzzle).toHaveProperty('id');
            expect(puzzle).toHaveProperty('title');
            expect(puzzle).toHaveProperty('description');
            expect(puzzle).toHaveProperty('difficulty');
            expect(puzzle).toHaveProperty('points');
            expect(puzzle).toHaveProperty('isActive');
            expect(puzzle).toHaveProperty('estimatedTime');
          }
        });
    });
  });

  describe('GET /puzzle-categories/puzzles/:id', () => {
    it('should return puzzle by ID', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/puzzles/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 1);
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('categories');
          expect(Array.isArray(res.body.categories)).toBeTruthy();
        });
    });

    it('should return 404 for non-existent puzzle', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/puzzles/999')
        .expect(404);
    });
  });

  describe('GET /puzzle-categories/categories/:id/puzzles', () => {
    it('should return puzzles by category ID', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/categories/1/puzzles')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          if (res.body.length > 0) {
            const puzzle = res.body[0];
            expect(puzzle).toHaveProperty('id');
            expect(puzzle).toHaveProperty('title');
            expect(puzzle).toHaveProperty('description');
            expect(puzzle).toHaveProperty('difficulty');
          }
        });
    });

    it('should return 404 for non-existent category', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/categories/999/puzzles')
        .expect(404);
    });
  });

  describe('GET /puzzle-categories/puzzles/difficulty/:difficulty', () => {
    it('should return puzzles by difficulty', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/puzzles/difficulty/BEGINNER')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          if (res.body.length > 0) {
            res.body.forEach((puzzle) => {
              expect(puzzle.difficulty).toBe('BEGINNER');
            });
          }
        });
    });
  });

  describe('GET /puzzle-categories/puzzles/search', () => {
    it('should search puzzles by query', () => {
      return request(app.getHttpServer())
        .get('/puzzle-categories/puzzles/search')
        .query({ q: 'test' })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });
}); 