(function () {
  // ───────────────────────────────────────────────────────────
  // n8n Webhook URL 을 여기에 붙여넣으세요.
  // (n8n Webhook 노드의 "Production URL" 값)
  // 예: "https://your-n8n.example.com/webhook/seum-visit"
  const WEBHOOK_URL = "";
  // ───────────────────────────────────────────────────────────

  const form = document.getElementById("reservation-form");
  if (!form) return;

  const dateInput = document.getElementById("visit-date");
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  const phone = document.getElementById("phone");
  if (phone) {
    const formatPhone = (raw) => {
      const d = raw.replace(/\D/g, "").slice(0, 11);
      if (d.length < 4) return d;
      if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
      if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
      return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
    };
    phone.addEventListener("input", (e) => {
      e.target.value = formatPhone(e.target.value);
    });
  }

  const submitBtn = form.querySelector(".submit");
  const submitLabel = submitBtn ? submitBtn.querySelector("span:first-child") : null;

  const setSubmitting = (on) => {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.style.opacity = on ? "0.7" : "";
    submitBtn.style.pointerEvents = on ? "none" : "";
    if (submitLabel) submitLabel.textContent = on ? "접수 중…" : "방문예약 접수";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const required = ["name", "phone", "visit-date", "visit-time", "visitors", "showroom"];
    for (const id of required) {
      const el = document.getElementById(id);
      if (el && !el.value) {
        el.focus();
        alert("필수 항목을 입력해주세요.");
        return;
      }
    }

    const agree = document.getElementById("agree");
    if (!agree.checked) {
      alert("개인정보 수집·이용에 동의해주세요.");
      return;
    }

    // n8n 으로 보낼 데이터 (필드명은 폼의 name 속성과 동일)
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name") || "",
      phone: fd.get("phone") || "",
      visitDate: fd.get("visitDate") || "",
      visitTime: fd.get("visitTime") || "",
      visitors: fd.get("visitors") || "",
      showroom: fd.get("showroom") || "",
      houseType: fd.get("houseType") || "",
      pyeong: fd.get("pyeong") || "",
      budget: fd.get("budget") || "",
      landOwned: fd.get("landOwned") || "",
      landAddress: fd.get("landAddress") || "",
      buildTimeline: fd.get("buildTimeline") || "",
      memo: fd.get("memo") || "",
      agree: agree.checked,
      submittedAt: new Date().toISOString(),
    };

    // 웹훅 URL 미설정 시(로컬 테스트) 콘솔 출력으로 폴백
    if (!WEBHOOK_URL) {
      console.log("방문예약 데이터 (WEBHOOK_URL 미설정)", payload);
      alert("방문예약이 접수되었습니다.\n상담 후 연락드리겠습니다.");
      form.reset();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      alert("방문예약이 접수되었습니다.\n상담 후 연락드리겠습니다.");
      form.reset();
    } catch (err) {
      console.error("방문예약 전송 실패", err);
      alert("접수 중 오류가 발생했습니다.\n잠시 후 다시 시도하시거나 전화로 문의해주세요.");
    } finally {
      setSubmitting(false);
    }
  });
})();
