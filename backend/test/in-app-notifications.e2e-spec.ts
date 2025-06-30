import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { InAppNotificationType } from '../src/in-app-notifications/entities/in-app-notification.entity';
import { JwtService } from '@nestjs/jwt';

describe('InAppNotificationsController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();

    // Create a test user and get auth token
    const testUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };
    authToken = jwtService.sign({ sub: testUser.id, username: testUser.username });
    userId = testUser.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /in-app-notifications', () => {
    it('should return user notifications', () => {
      return request(app.getHttpServer())
        .get('/in-app-notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    it('should filter notifications by type', () => {
      return request(app.getHttpServer())
        .get('/in-app-notifications')
        .query({ type: InAppNotificationType.GENERAL })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          if (res.body.length > 0) {
            expect(res.body[0].type).toBe(InAppNotificationType.GENERAL);
          }
        });
    });
  });

  describe('GET /in-app-notifications/unread-count', () => {
    it('should return unread notifications count', () => {
      return request(app.getHttpServer())
        .get('/in-app-notifications/unread-count')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(typeof res.body).toBe('number');
          expect(res.body).toBeGreaterThanOrEqual(0);
        });
    });
  });

  describe('POST /in-app-notifications', () => {
    it('should create a new notification', () => {
      const notificationData = {
        userId,
        title: 'Test Notification',
        message: 'This is a test notification',
        type: InAppNotificationType.GENERAL,
      };

      return request(app.getHttpServer())
        .post('/in-app-notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send(notificationData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(notificationData.title);
          expect(res.body.message).toBe(notificationData.message);
          expect(res.body.type).toBe(notificationData.type);
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/in-app-notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('POST /in-app-notifications/system', () => {
    it('should create a system-wide notification', () => {
      const systemNotification = {
        title: 'System Update',
        message: 'System maintenance scheduled',
        type: InAppNotificationType.SYSTEM,
      };

      return request(app.getHttpServer())
        .post('/in-app-notifications/system')
        .set('Authorization', `Bearer ${authToken}`)
        .send(systemNotification)
        .expect(201)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].type).toBe(InAppNotificationType.SYSTEM);
        });
    });
  });

  describe('PATCH /in-app-notifications/read', () => {
    it('should mark notifications as read', () => {
      const markAsReadData = {
        notificationIds: [1, 2],
      };

      return request(app.getHttpServer())
        .patch('/in-app-notifications/read')
        .set('Authorization', `Bearer ${authToken}`)
        .send(markAsReadData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('readAt');
        });
    });
  });

  describe('PATCH /in-app-notifications/read-all', () => {
    it('should mark all notifications as read', () => {
      return request(app.getHttpServer())
        .patch('/in-app-notifications/read-all')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('readAt');
        });
    });
  });

  describe('PATCH /in-app-notifications/archive', () => {
    it('should archive notifications', () => {
      const archiveData = {
        notificationIds: [1, 2],
      };

      return request(app.getHttpServer())
        .patch('/in-app-notifications/archive')
        .set('Authorization', `Bearer ${authToken}`)
        .send(archiveData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('archivedAt');
        });
    });
  });

  describe('DELETE /in-app-notifications/:id', () => {
    it('should delete a notification', () => {
      return request(app.getHttpServer())
        .delete('/in-app-notifications/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 1);
        });
    });

    it('should return 404 for non-existent notification', () => {
      return request(app.getHttpServer())
        .delete('/in-app-notifications/999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});