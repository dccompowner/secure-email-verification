// === content.js ===
// Injects into Gmail's compose window
(async () => {
  const observer = new MutationObserver(() => {
    const sendButtons = document.querySelectorAll("div[role='button'][data-tooltip^='Send']");
    sendButtons.forEach((btn) => {
      if (!btn.dataset.verifierAttached) {
        btn.dataset.verifierAttached = true;
        btn.addEventListener("click", async () => {
          const body = document.querySelector("div[aria-label='Message Body']");
          const subject = document.querySelector("input[name='subjectbox']");
          if (body && subject) {
            const text = subject.value + body.innerText;
            const hash = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
            const hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
            console.log("[EmailVerifier] SHA256:", hashHex);
            // Simulate header injection — real SMTP header needs server-side send plugin
            alert("Signed Hash (simulated header):\n" + hashHex);
          }
        });
      }
    });
  });
  observer.observe(document.body, { subtree: true, childList: true });
})();
