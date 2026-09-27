import {cpSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const release=join(root,'.local/releases');mkdirSync(release,{recursive:true});
// A unique staging directory avoids removing or overwriting a prior artifact.
const stage=join(release,'stage-'+Date.now());mkdirSync(stage);
cpSync(join(root,'plugin'),stage,{recursive:true});
cpSync(join(root,'workspace'),join(stage,'agent-workspace'),{recursive:true});
cpSync(join(root,'LICENSE'),join(stage,'LICENSE'));
cpSync(join(root,'docs/plugin-install.md'),join(stage,'README.md'));
cpSync(join(root,'docs/using-with-openclaw.md'),join(stage,'using-with-openclaw.md'));
const manifest=JSON.parse(readFileSync(join(stage,'openclaw.plugin.json'),'utf8'));
manifest.skills=['./agent-workspace/skills'];writeFileSync(join(stage,'openclaw.plugin.json'),JSON.stringify(manifest,null,2)+'\n');
const pkg=JSON.parse(readFileSync(join(stage,'package.json'),'utf8'));
pkg.files=['src','ui','agent-workspace','openclaw.plugin.json','LICENSE','README.md','using-with-openclaw.md','BUILD.json'];
if(process.env.DELIVERY_PACKAGE_NAME){
  if(!/^@[a-z0-9-]+\/[a-z0-9-]+$/.test(process.env.DELIVERY_PACKAGE_NAME))throw Error('DELIVERY_PACKAGE_NAME must be @owner/package-name');
  pkg.name=process.env.DELIVERY_PACKAGE_NAME;
}
const commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const dirty=!!execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim();
if(process.argv.includes('--release')&&dirty)throw Error('Release packaging requires a clean committed checkout. Commit reviewed changes first.');
pkg.gitHead=commit;
writeFileSync(join(stage,'BUILD.json'),JSON.stringify({repository:'https://github.com/brianmcguire/openclaw-delivery-assurance-agent',commit,dirty,openclawVersion:pkg.openclaw.build.openclawVersion},null,2)+'\n');
pkg.description=manifest.description;
pkg.repository={type:'git',url:'https://github.com/brianmcguire/openclaw-delivery-assurance-agent.git'};
writeFileSync(join(stage,'package.json'),JSON.stringify(pkg,null,2)+'\n');
const packed=JSON.parse(execFileSync('npm',['pack','--json','--ignore-scripts','--cache',join(root,'.local/npm-cache'),'--pack-destination',release],{cwd:stage,encoding:'utf8'}))[0];
const required=['using-with-openclaw.md','src/plugin.mjs','ui/setup-card.html','ui/participant-card.html','agent-workspace/AGENTS.md','agent-workspace/skills/delivery-assurance/SKILL.md','LICENSE'];
for(const file of required)if(!packed.files.some(f=>f.path===file))throw Error('Missing package asset: '+file);
if(packed.files.some(f=>f.path.startsWith('.local/')||/\.sqlite|^\.env|agent-index|^vendor\//.test(f.path)))throw Error('Private state or reporting assets in plugin package');
const info={artifact:join(release,packed.filename),stage,commit,dirty,files:packed.files.length,integrity:packed.integrity};
writeFileSync(join(release,'latest.json'),JSON.stringify(info,null,2)+'\n');
console.log(JSON.stringify(info,null,2));
