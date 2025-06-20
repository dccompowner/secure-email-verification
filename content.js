// === content.js ===
(async () => {
  const observer = new MutationObserver(() => {
    // Outbound Signing
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
            alert("Signed Hash (simulated header):\n" + hashHex);
          }
        });
      }
    });

    // Inbound Verification
    const messageBodies = document.querySelectorAll("div[role='listitem'] div[data-message-id]");
    messageBodies.forEach(async (msg) => {
      if (!msg.dataset.verifierChecked) {
        msg.dataset.verifierChecked = true;
        const textContent = msg.innerText;
        const sigMatch = textContent.match(/Signed Hash \(simulated header\):\s*([a-f0-9]{64})/i);
        if (sigMatch) {
          const foundHash = sigMatch[1];
          const text = textContent.replace(/Signed Hash \(simulated header\):\s*[a-f0-9]{64}/i, "").trim();
          const calculated = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
          const calcHex = Array.from(new Uint8Array(calculated)).map(b => b.toString(16).padStart(2, '0')).join('');
          if (foundHash === calcHex) {
            msg.style.border = "2px solid green";
            msg.title = "Verified signature";
          } else {
            msg.style.border = "2px solid red";
            msg.title = "Signature does not match content.";
          }
        }
      }
    });
  });

  observer.observe(document.body, { subtree: true, childList: true });
})();
