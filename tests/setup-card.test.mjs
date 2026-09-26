import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM, VirtualConsole} from 'jsdom';
import {setupCard} from '../plugin/src/setup-card.mjs';
import {parseRequest} from '../plugin/src/admission.mjs';
const at=new Date('2026-09-26T12:00:00Z');
const actor={id:'human-founder',domain:'gateway-profile',verified:true};
function view(t, identity=actor, mode='fictional', bridge=true){
 const sent=[],errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(setupCard(identity,mode,at).widget_code,{runScripts:'dangerously',virtualConsole:vc,beforeParse(w){if(bridge)w.sendPrompt=s=>sent.push(s);}});
 t.after(()=>dom.window.close());assert.deepEqual(errors,[]);
 const get=id=>dom.window.document.getElementById(id);return {get,sent,dom};
}
test('card collects choices, reviews without saving, then submits one explicit valid project',t=>{
 const {get,sent}=view(t);get('next').click();get('next').click();
 get('baseline').value='effort';get('baseline').dispatchEvent(EventFor(get('baseline')));
 get('amount').value='40';get('next').click();assert.match(get('progress').textContent,/Review/);assert.equal(sent.length,0);
 get('create').click();get('create').click();assert.equal(sent.length,1);
 const request=parseRequest(sent[0]);assert.equal(request.action,'PROJECT');assert.equal(request.payload.sample,true);
 assert.equal(request.payload.milestones.length,3);assert.equal(request.payload.baseline.effortHours,40);
 assert.equal(request.payload.owners[1].id,'pilot-lead');assert.ok(sent[0].length<=4000);
 assert.match(get('sent').textContent,/cannot verify/);
});
function EventFor(element){return new element.ownerDocument.defaultView.Event('change');}
test('unverified card and native bridge fallback never claim a saved project',t=>{
 const {get,sent}=view(t,null,'fictional',false);get('next').click();get('next').click();get('next').click();
 assert.equal(get('create').hidden,true);assert.equal(get('create').disabled,true);
 assert.match(get('identityNotice').textContent,/unverified/);assert.match(get('envelope').value,/^DELIVERY PROJECT/);
 assert.deepEqual(sent,[]);
});
test('real mode requires information; solo mode creates one owner; budget has explicit currency',t=>{
 const {get}=view(t,actor,'real');get('next').click();assert.match(get('progress').textContent,/Project/);
 get('mode').value='fictional';get('mode').dispatchEvent(EventFor(get('mode')));
 get('team').value='solo';get('team').dispatchEvent(EventFor(get('team')));
 get('projectName').value='<script>do not execute</script>';get('next').click();get('next').click();
 get('baseline').value='budget';get('baseline').dispatchEvent(EventFor(get('baseline')));get('amount').value='1000';
 get('next').click();assert.match(get('progress').textContent,/rules/);
 get('currency').value='USD';get('next').click();
 const p=parseRequest(get('envelope').value).payload;
 assert.equal(p.owners.length,1);assert.ok(p.milestones.every(m=>m.owner==='founder'));assert.equal(p.baseline.currency,'USD');
 assert.match(get('summary').textContent,/<script>/);assert.equal(get('summary').querySelector('script'),null);
});
