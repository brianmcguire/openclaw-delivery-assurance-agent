import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {onboarding} from '../plugin/src/onboarding.mjs';
import {Store} from '../plugin/src/store.mjs';
import {prepare, admit, parseRequest} from '../plugin/src/admission.mjs';

test('walkthrough is read-only without identity and does not invent a participant', t => {
  const dir = mkdtempSync(join(tmpdir(), 'delivery-onboard-'));
  const store = new Store(dir);
  t.after(() => {store.close(); rmSync(dir, {recursive:true, force:true});});
  const a = prepare({currentUserMessage:'DELIVERY START'}, {sessionId:'shared'});
  const receipt = admit(store, a, {}, false);
  assert.equal(receipt.onboardingRequested, true);
  assert.equal(receipt.actor, null);
  assert.deepEqual(store.projects(), []);
  assert.equal(onboarding(receipt.actor).identity.verified, false);
  assert.equal(parseRequest('DELIVERY UPDATE project milestone\nDELIVERY START').action, 'UPDATE');
});

test('generated fictional envelope is valid with future dates and distinct-owner enrollment', t => {
  const dir = mkdtempSync(join(tmpdir(), 'delivery-onboard-'));
  const store = new Store(dir);
  t.after(() => {store.close(); rmSync(dir, {recursive:true, force:true});});
  const founder = {id:'human-a',domain:'gateway-profile',verified:true};
  const owner = {id:'human-b',domain:'gateway-profile',verified:true};
  const guide = onboarding(founder, new Date('2026-09-26T23:59:00Z'));
  assert.equal(guide.sampleDraft.milestones[0].dueDate, '2026-09-29');
  assert.equal(guide.sampleDraft.deliveryDate, '2026-10-02');
  assert.deepEqual(guide.sampleDraft.baseline, {});
  const request = parseRequest(guide.projectEnvelope);
  assert.equal(request.payload.sample, true);
  store.create(request.payload, founder, {receipt:'create',sessionKey:'shared'});
  assert.throws(() => store.join(request.payload.id, 'pilot-lead', founder));
  const joined = store.join(request.payload.id, 'pilot-lead', owner);
  assert.equal(joined.actor.id, owner.id);
  assert.equal(parseRequest(guide.update).project, request.payload.id);
  assert.equal(parseRequest(guide.recovery).action, 'RECOVERY');
  assert.equal('expectedRevision' in guide.correction, false);
});
