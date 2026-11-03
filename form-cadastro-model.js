export const VERSION='3.1.0';
export const PLANS=Object.freeze({
"BLACK_500":{"name": "500 Mega", "price": 79.9, "download": 500, "upload": null, "condition": "R$ 79,90/mês. Oferta Mega Black para João Pessoa/PB."},"BLACK_800":{"name": "800 Mega", "price": 89.9, "download": 800, "upload": null, "condition": "R$ 89,90 por 24 meses; a partir do 25º mês, R$ 99,90/mês. João Pessoa/PB."},"BLACK_700":{"name": "700 Mega", "price": 99.9, "download": 700, "upload": null, "condition": "R$ 99,90 por 12 meses; a partir do 13º mês, R$ 109,90/mês. João Pessoa/PB."},"BLACK_700_SKY":{"name": "700 Mega + SKY+ Padrão", "price": 94.9, "download": 700, "upload": null, "condition": "R$ 94,90 por 24 meses; a partir do 25º mês, R$ 109,80/mês. João Pessoa/PB."},"BLACK_500_NETFLIX":{"name": "500 Mega + Netflix", "price": 100.8, "download": 500, "upload": null, "condition": "R$ 100,80/mês. Netflix Padrão com Anúncios. João Pessoa/PB."},"BLACK_600_40_NETFLIX":{"name": "600 Mega + 40 GB + Netflix", "price": 120.79, "download": 600, "upload": null, "condition": "R$ 120,79/mês. BrisaControle 40 GB e Netflix Padrão com Anúncios. João Pessoa/PB."},"BLACK_600_40":{"name": "600 Mega + BrisaControle 40 GB", "price": 99.9, "download": 600, "upload": null, "condition": "R$ 99,90/mês. BrisaControle 40 GB. João Pessoa/PB."},"BLACK_700_70":{"name": "700 Mega + BrisaControle 70 GB", "price": 119.89, "download": 700, "upload": null, "condition": "R$ 119,89/mês. BrisaControle 70 GB. João Pessoa/PB."},
 FIBRA_500:{name:'500 Mega',price:84.99,download:500,upload:250,condition:'R$ 84,99 por 3 meses; depois R$ 89,99/mês.'},
 FIBRA_700:{name:'700 Mega',price:99.90,download:700,upload:350,condition:'R$ 99,90 por 12 meses; depois R$ 109,90/mês.'},
 FIBRA_1000:{name:'1 Giga',price:149.99,download:1000,upload:500,condition:'R$ 149,99/mês. Condições e disponibilidade sujeitas à conferência.'}
});
export const planCode=value=>value==='FIBRA_1GIGA'?'FIBRA_1000':Object.hasOwn(PLANS,value??'')?value:'';
export function resolvePlan(search,draft=''){
 const params=new URLSearchParams(search);const requested=params.get('plano')??params.get('plan');
 return requested!==null?planCode(requested):planCode(draft);
}
export const digits=value=>String(value??'').replace(/\D/g,'');
export function validCpf(value){const cpf=digits(value);if(!/^\d{11}$/.test(cpf)||/^(\d)\1{10}$/.test(cpf))return false;for(let n=9;n<11;n++){let sum=0;for(let i=0;i<n;i++)sum+=Number(cpf[i])*(n+1-i);if((sum*10%11)%10!==Number(cpf[n]))return false;}return true;}
export function localDay(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Fortaleza',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function plusDays(day,n){const date=new Date(day+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+n);return date.toISOString().slice(0,10);}
export function validDate(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value??''))return false;const date=new Date(value+'T12:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;}
export function availablePeriods(day,now=new Date()){
 const today=localDay(now);if(!validDate(day)||day<today)return [];
 return ['MANHA','TARDE'];
}
export function suggestedDates(now=new Date()){const today=localDay(now);const first=availablePeriods(today,now).length?today:plusDays(today,1);return [first,plusDays(first,1)];}
export function normalizeAddress(data){
 const type=data.tipo_imovel;
 const clean=key=>String(data[key]??'').trim();
 const apartment=type==='EDIFICIO'?clean('apartamento'):'';
 const block=type==='EDIFICIO'?clean('bloco'):'';
 const houseLot=type==='CONDOMINIO'?clean('casa_lote'):'';
 const court=type==='CONDOMINIO'?clean('quadra_alameda'):'';
 const condominium=type==='EDIFICIO'||type==='CONDOMINIO'?clean('nome_condominio'):'';
 const houseComplement=type==='CASA'&&data.tem_complemento===true?clean('complemento'):'';
 const complement=[houseComplement,condominium?`Condomínio/edifício: ${condominium}`:'',apartment?`Apto: ${apartment}`:'',block?`Bloco/torre: ${block}`:'',houseLot?`Casa/lote: ${houseLot}`:'',court?`Quadra/alameda: ${court}`:''].filter(Boolean).join(' · ');
 return {complemento:complement,nome_condominio:condominium,apartamento:apartment,bloco:block,casa_lote:houseLot,quadra_alameda:court};
}
export function validate(data,step,now=new Date()){
 const errors={};const required=(key,label)=>{if(!String(data[key]??'').trim())errors[key]=`Informe ${label}.`;};
 if(step===0){required('cep','o CEP');if(digits(data.cep).length!==8)errors.cep='Informe um CEP com 8 números.';if(!planCode(data.plano_codigo))errors.plano_codigo='Selecione o plano que deseja solicitar.';}
 if(step===1){
  required('nome_completo','o nome completo');if(String(data.nome_completo??'').trim().split(/\s+/).length<2)errors.nome_completo='Informe nome e sobrenome do titular.';
  if(!validCpf(data.cpf))errors.cpf='Confira o CPF informado.';
  if(!validDate(data.data_nascimento)||data.data_nascimento>=localDay(now))errors.data_nascimento='Informe uma data de nascimento válida, anterior a hoje.';
  for(const key of ['telefone','telefone_alternativo'])if(!/^\d{10,11}$/.test(digits(data[key])))errors[key]='Informe o telefone com DDD.';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email??'').trim()))errors.email='Confira o e-mail informado.';
 }
 if(step===2){
  for(const [key,label]of [['logradouro','a rua/avenida'],['numero','o número ou marque Sem número'],['bairro','o bairro'],['cidade','a cidade'],['uf','a UF'],['referencia1','o ponto de referência 1'],['referencia2','o ponto de referência 2']])required(key,label);
  if(!/^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/.test(data.uf??''))errors.uf='Selecione a UF.';
  if(!['CASA','EDIFICIO','CONDOMINIO'].includes(data.tipo_imovel))errors.tipo_imovel='Selecione o tipo de imóvel.';
  if(data.tipo_imovel==='CASA'&&data.tem_complemento)required('complemento','o complemento');
  if(['EDIFICIO','CONDOMINIO'].includes(data.tipo_imovel))required('nome_condominio','o nome do edifício/condomínio');
  if(data.tipo_imovel==='EDIFICIO')required('apartamento','o apartamento');
  if(data.tipo_imovel==='CONDOMINIO')required('casa_lote','a casa ou lote');
 }
 if(step===3){
  for(const i of [1,2]){if(!availablePeriods(data['data'+i],now).length)errors['data'+i]='Escolha uma data a partir de hoje.';
   if(!availablePeriods(data['data'+i],now).includes(data['periodo'+i]))errors['periodo'+i]='Escolha manhã ou tarde para esta data.';}
  if(data.data1===data.data2&&data.periodo1===data.periodo2)errors.data2='Escolha outra combinação de data e período.';
 }
 return errors;
}
export function buildPayload(data,id){
 const plan=PLANS[planCode(data.plano_codigo)];if(!plan)throw Error('Selecione o plano.');
 const names=String(data.nome_completo).trim().split(/\s+/);
 return {submission_id:id,consent:true,form_version:VERSION,nome:names.shift(),sobrenome:names.join(' '),cpf:digits(data.cpf),rg:String(data.rg??'').trim(),data_nascimento:data.data_nascimento,
  telefone:digits(data.telefone),telefone_alternativo:digits(data.telefone_alternativo),email:String(data.email).trim(),cep:digits(data.cep),logradouro:String(data.logradouro).trim(),numero:String(data.numero).trim(),
  bairro:String(data.bairro).trim(),cidade:String(data.cidade).trim(),uf:data.uf,tipo_imovel:data.tipo_imovel,tem_complemento:data.tem_complemento===true,...normalizeAddress(data),
  referencia1:String(data.referencia1).trim(),referencia2:String(data.referencia2).trim(),plano_codigo:planCode(data.plano_codigo),plano_nome:plan.name,plano_preco:plan.price,oferta_condicoes:plan.condition,
  addon_conecta:false,agendamento:[{data:data.data1,periodo:data.periodo1},{data:data.data2,periodo:data.periodo2}],biometria:{responsavel:data.quem_preenche||'NAO_INFORMADO',whatsapp_titular:digits(data.telefone)}};
}
