// Only a confirmed receipt from the form qualifies for the conversion event.
window.dataLayer=window.dataLayer||[];
try{
 const receipt=JSON.parse(sessionStorage.getItem('virtunex-brisanet-receipt')||'null');
 if(receipt&&/^VX-S-[0-9a-f-]{36}$/i.test(receipt.protocol)&&Number.isFinite(receipt.at)&&Date.now()-receipt.at>=0&&Date.now()-receipt.at<86400000){
  const protocol=document.getElementById('protocol');protocol.textContent='Protocolo: '+receipt.protocol;protocol.hidden=false;
  const key='virtunex-conversion:'+receipt.protocol;
  if(!localStorage.getItem(key)){
   localStorage.setItem(key,'1');
   window.dataLayer.push({event:'form_success',status:'received',transaction_id:receipt.protocol,plan_code:receipt.plan,form_version:receipt.version});
  }
 }
}catch{}
window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
const analytics=document.createElement('script');analytics.async=true;analytics.src='https://www.googletagmanager.com/gtm.js?id=GTM-WS3T5W6V';document.head.append(analytics);
