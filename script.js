"use strict";

    // Set this to a same-origin HTTPS endpoint that accepts the documented form payload before launch.
    const LEAD_ENDPOINT = "";
    const rates = { USD: { symbol: "$", multiplier: 1 }, AUD: { symbol: "A$", multiplier: 1.52 }, GBP: { symbol: "£", multiplier: 0.79 } };
    const roleCatalog = {
      ecommerce: { title: "E-Commerce & Customer Success", roles: [
        { name: "Customer support specialist", price: 1800, selected: true },
        { name: "E-Commerce operations coordinator", price: 1900, selected: true },
        { name: "Customer success associate", price: 1800, selected: true },
        { name: "Order & returns specialist", price: 1700, selected: false }
      ] },
      backoffice: { title: "Back-Office & Accounting", roles: [
        { name: "Bookkeeping assistant", price: 1900, selected: true },
        { name: "Accounts payable / receivable clerk", price: 1850, selected: true },
        { name: "Administrative operations assistant", price: 1700, selected: true },
        { name: "Payroll support specialist", price: 2000, selected: false }
      ] },
      creative: { title: "Creative & Visual Media", roles: [
        { name: "Graphic designer", price: 2000, selected: true },
        { name: "Video editor", price: 2100, selected: true },
        { name: "Content production assistant", price: 1800, selected: true },
        { name: "Social media coordinator", price: 1900, selected: false }
      ] },
      data: { title: "Data Analytics & Lead Gen", roles: [
        { name: "Lead generation researcher", price: 1800, selected: true },
        { name: "CRM data specialist", price: 1800, selected: true },
        { name: "Reporting analyst", price: 2200, selected: true },
        { name: "Sales development researcher", price: 2000, selected: false }
      ] }
    };
    let activeCategory = "ecommerce";
    let previousFocus = null;
    let calculatedSavings = null;
    let selectedSavings = null;

    const money = (amount, currency) => new Intl.NumberFormat("en", {
      style: "currency", currency, maximumFractionDigits: 0
    }).format(Math.round(amount));
    const currentRate = () => rates[document.getElementById("currency").value];

    function updateCalculator() {
      const currency = document.getElementById("currency").value;
      const rate = rates[currency];
      const count = Number(document.getElementById("teamSize").value);
      const salary = Number(document.getElementById("salary").value);
      const onshore = salary * rate.multiplier * count;
      const offshore = 1800 * 12 * rate.multiplier * count;
      const saved = onshore - offshore;
      const reduction = onshore > 0 ? Math.round((saved / onshore) * 100) : 0;
      document.getElementById("teamSizeValue").textContent = String(count);
      document.getElementById("salaryValue").textContent = money(salary * rate.multiplier, currency);
      document.getElementById("salaryMin").textContent = money(30000 * rate.multiplier, currency);
      document.getElementById("salaryMax").textContent = money(120000 * rate.multiplier, currency);
      document.getElementById("onshoreSpend").textContent = money(onshore, currency);
      document.getElementById("offshoreSpend").textContent = money(offshore, currency);
      document.getElementById("annualSavings").textContent = money(saved, currency);
      document.getElementById("overheadPct").textContent = `${reduction}% lower`;
      calculatedSavings = { currency, count, salary: salary * rate.multiplier, onshore, offshore, saved, reduction };
    }

    function renderRoles() {
      const catalog = roleCatalog[activeCategory];
      document.getElementById("categoryTitle").textContent = catalog.title;
      document.getElementById("rolesPanel").setAttribute("aria-labelledby", `tab-${activeCategory}`);
      document.getElementById("roleList").replaceChildren(...catalog.roles.map((role, index) => {
        const label = document.createElement("label");
        label.className = "flex cursor-pointer items-start gap-3 rounded-xl border border-white/[.07] bg-white/[.025] p-4 transition hover:border-emerald-400/25";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = role.selected;
        checkbox.dataset.roleIndex = String(index);
        checkbox.className = "mt-1 h-4 w-4 shrink-0 accent-emerald-400";
        checkbox.setAttribute("aria-label", role.name);
        const content = document.createElement("span");
        content.className = "min-w-0 flex-1";
        const name = document.createElement("span");
        name.className = "block text-sm font-semibold leading-5 text-slate-200";
        name.textContent = role.name;
        const price = document.createElement("span");
        price.className = "mt-1 block text-xs text-slate-500";
        price.textContent = `${money(role.price * currentRate().multiplier, document.getElementById("currency").value)} / month · estimate`;
        content.append(name, price);
        label.append(checkbox, content);
        checkbox.addEventListener("change", () => {
          role.selected = checkbox.checked;
          updatePodEstimate();
        });
        return label;
      }));
      document.querySelectorAll(".category-tab").forEach(tab => {
        const selected = tab.dataset.category === activeCategory;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        tab.className = `category-tab focus-ring rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${selected ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-white/10 text-slate-400 hover:text-white"}`;
      });
      updatePodEstimate();
    }

    function updatePodEstimate() {
      const roles = roleCatalog[activeCategory].roles.filter(role => role.selected);
      const total = roles.reduce((sum, role) => sum + role.price, 0) * currentRate().multiplier;
      const currency = document.getElementById("currency").value;
      const count = roles.length;
      document.getElementById("podRoleCount").textContent = `${count} selected role${count === 1 ? "" : "s"}`;
      document.getElementById("podCost").replaceChildren(document.createTextNode(money(total, currency)));
      const suffix = document.createElement("span");
      suffix.className = "ml-2 text-sm font-medium text-slate-500";
      suffix.textContent = "/ month";
      document.getElementById("podCost").append(suffix);
      document.getElementById("podTimeline").textContent = count === 0 ? "Scope a role first" : count <= 3 ? "14–21 days" : "21–30 days";
      document.getElementById("podNote").textContent = count === 0
        ? "Select at least one role to see an indicative estimate."
        : "Illustrative role estimates only; final pricing and availability are confirmed in a written proposal.";
    }

    const modal = document.getElementById("bookingModal");
    const modalSections = [...document.querySelectorAll("[data-modal-step]")];
    function setModalStep(step) {
      modalSections.forEach(section => { section.hidden = Number(section.dataset.modalStep) !== step; });
      document.querySelectorAll("[data-step-dot]").forEach(dot => {
        const active = Number(dot.dataset.stepDot) <= step;
        dot.classList.toggle("bg-emerald-400", active);
        dot.classList.toggle("bg-white/10", !active);
      });
      document.getElementById("modalTitle").textContent = step === 3 ? "Choose a preferred time" : "Plan your offshore pod";
      document.getElementById("modalDescription").textContent = step === 3 ? "Your request has been prepared. Choose a time preference." : "A few details help us make the conversation useful.";
      if (step === 2) document.getElementById("leadName").focus();
      if (step === 3) document.getElementById("timeSlots").querySelector("button")?.focus();
    }

    function openModal() {
      previousFocus = document.activeElement;
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.classList.add("overflow-hidden");
      setModalStep(1);
      document.getElementById("modalTeamSize").focus();
    }

    function closeModal() {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.classList.remove("overflow-hidden");
      document.getElementById("formError").classList.add("hidden");
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    }

    document.getElementById("teamSize").addEventListener("input", updateCalculator);
    document.getElementById("salary").addEventListener("input", updateCalculator);
    document.getElementById("currency").addEventListener("change", () => {
      updateCalculator();
      renderRoles();
      const onshore = document.getElementById("heroOnshore");
      const offshore = document.getElementById("heroOffshore");
      onshore.replaceChildren(document.createTextNode(money(6500 * currentRate().multiplier, document.getElementById("currency").value)));
      const onshoreSuffix = document.createElement("span");
      onshoreSuffix.className = "ml-1 text-xs font-medium text-slate-500";
      onshoreSuffix.textContent = "/mo";
      onshore.append(onshoreSuffix);
      offshore.replaceChildren(document.createTextNode(money(1800 * currentRate().multiplier, document.getElementById("currency").value)));
      const offshoreSuffix = document.createElement("span");
      offshoreSuffix.className = "ml-1 text-xs font-medium text-emerald-100/50";
      offshoreSuffix.textContent = "/mo";
      offshore.append(offshoreSuffix);
      document.getElementById("heroDelta").textContent = money((6500 - 1800) * 12 * currentRate().multiplier, document.getElementById("currency").value);
    });
    document.querySelectorAll(".category-tab").forEach(tab => tab.addEventListener("click", () => {
      activeCategory = tab.dataset.category;
      renderRoles();
    }));
    document.querySelectorAll(".category-tab").forEach(tab => tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const tabs = [...document.querySelectorAll(".category-tab")];
      const index = tabs.indexOf(tab);
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
      tabs[next].click();
      tabs[next].focus();
    }));
    document.getElementById("lockSavings").addEventListener("click", () => {
      updateCalculator();
      selectedSavings = { ...calculatedSavings };
      const data = selectedSavings;
      const summary = document.getElementById("modalSavingsSummary");
      summary.textContent = `Your current estimate: ${data.count} seat${data.count === 1 ? "" : "s"} · ${money(data.saved, data.currency)} potential annual savings · ${data.reduction}% lower labor spend. Estimates only; final pricing varies.`;
      summary.classList.remove("hidden");
      openModal();
    });
    document.querySelectorAll("[data-open-modal]").forEach(button => button.addEventListener("click", () => {
      selectedSavings = null;
      document.getElementById("modalSavingsSummary").classList.add("hidden");
      openModal();
    }));
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("finishModal").addEventListener("click", closeModal);
    modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
    document.addEventListener("keydown", event => {
      if (modal.classList.contains("hidden")) return;
      if (event.key === "Escape") {
        closeModal();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')].filter(element => !element.closest("[hidden]"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    document.querySelectorAll("[data-next-step]").forEach(button => button.addEventListener("click", () => {
      const step = document.querySelector('[data-modal-step="1"]');
      const fields = [...step.querySelectorAll("select[required]")];
      const firstInvalid = fields.find(field => !field.reportValidity());
      if (firstInvalid) return;
      setModalStep(2);
    }));
    document.querySelectorAll("[data-prev-step]").forEach(button => button.addEventListener("click", () => setModalStep(1)));

    function createTimeSlots() {
      const dateContainer = document.getElementById("dateSlots");
      const timeContainer = document.getElementById("timeSlots");
      const status = document.getElementById("slotStatus");
      const manilaDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit"
      }).format(new Date());
      const [year, month, day] = manilaDate.split("-").map(Number);
      const firstDate = new Date(Date.UTC(year, month - 1, day));
      const days = [];
      for (let offset = 1; days.length < 5; offset += 1) {
        const candidate = new Date(firstDate);
        candidate.setUTCDate(firstDate.getUTCDate() + offset);
        if (candidate.getUTCDay() === 0 || candidate.getUTCDay() === 6) continue;
        days.push(candidate);
      }
      dateContainer.replaceChildren(...days.map(date => {
        const dateButton = document.createElement("button");
        const dateValue = date.toISOString().slice(0, 10);
        dateButton.type = "button";
        dateButton.className = "focus-ring rounded-lg border border-white/10 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-200";
        dateButton.textContent = new Intl.DateTimeFormat("en", {
          timeZone: "Asia/Manila", weekday: "short", month: "short", day: "numeric"
        }).format(date);
        dateButton.addEventListener("click", () => {
          dateContainer.querySelectorAll("button").forEach(button => {
            button.classList.remove("border-emerald-400/50", "bg-emerald-400/10", "text-emerald-200");
            button.classList.add("border-white/10", "text-slate-300");
            button.setAttribute("aria-pressed", "false");
          });
          dateButton.classList.remove("border-white/10", "text-slate-300");
          dateButton.classList.add("border-emerald-400/50", "bg-emerald-400/10", "text-emerald-200");
          dateButton.setAttribute("aria-pressed", "true");
          status.classList.add("hidden");
          timeContainer.classList.remove("hidden");
          timeContainer.replaceChildren(...createTimeButtons(dateValue, dateButton.textContent));
        });
        dateButton.setAttribute("aria-pressed", "false");
        return dateButton;
      }));
      timeContainer.classList.add("hidden");
      status.classList.add("hidden");
    }

    function createTimeButtons(dateValue, dateLabel) {
      const slots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];
      return slots.map(time => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "focus-ring rounded-lg border border-white/10 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-200";
        button.textContent = time;
        button.addEventListener("click", async () => {
          container.querySelectorAll("button").forEach(slot => {
            slot.classList.remove("border-emerald-400/50", "bg-emerald-400/10", "text-emerald-200");
            slot.classList.add("border-white/10", "text-slate-300");
            slot.setAttribute("aria-pressed", "false");
          });
          button.classList.remove("border-white/10", "text-slate-300");
          button.classList.add("border-emerald-400/50", "bg-emerald-400/10", "text-emerald-200");
          button.setAttribute("aria-pressed", "true");
          const status = document.getElementById("slotStatus");
          const formData = new FormData(document.getElementById("leadForm"));
          status.textContent = "Sending your preferred time…";
          status.classList.remove("hidden");
          container.querySelectorAll("button").forEach(slot => { slot.disabled = true; });
          try {
            const response = await fetch(LEAD_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                source: "AcePartners BPO website",
                action: "meeting_preference",
                name: formData.get("name"),
                email: formData.get("email"),
                date: dateValue,
                time,
                timezone: "Asia/Manila",
                savingsEstimate: selectedSavings
              }),
              credentials: "omit"
            });
            if (!response.ok) throw new Error(`Lead endpoint responded with ${response.status}`);
            status.textContent = `${dateLabel}, ${time} PHT was sent as your preferred time. It is not reserved until confirmed by our team.`;
            document.getElementById("liveStatus").textContent = "Preferred meeting time sent. Await confirmation.";
          } catch (submissionError) {
            console.error("Meeting preference submission failed:", submissionError);
            status.textContent = "We couldn't send that time preference. Please select a slot again or contact our team through your usual channel.";
          } finally {
            container.querySelectorAll("button").forEach(slot => { slot.disabled = false; });
          }
        });
        button.setAttribute("aria-pressed", "false");
        return button;
      });
    }

    document.getElementById("leadForm").addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const error = document.getElementById("formError");
      const submit = document.getElementById("submitLead");
      if (!LEAD_ENDPOINT) {
        error.textContent = "This page is not connected to a secure lead inbox yet, so your details were not sent. Add your HTTPS lead endpoint in the LEAD_ENDPOINT setting before publishing.";
        error.classList.remove("hidden");
        return;
      }
      submit.disabled = true;
      submit.textContent = "Sending securely…";
      error.classList.add("hidden");
      const formData = new FormData(form);
      const payload = {
        source: "AcePartners BPO website",
        teamSize: formData.get("teamSize"),
        timeline: formData.get("timeline"),
        needs: formData.get("needs"),
        name: formData.get("name"),
        email: formData.get("email"),
        company: formData.get("company"),
        phone: formData.get("phone"),
        consent: formData.get("consent") === "on",
        savingsEstimate: selectedSavings,
        submittedAt: new Date().toISOString()
      };
      try {
        const response = await fetch(LEAD_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "omit"
        });
        if (!response.ok) throw new Error(`Lead endpoint responded with ${response.status}`);
        const result = await response.json().catch(() => ({}));
        document.getElementById("confirmationMessage").textContent = typeof result.message === "string"
          ? result.message
          : "Your request was submitted successfully. Choose a preferred time below; our team will follow up to confirm.";
        createTimeSlots();
        setModalStep(3);
        document.getElementById("liveStatus").textContent = "Request submitted. Choose a preferred meeting time.";
      } catch (submissionError) {
        console.error("Lead submission failed:", submissionError);
        error.textContent = "We couldn't send your request. Please try again or contact our team through your usual channel.";
        error.classList.remove("hidden");
      } finally {
        submit.disabled = false;
        submit.innerHTML = 'Request my strategy call <span aria-hidden="true">↗</span>';
      }
    });

    document.getElementById("menuToggle").addEventListener("click", event => {
      const menu = document.getElementById("mobileMenu");
      const isOpen = event.currentTarget.getAttribute("aria-expanded") === "true";
      event.currentTarget.setAttribute("aria-expanded", String(!isOpen));
      event.currentTarget.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      menu.classList.toggle("hidden", isOpen);
    });
    document.querySelectorAll("#mobileMenu a, #mobileMenu button").forEach(link => link.addEventListener("click", () => {
      document.getElementById("mobileMenu").classList.add("hidden");
      document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
    }));
    document.getElementById("year").textContent = String(new Date().getFullYear());
    updateCalculator();
    renderRoles();