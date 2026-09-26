// Read-only onboarding: drafts never bypass the host's write admission.
export function onboarding(actor, now = new Date()) {
  const date = (offset) => {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() + offset);
    return d.toISOString().slice(0, 10);
  };
  const id = `harbor-pilot-${date(0).replaceAll('-', '')}`;
  const project = {
    id, name: 'Harbor pilot — FICTIONAL walkthrough',
    customerAlias: 'SAMPLE-CUSTOMER', sample: true,
    outcome: 'Demonstrate an appointment reminder workflow with fictional data',
    deliveryDate: date(6),
    owners: [{id: 'founder', name: 'Founder'}, {id: 'pilot-lead', name: 'Pilot lead'}],
    milestones: [
      {id: 'data-access', name: 'Test data access', owner: 'pilot-lead', dueDate: date(3)},
      {id: 'workflow', name: 'Reminder workflow ready', owner: 'pilot-lead', dueDate: date(5)},
      {id: 'acceptance', name: 'Founder acceptance review', owner: 'founder', dueDate: date(6)},
    ],
    baseline: {}, cadenceDays: 7, escalationContact: 'founder',
    thresholds: {dueSoonDays: 3, unansweredDays: 2, rollovers: 2, variancePercent: 15},
  };
  return {
    role: 'I collect owner updates, track delivery risks, request recovery plans, and bring decisions to the founder.',
    identity: actor || {verified: false, reason: 'No runtime sender identity'},
    paths: ['Try a fictional example', 'Set up your project'],
    trust: 'One agent shared by a trusted team. Everyone admitted can operate its tools; session visibility is not isolation.',
    sampleDraft: project,
    projectEnvelope: `DELIVERY PROJECT\n${JSON.stringify(project, null, 2)}`,
    join: `DELIVERY JOIN ${id} pilot-lead`,
    update: `DELIVERY UPDATE ${id} data-access\nFICTIONAL SAMPLE. I completed the field mapping. Next step is loading test data. Sandbox access has not arrived, so I cannot validate the pipeline. My target is ${date(4)}. I need founder approval to use synthetic data.`,
    recovery: `DELIVERY RECOVERY ${id} data-access\nFICTIONAL SAMPLE. I will build and validate a synthetic dataset by ${date(3)}. The sandbox access blocker remains open. I need founder approval to use synthetic data for the demonstration.`,
    brief: `Give me the founder brief for ${id}.`,
    correction: {project: id, milestone: 'data-access', field: 'targetDate', value: date(3), reason: 'FICTIONAL SAMPLE: I typed the wrong target date.'},
    rules: ['Nothing is created by this guide; the founder must send the project envelope.', 'Confirm two distinct verified runtime identities before claiming multiplayer.', 'Use the actual project record for enrollment, revisions, and decision IDs. Never assume a draft has been saved.', 'If this sample ID already exists, resume it or have the founder choose a new ID.'],
  };
}
