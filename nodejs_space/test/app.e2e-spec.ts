import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Game API (e2e)', () => {
  let app: INestApplication<App>;
  let token = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    const res = await request(app.getHttpServer())
      .post('/api/signup')
      .send({ email: `e2e${Date.now()}@test.com`, password: 'secret123', name: 'E2E', playerName: 'E2E' })
      .expect(201);
    token = res.body.token;
  });

  it('returns full game state', async () => {
    const res = await request(app.getHttpServer()).get('/api/game/state').set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body.gameState.cash).toBe(50);
    expect(res.body.gameState.energy).toBe(100);
    expect(res.body.achievements.length).toBeGreaterThanOrEqual(16);
  });

  it('hustles and buys a business', async () => {
    const h = await request(app.getHttpServer()).post('/api/game/hustle').set('Authorization', `Bearer ${token}`).send({ hustleType: 'wash_cars' }).expect(200);
    expect(h.body.state.gameState.energy).toBeLessThan(100);
    const b = await request(app.getHttpServer()).post('/api/game/business/buy').set('Authorization', `Bearer ${token}`).send({ businessType: 'lemonade_stand' }).expect(200);
    expect(b.body.state.businesses.length).toBe(1);
  });

  it('claims daily reward once', async () => {
    await request(app.getHttpServer()).post('/api/game/daily/claim').set('Authorization', `Bearer ${token}`).expect(200);
    await request(app.getHttpServer()).post('/api/game/daily/claim').set('Authorization', `Bearer ${token}`).expect(400);
  });

  it('serves leaderboards', async () => {
    const res = await request(app.getHttpServer()).get('/api/leaderboard/networth').set('Authorization', `Bearer ${token}`).expect(200);
    expect(Array.isArray(res.body.entries)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
