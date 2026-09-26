import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {participantCard} from '../plugin/src/participant-card.mjs';
import {parseRequest} from '../plugin/src/admission.mjs';
const project={id:'pilot',name:'Fictional pilot',owners:[{id:'founder',name:'Founder',actor:{id:'secret-profile-id-123'}},{id:'lead',name:'Pilot lead',actor:null}],milestones:[{name:'Access',owner:'lead',dueDate:'2026-10-01'}]};
function view(t,p=project,actor={verified:true}){const result=participantCard(p,actor);const sent=[];const dom=new JSDOM(result.widget_code,{runScripts:'dangerously',beforeParse(w){w.sendPrompt=x=>sent.push(x);}});t.after(()=>dom.window.close());return {get:id=>dom.window.document.getElementById(id),sent,result};}
test('participant packet uses actual project role; no send or grant occurs',t=>{
 const {get,sent,result}=view(t);assert.ok(!result.widget_code.includes('secret-profile-id-123'));
 get('url').value='https://gateway.example/chat/delivery-assurance-agent';get('prepare').click();
 assert.equal(get('packet').hidden,false);assert.match(get('instructions').value,/DELIVERY JOIN pilot lead/);assert.match(get('instructions').value,/Access/);assert.match(get('instructions').value,/grants no access/);assert.deepEqual(sent,[]);
 assert.equal(parseRequest('DELIVERY PARTICIPANTS pilot').project,'pilot');
 get('type').value='agent';const Event=get('type').ownerDocument.defaultView.Event;get('type').dispatchEvent(new Event('change'));assert.equal(get('agent').hidden,false);assert.match(get('agent').textContent,/not implemented/);assert.deepEqual(sent,[]);
});
test('bound roles, unverified identity, and missing roles cannot prepare another invitation',t=>{
 for(const [p,a] of [[{...project,owners:project.owners.map(o=>({...o,actor:{id:'private'}}))},{verified:true}],[project,null],[{...project,owners:[project.owners[0]]},{verified:true}]]){const {get}=view(t,p,a);assert.equal(get('prepare').disabled,true);get('prepare').click();assert.equal(get('packet').hidden,true);}
});
test('joining packet rejects credential-bearing addresses and renders hostile labels as text',t=>{
 const {get}=view(t,{...project,name:'<img src=x onerror=alert(1)>'});assert.equal(get('project').querySelector('img'),null);
 for(const url of ['http://gateway.example','https://user:secret@gateway.example','https://gateway.example/?token=secret','https://gateway.example/#secret']){get('url').value=url;get('prepare').click();assert.equal(get('packet').hidden,true);assert.match(get('error').textContent,/without credentials/);}
});
