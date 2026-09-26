import {readFileSync} from 'node:fs';
export function participantCard(project, actor) {
  const seed = {
    project: {id: project.id, name: project.name},
    verified: actor?.verified === true,
    owners: project.owners.filter(o => o.id !== 'founder').map(o => ({
      id:o.id, name:o.name, enrolled:!!o.actor,
      milestones: project.milestones.filter(m=>m.owner===o.id).map(m=>({name:m.name,dueDate:m.dueDate})),
    })),
  };
  const safe=JSON.stringify(seed).replaceAll('<','\\u003c').replaceAll('>','\\u003e').replaceAll('&','\\u0026');
  return {
    title:'Add a delivery participant',
    widget_code:readFileSync(new URL('../ui/participant-card.html',import.meta.url),'utf8').replace('__DELIVERY_SEED__',safe),
    instructions:'Render this exact widget_code with show_widget, pin:false. Read-only joining instructions: no invitation is sent, access granted, owner added, or agent connected. The gateway operator admits the human separately. The second person sends WHOAMI and JOIN from their own verified account; then re-read the actual record to confirm enrollment. Agent connections are not implemented.',
  };
}
