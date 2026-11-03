import {VERSION,PLANS,planCode,resolvePlan,digits,localDay,plusDays,availablePeriods,suggestedDates,validate,buildPayload} from './form-cadastro-model.js?v=20261103-v6';

const ENDPOINT='https://virtunex-brisanet-intake.renatojnet.workers.dev/v1/receipts';
const DRAFT_KEY='virtunex-brisanet-cadastro-v3';
const form=document.querySelector('#registration');
const $=id=>document.getElementById(id);
let step=0,busy=false,submissionId=crypto.randomUUID(),pendingDraft=null;
const initial=()=>({plano_codigo:resolvePlan(location.search),quem_preenche:'NAO_INFORMADO',tipo_imovel:'',tem_complemento:false,sem_numero:false});
let data=initial();
const currency=price=>Number(price).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const displayDate=value=>value?value.split('-').reverse().join('/'):'—';
const track=(event,details={})=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...details});};
function message(text){$('form-message').hidden=!text;$('form-message').textContent=text;if(text)$('form-message').focus();}
function read(){
 for(const control of form.elements){if(!control.name||control.disabled)continue;
  if(control.type==='radio'){if(control.checked)data[control.name]=control.value;}
  else if(control.type==='checkbox')data[control.name]=control.checked;
  else data[control.name]=control.value;
 }
 return data;
}
function save(){try{localStorage.setItem(DRAFT_KEY,JSON.stringify({version:3,at:Date.now(),step,submissionId,data:{...data,consent:false}}));}catch{}}
function restoreControls(){for(const control of form.elements){if(!control.name)continue;const value=data[control.name];if(control.type==='radio')control.checked=value===control.value;else if(control.type==='checkbox')control.checked=value===true;else control.value=value??'';}}
function clearDraft(){try{localStorage.removeItem(DRAFT_KEY);localStorage.removeItem('brisanet_form_state');}catch{}}
function findDraft(){
 try{const saved=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null');if(saved?.version===3&&Date.now()-saved.at<86400000&&saved.data)return saved;
  const old=JSON.parse(localStorage.getItem('brisanet_form_state')||'null');if(!old?.titular)return null;
  const t=old.titular,a=old.endereco??{},c=old.cobertura??{};
  return {step:Math.min(Number(old.currentStep)||0,3),submissionId:old.submissionId,data:{nome_completo:[t.nome,t.sobrenome].filter(Boolean).join(' '),cpf:t.cpf,rg:t.rg,data_nascimento:t.dataNascimento,telefone:t.whatsapp,telefone_alternativo:t.telefoneAlternativo,email:t.email,
   looked_up_cep:digits(c.cep),cep:c.cep,logradouro:a.logradouro||c.logradouro,numero:a.numero,bairro:c.bairro,cidade:c.cidade,uf:c.uf,tipo_imovel:a.tipoImovel,complemento:a.complemento,tem_complemento:!!a.complemento,nome_condominio:a.nomeCondominio,
   referencia1:a.referencia1,referencia2:a.referencia2,plano_codigo:planCode(old.plano?.codigo),data1:old.agendamento?.[0]?.data,periodo1:old.agendamento?.[0]?.periodo,data2:old.agendamento?.[1]?.data,periodo2:old.agendamento?.[1]?.periodo,
   quem_preenche:old.biometria?.responsavel==='TITULAR'?'TITULAR':'OUTRO',legacy_complemento:a.tipoImovel!=='CASA'?a.complemento:''}};
 }catch{return null;}
}
function toggleBox(element,visible){element.hidden=!visible;element.querySelectorAll('input,select').forEach(control=>{control.disabled=!visible;});}
function propertyFields(){
 const type=data.tipo_imovel;
 document.querySelectorAll('[data-property]').forEach(box=>toggleBox(box,box.dataset.property===type));
 toggleBox($('condominium-fields'),type==='EDIFICIO'||type==='CONDOMINIO');
 toggleBox($('house-complement'),type==='CASA'&&data.tem_complemento===true);
 $('complemento').required=type==='CASA'&&data.tem_complemento===true;
 $('nome_condominio').required=['EDIFICIO','CONDOMINIO'].includes(type);
 $('apartamento').required=type==='EDIFICIO';$('casa_lote').required=type==='CONDOMINIO';
 $('numero').disabled=data.sem_numero===true;if(data.sem_numero)$('numero').value=data.numero='S/N';
}
function resetProperty(type){
 for(const key of ['complemento','nome_condominio','apartamento','bloco','casa_lote','quadra_alameda'])data[key]='';
 data.tem_complemento=false;data.tipo_imovel=type;
 restoreControls();propertyFields();clearErrors();save();
}
function updatePlan(){
 const plan=PLANS[data.plano_codigo];$('plan-strip').hidden=!plan||step===4;
 $('choose-plan').hidden=!!plan;document.querySelector('[data-step="0"] .actions').hidden=!plan;
 if(plan){$('plan-name').textContent=plan.name;$('plan-price').textContent=currency(plan.price)+'/mês';$('plan-condition').textContent=plan.condition;}
}
function clearErrors(){document.querySelectorAll('.field-error').forEach(e=>e.textContent='');form.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));}
function showErrors(errors){
 clearErrors();for(const [key,text]of Object.entries(errors)){
  const target=$(key+'-error');if(target)target.textContent=text;
  const controls=form.querySelectorAll(`[name="${key}"]`);controls.forEach(c=>c.setAttribute('aria-invalid','true'));
 }
 const first=Object.keys(errors)[0];form.querySelector(`[name="${first}"]`)?.focus();
}
function dates(){
 const suggested=suggestedDates();
 for(const i of [1,2]){
  const input=$('data'+i),select=$('periodo'+i);input.min=localDay();
  if(!data['data'+i])input.value=data['data'+i]=suggested[i-1];
  const allowed=availablePeriods(input.value);
  [...select.options].forEach(option=>{option.disabled=!!option.value&&!allowed.includes(option.value);option.hidden=option.disabled;option.textContent=option.value==='MANHA'?'Manhã · 08h–12h':option.value==='TARDE'?'Tarde · 12h–18h':'Selecione';});
  if(data['periodo'+i]&&!allowed.includes(data['periodo'+i]))select.value=data['periodo'+i]='';
 }
 $('data_nascimento').max=plusDays(localDay(),-1);
}
function go(next,focus=true){
 if(next===4){for(let i=0;i<4;i++){const errors=validate(data,i);if(Object.keys(errors).length){go(i,focus);showErrors(errors);return;}}}
 step=Math.max(0,Math.min(4,next));document.querySelectorAll('[data-step]').forEach(section=>section.hidden=Number(section.dataset.step)!==step);
 document.querySelectorAll('.progress li').forEach((li,index)=>{li.classList.toggle('done',index<step);if(index===step)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});
 $('step-caption').textContent=`Etapa ${step+1} de 5 · ${['CEP','Titular','Endereço','Preferências','Revisão'][step]}`;
 $('postal-summary').textContent=[data.cep,data.cidade&&`${data.cidade}/${data.uf}`].filter(Boolean).join(' · ');
 propertyFields();updatePlan();dates();clearErrors();message('');if(step===4)review();save();if(focus){$('heading-'+step).focus({preventScroll:true});window.scrollTo({top:0,behavior:'auto'});}
}
function review(){
 const payload=buildPayload(read(),submissionId),root=$('review');root.replaceChildren();
 const blocks=[['Titular e contato',1,[`${data.nome_completo} · CPF ${data.cpf}`,`RG ${data.rg||'Não informado'} · Nascimento ${displayDate(data.data_nascimento)}`,`WhatsApp: ${data.telefone} · Adicional: ${data.telefone_alternativo}`,data.email]],
  ['Plano solicitado',0,[`${payload.plano_nome} · ${currency(payload.plano_preco)}/mês`,payload.oferta_condicoes]],
  ['Endereço de instalação',2,[`${data.logradouro}, ${data.numero} · ${data.bairro}`,`${data.cidade}/${data.uf} · CEP ${data.cep}`,payload.complemento,`Referências: ${data.referencia1}; ${data.referencia2}`]],
  ['Preferências de instalação',3,[`${displayDate(data.data1)} · ${data.periodo1==='MANHA'?'Manhã':data.periodo1==='TARDE'?'Tarde':'Selecionar período'}`,`${displayDate(data.data2)} · ${data.periodo2==='MANHA'?'Manhã':data.periodo2==='TARDE'?'Tarde':'Selecionar período'}`,'Datas e períodos dependem de confirmação da operadora.']]];
 for(const [title,target,lines]of blocks){const section=document.createElement('section');section.className='review-block';const heading=document.createElement('div');heading.className='review-heading';const h=document.createElement('h2');h.textContent=title;const edit=document.createElement('button');edit.type='button';edit.textContent='Editar';edit.setAttribute('aria-label','Editar '+title.toLowerCase());edit.addEventListener('click',()=>{if(title==='Plano solicitado')location.href='/#planos';else go(target);});heading.append(h,edit);section.append(heading);for(const line of lines.filter(Boolean)){const p=document.createElement('p');p.textContent=line;section.append(p);}root.append(section);}
}
async function postalLookup(){
 const before=data.looked_up_cep??'',current=digits(data.cep),changed=!!before&&before!==current;
 if(changed){for(const key of ['logradouro','bairro','cidade','uf','numero','nome_condominio','apartamento','bloco','casa_lote','quadra_alameda','complemento','referencia1','referencia2'])data[key]='';data.sem_numero=false;restoreControls();}
 data.looked_up_cep=current;
 try{
  const response=await fetch('https://viacep.com.br/ws/'+digits(data.cep)+'/json/',{signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error();const result=await response.json();if(result.erro)throw Error();
  const city=String(result.localidade??''),uf=String(result.uf??'');if(!city||!uf)throw Error();
  if(!data.logradouro)data.logradouro=String(result.logradouro??'');if(!data.bairro)data.bairro=String(result.bairro??'');if(!data.cidade)data.cidade=city;if(!data.uf)data.uf=uf;
  data.looked_up_cep=digits(data.cep);restoreControls();go(1);if(!data.logradouro||!data.bairro)message('Este CEP não informa todos os dados. Complete rua e bairro na etapa de endereço.');
 }catch{go(1);message('Não foi possível localizar o CEP. Confira e complete o endereço manualmente na próxima etapa.');}
}
function setBusy(value){busy=value;form.querySelectorAll('button').forEach(button=>button.disabled=value);$('send').textContent=value?'Enviando solicitação…':'Enviar solicitação →';}
async function submit(){
 read();for(let index=0;index<4;index++){const errors=validate(data,index);if(Object.keys(errors).length){go(index);showErrors(errors);return;}}
 if(!$('consent').checked){message('Autorize o uso dos dados para enviar o cadastro.');$('consent').focus();return;}
 const payload=buildPayload(data,submissionId);save();setBusy(true);track('form_submit',{plan_code:data.plano_codigo,form_version:VERSION});
 try{
  const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
  const result=await response.json();
  if(!response.ok||result.status!=='received'||!/^VX-S-[0-9a-f-]{36}$/i.test(result.protocol??''))throw Error(result.error==='submission_conflict'?'Uma versão anterior deste cadastro já foi recebida. Fale com a equipe para atualizar os dados.':result.error==='too_many_requests'?'Muitas tentativas. Aguarde alguns minutos e tente novamente.':'Não conseguimos confirmar o recebimento. Confira os campos, tente novamente ou fale com a equipe.');
  clearDraft();form.hidden=true;$('plan-strip').hidden=true;$('success').hidden=false;$('receipt-protocol').textContent=result.protocol;document.querySelectorAll('.progress li').forEach(li=>{li.classList.add('done');li.removeAttribute('aria-current');});$('step-caption').textContent='Cadastro recebido';$('success-title').focus();
  track('form_success',{status:'received',transaction_id:result.protocol,plan_code:data.plano_codigo,form_version:VERSION});
 }catch(error){message(error.name==='TimeoutError'||error.name==='TypeError'?'Não conseguimos confirmar o recebimento. Seu cadastro permanece neste navegador. Tente novamente com os mesmos dados ou fale com a equipe.':error.message);}
 finally{setBusy(false);}
}
form.addEventListener('submit',async event=>{event.preventDefault();if(busy)return;read();if(step===4){await submit();return;}const errors=validate(data,step);if(Object.keys(errors).length){showErrors(errors);return;}
 if(step===0){setBusy(true);await postalLookup();setBusy(false);}else go(step+1);
});
form.addEventListener('input',event=>{
 const control=event.target;if(!control.name||control.type==='radio'||control.type==='checkbox')return;
 if(control.name==='cpf'){const v=digits(control.value).slice(0,11);control.value=v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})\.(\d{3})(\d)/,'$1.$2.$3').replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/,'$1.$2.$3-$4');}
 if(control.name==='cep'){const v=digits(control.value).slice(0,8);control.value=v.length>5?v.slice(0,5)+'-'+v.slice(5):v;}
 if(['telefone','telefone_alternativo'].includes(control.name)){const v=digits(control.value).slice(0,11);control.value=v.length>2?'('+v.slice(0,2)+') '+(v.length>10?v.slice(2,7)+'-'+v.slice(7):v.length>6?v.slice(2,6)+'-'+v.slice(6):v.slice(2)):v;}
 data[control.name]=control.value;const error=$(control.name+'-error');if(error)error.textContent='';control.removeAttribute('aria-invalid');save();
});
form.addEventListener('change',event=>{
 const control=event.target;read();if(control.name==='tipo_imovel'){resetProperty(control.value);return;}
 if(control.name==='plano_codigo'){data.plano_codigo=planCode(control.value);updatePlan();const url=new URL(location.href);url.searchParams.delete('plan');if(data.plano_codigo)url.searchParams.set('plano',data.plano_codigo);else url.searchParams.delete('plano');history.replaceState(null,'',url);}
 if(control.name==='tem_complemento'){if(!control.checked){data.complemento='';$('complemento').value='';}propertyFields();}
 if(control.name==='sem_numero'){if(!control.checked){data.numero='';$('numero').value='';}propertyFields();}
 if(control.name==='data1'||control.name==='data2')dates();save();
});
document.querySelectorAll('[data-back]').forEach(button=>button.addEventListener('click',()=>{read();go(step-1);}));
$('edit-cep').addEventListener('click',()=>{read();go(0);$('cep').focus();});$('change-plan').addEventListener('click',()=>{read();save();});
$('plan-details').addEventListener('click',()=>{
 const plan=PLANS[data.plano_codigo];if(!plan)return;const root=$('details-content');const open=$('plan-details').getAttribute('aria-expanded')!=='true';
 root.replaceChildren();const list=document.createElement('dl');
 for(const [label,value] of [['Velocidade',`Download ${plan.download} Mbps · upload ${plan.upload} Mbps`],['Mensalidade',currency(plan.price)+'/mês'],['Condições',plan.condition]]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;list.append(dt,dd);}
 root.append(list);const hint=document.createElement('p');hint.textContent='Sujeito à análise técnica.';root.append(hint);
 root.hidden=!open;$('plan-details').setAttribute('aria-expanded',String(open));
});
$('privacy-details').addEventListener('click',()=>$('privacy-dialog').showModal());document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
$('another-registration').addEventListener('click',()=>{clearDraft();location.href=location.pathname;});
restoreControls();propertyFields();dates();updatePlan();
if((new URLSearchParams(location.search).has('plano')||new URLSearchParams(location.search).has('plan'))&&!data.plano_codigo)message('O plano deste link não foi reconhecido. Escolha uma oferta nos cards do site.');
track('step_view',{step_number:0,form_version:VERSION});
// Preserve the site's existing tag manager; no registration values are sent by this script.
window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
const analytics=document.createElement('script');analytics.async=true;analytics.src='https://www.googletagmanager.com/gtm.js?id=GTM-WS3T5W6V';document.head.append(analytics);
