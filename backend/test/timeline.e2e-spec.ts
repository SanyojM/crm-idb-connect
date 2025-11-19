// test/timeline.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Timeline Module (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  // Variables to store data across steps
  let adminToken: string;
  let adminUserId: string;
  let createdLeadId: string;
  let createdNoteId: string;
  let createdFollowupId: string;

  // Random identifiers to prevent unique constraint violations
  const uniqueSuffix = Date.now();
  const testEmail = `timeline_admin_${uniqueSuffix}@test.com`;
  const leadEmail = `timeline_lead_${uniqueSuffix}@test.com`;
  const leadMobile = `+1${uniqueSuffix}`; 

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true })); // Ensure DTOs work
    await app.init();

    prisma = app.get(PrismaService);

    // 1. SETUP: Create a Test Admin directly in DB
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.partners.create({
      data: {
        name: 'Timeline Test Admin',
        email: testEmail,
        mobile: `+99${uniqueSuffix}`,
        password: hashedPassword,
        role: 'admin',
        address: 'Test St',
        city: 'Test City',
        state: 'Test State',
        area: 'Test Area',
        zone: 'Test Zone',
      },
    });
    adminUserId = admin.id;

    // 2. SETUP: Login to get JWT
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: 'password123' })
      .expect(201);

    adminToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    // CLEANUP: Delete the test data
    if (createdLeadId) {
      await prisma.leads.delete({ where: { id: createdLeadId } }).catch(() => {});
    }
    if (adminUserId) {
      await prisma.partners.delete({ where: { id: adminUserId } }).catch(() => {});
    }
    await app.close();
  });

  it('Step 1: Create Lead -> Should log LEAD_CREATED', async () => {
    const res = await request(app.getHttpServer())
      .post('/leads')
      // Public endpoint, but we use created_by field
      .send({
        name: 'Timeline Test Lead',
        email: leadEmail,
        mobile: leadMobile,
        city: 'Test City',
        type: 'lead',
        purpose: 'Study Abroad',
        status: 'new',
        created_by: adminUserId,
      })
      .expect(201);

    createdLeadId = res.body.id;

    // Verify Timeline
    const timelineRes = await request(app.getHttpServer())
      .get(`/leads/${createdLeadId}/timeline`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(timelineRes.body).toHaveLength(1);
    expect(timelineRes.body[0].eventType).toBe('LEAD_CREATED');
    expect(timelineRes.body[0].newState).toContain('Timeline Test Lead');
  });

  it('Step 2: Add Note -> Should log LEAD_NOTE_ADDED', async () => {
    const res = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        text: 'This is a test note for timeline',
        lead_id: createdLeadId,
      })
      .expect(201);
    
    createdNoteId = res.body.id;

    // Verify Timeline
    const timelineRes = await request(app.getHttpServer())
      .get(`/leads/${createdLeadId}/timeline`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Should be latest event (index 0)
    expect(timelineRes.body[0].eventType).toBe('LEAD_NOTE_ADDED');
    expect(timelineRes.body[0].newState).toBe('This is a test note for timeline');
  });

  it('Step 3: Add Follow-up -> Should log LEAD_FOLLOWUP_ADDED', async () => {
    const res = await request(app.getHttpServer())
      .post('/followups')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Call back tomorrow',
        lead_id: createdLeadId,
        due_date: new Date().toISOString(),
      })
      .expect(201);

    createdFollowupId = res.body.id;

    // Verify Timeline
    const timelineRes = await request(app.getHttpServer())
      .get(`/leads/${createdLeadId}/timeline`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(timelineRes.body[0].eventType).toBe('LEAD_FOLLOWUP_ADDED');
    expect(timelineRes.body[0].newState).toBe('Call back tomorrow');
  });

  it('Step 4: Complete Follow-up -> Should log LEAD_FOLLOWUP_COMPLETED', async () => {
    await request(app.getHttpServer())
      .patch(`/followups/${createdFollowupId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        completed: true,
      })
      .expect(200);

    // Verify Timeline
    const timelineRes = await request(app.getHttpServer())
      .get(`/leads/${createdLeadId}/timeline`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(timelineRes.body[0].eventType).toBe('LEAD_FOLLOWUP_COMPLETED');
    expect(timelineRes.body[0].newState).toBe('Call back tomorrow');
  });

  it('Step 5: Change Lead Status -> Should log LEAD_STATUS_CHANGED', async () => {
    // We'll use the bulk endpoint for this as we implemented logging there
    // OR use PATCH /leads/:id if you added logging there (check your leads.service implementation)
    // Assuming we added it to PATCH based on our previous conversation:
    
    await request(app.getHttpServer())
      .patch(`/leads/${createdLeadId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'hot',
      })
      .expect(200);

    // Verify Timeline
    const timelineRes = await request(app.getHttpServer())
      .get(`/leads/${createdLeadId}/timeline`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(timelineRes.body[0].eventType).toBe('LEAD_STATUS_CHANGED');
    expect(timelineRes.body[0].newState).toBe('hot');
  });
  
  it('Step 6: Verify Full History Order', async () => {
      const timelineRes = await request(app.getHttpServer())
      .get(`/leads/${createdLeadId}/timeline`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
      
      // Expect 5 events in descending order (newest first)
      // 1. Status Changed
      // 2. Followup Completed
      // 3. Followup Added
      // 4. Note Added
      // 5. Lead Created
      
      expect(timelineRes.body).toHaveLength(5);
      expect(timelineRes.body[0].eventType).toBe('LEAD_STATUS_CHANGED');
      expect(timelineRes.body[4].eventType).toBe('LEAD_CREATED');
  });
});