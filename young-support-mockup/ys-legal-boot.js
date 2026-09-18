(() => {
  const arrival = new URL(location.href);
  if (arrival.searchParams.get('ys-return') === 'registration') {
    window.YSRegistrationReturn = { y: Math.max(0, Number(arrival.searchParams.get('ys-y')) || 0) };
    arrival.searchParams.delete('ys-return');
    arrival.searchParams.delete('ys-y');
    history.replaceState(history.state, '', arrival.href);
  }
  try {
    const pending = JSON.parse(sessionStorage.getItem('ys-legal-navigation') || 'null');
    sessionStorage.removeItem('ys-legal-navigation');
    window.YSLegalArrival = !!(pending && pending.path === location.pathname && Date.now() - pending.time < 30000);
  } catch (_) { window.YSLegalArrival = false; }
  if (window.YSLegalArrival && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('ys-legal-arrival');
    // Never leave a failed script or asset load hiding the page.
    window.setTimeout(() => document.documentElement.classList.remove('ys-legal-arrival'), 8000);
  }
})();
