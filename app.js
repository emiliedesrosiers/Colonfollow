/* Logique élargie – Figures 4 & 14 + RSOSi + priorité ATCD familiaux */
self.computeInterval = function(c) {
  if (c.flags.some(Boolean)) return '3–6 mois';
  const normalScope = c.nAdenomas === 0 && c.nSerrated === 0 && !c.hyperLarge && !c.adv && c.largest === 0;
  if (!c.personal && !c.family && normalScope) return 'RSOSi 10 ans';
  if (!c.personal) {
    if (c.family) return '5 ans';
    return '10 ans';
  }
  const { nAdenomas: n, nSerrated: s, largest, adv, hyperLarge } = c;
  const totalLesions = n + s;
  if (totalLesions > 10) return '1 an';
  if ((totalLesions >= 5 && totalLesions <= 10) || largest >= 10 || adv) return '3 ans';
  if ((totalLesions >= 3 && totalLesions <= 4) || hyperLarge) return '3‑5 ans';
  if (n === 0 && s > 0 && s <= 2 && largest < 10) return '5‑10 ans';
  let interval = '7‑10 ans';
  if (c.family && ['7‑10 ans','5‑10 ans','10 ans'].includes(interval)) interval = '5 ans';
  return interval;
};

(function init(){
  const form=document.getElementById('criteriaForm');
  const result=document.getElementById('result');
  const display=document.getElementById('intervalDisplay');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const personal=document.getElementById('personalPolyp').checked;
    const family=document.getElementById('familyHistory').checked;
    const flags=[...form.querySelectorAll('input[name=flag]')].map(f=>f.checked);
    const nAdenomas=+document.getElementById('adenomaCount').value||0;
    const nSerrated=+document.getElementById('serratedCount').value||0;
    const largest=+document.getElementById('largestPolyp').value||0;
    const hyperLarge=document.getElementById('hyperplasticLarge').checked;
    const adv=document.getElementById('advancedHistology').checked;
    const interval=computeInterval({personal,family,flags,nAdenomas,nSerrated,largest,adv,hyperLarge});
    display.textContent=interval;
    result.hidden=false;
  });
  if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js');}
})();
