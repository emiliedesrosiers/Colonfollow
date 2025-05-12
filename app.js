/* Logique de calcul – Figure 4 */
self.computeInterval = function(c) {
  // Exceptions qualité -> 3–6 mois
  if (c.flags.some(x => x)) return '3–6 mois';

  // Historique personnel de polypes
  if (c.risk === 'personal') {
    const n = c.nAdenomas;
    const largest = c.largest;
    const adv = c.advanced;
    if (adv || largest >= 10 || n >= 5) return '3 ans';
    if (n >= 3) return '5 ans';
    return '10 ans';
  }

  // Risque moyen & ATCD familiaux (simplifié)
  if (c.risk === 'average') return '10 ans';
  return '5 ans'; // familial
};

(function init() {
  const form = document.getElementById('criteriaForm');
  const result = document.getElementById('result');
  const intervalDisplay = document.getElementById('intervalDisplay');

  form.addEventListener('submit', e => {
    e.preventDefault();
    // Récupérer données
    const risk = form.risk.value;
    const flags = [...form.querySelectorAll('input[name=flag]')].map(f => f.checked);
    const nAdenomas = parseInt(document.getElementById('adenomaCount').value, 10) || 0;
    const largest = parseInt(document.getElementById('largestPolyp').value, 10) || 0;
    const advanced = document.getElementById('advancedHistology').checked;

    const interval = computeInterval({ risk, flags, nAdenomas, largest, advanced });
    intervalDisplay.textContent = interval;
    result.hidden = false;
  });

  // Service-worker pour mode hors-ligne
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
})();
