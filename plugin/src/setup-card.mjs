import {readFileSync} from 'node:fs';
import {onboarding} from './onboarding.mjs';
export function setupCard(actor, mode = 'fictional', now = new Date()) {
  if (!['fictional','real'].includes(mode)) throw Error('Choose fictional or real');
  const guide = onboarding(actor, now);
  const seed = {mode, verified: actor?.verified === true, project: guide.sampleDraft};
  const safe = JSON.stringify(seed).replaceAll('<','\\u003c').replaceAll('>','\\u003e').replaceAll('&','\\u0026');
  return {
    title: 'Set up your delivery project',
    widget_code: readFileSync(new URL('../ui/setup-card.html', import.meta.url), 'utf8').replace('__DELIVERY_SEED__',safe),
    instructions: 'Render this exact widget_code with show_widget, pin:false. It reviews and submits a DELIVERY PROJECT message through the current user connection. No project has been saved. Native apps without the prompt bridge use the reviewed copy-and-paste envelope. Do not claim success until delivery_record confirms creation.',
  };
}
