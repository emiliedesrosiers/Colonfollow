/* Logique élargie – Figures 4 & 14 */
self.computeInterval = function(c) {
  // 0. Exceptions qualité → 3–6 mois
  if (c.flags.some(Boolean)) return '3–6 mois';

  // 1. Pas d’antécédent personnel de polypes
  if (!c.personal) {
    if (c.family) return '5 ans'; // ATCD familiaux seulement
    return '10 ans';              // Risque moyen
  }

  // 2. Analyse détaillée pour ATCD personnels (page 14)
  const { nAdenomas: n, nSerrated: s, largest, adv, hyperLarge } = c;
  const totalLesions = n + s;

  // A. >10 lésions → 1 an
  if (totalLesions > 10) return '1 an';

  // B. 5‑10 lésions OU taille ≥10 mm OU histologie avancée → 3 ans
  if ((totalLesions >= 5 && totalLesions <= 10) || largest >= 10 || adv) {
    return '3 ans';
  }

  // C. 3‑4 lésions OU polype hyperplasique ≥10 mm → 3‑5 ans
  if ((totalLesions >= 3 && totalLesions <= 4) || hyperLarge) {
    return '3‑5 ans';
  }

  // D. 1‑2 polypes festonnés (<10 mm) → 5‑10 ans
  if (n === 0 && s > 0 && s <= 2 && largest < 10) {
    return '5‑10 ans';
  }

  // E. 1‑2 adénomes (<10 mm, non avancés) → 7‑10 ans
  return '7‑10 ans';
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

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js');
  }
})();
