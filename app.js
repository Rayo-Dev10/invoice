(() => {
    const Items = [];
    let EditingIndex = -1;
    let isEstimate = false;

    const $ = id => document.getElementById(id);

    const parseNum = v => {
        const s = String(v ?? "").trim().replace(/[^0-9.-]+/g, "");
        const n = parseFloat(s);
        return Number.isFinite(n) ? n : NaN;
    };

    const todayISO = () => new Date().toISOString().split("T")[0];

    const money = n => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }).format(Number(n || 0));
    };

    const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    }[m]));

    const totals = () => Items.reduce((a, it) => a + (it.qty * it.unitPrice), 0);

    const validateAndRender = () => {
        const input = $("AdvancePercentInput");
        let val = parseNum(input.value);

        if (isNaN(val) || val < 0) val = 0;
        if (val > 100) val = 100;

        input.value = val;
        render();
    };

    const toggleMode = () => {
        isEstimate = !isEstimate;
        $("BtnToggleMode").textContent = isEstimate
            ? "CAMBIAR A MODO FACTURA"
            : "CAMBIAR A MODO ESTIMACIÓN";
        render();
    };

    const render = () => {
        const tbody = $("ItemsBody");
        tbody.innerHTML = Items.length
            ? ""
            : '<tr><td class="empty" colspan="4">Sin ítems agregados.</td></tr>';

        Items.forEach((it, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="item-title-row">
                        <div class="item-title">${esc(it.title)}</div>
                        <div class="item-actions no-print">
                            <button type="button" onclick="window._edit(${i})">Editar</button>
                            <button type="button" onclick="window._del(${i})">Eliminar</button>
                        </div>
                    </div>
                    <div class="item-desc">${esc(it.desc).replace(/\n/g, "<br>")}</div>
                </td>
                <td class="r">${it.qty}</td>
                <td class="r">${money(it.unitPrice)}</td>
                <td class="r">${money(it.qty * it.unitPrice)}</td>
            `;
            tbody.appendChild(tr);
        });

        const t = totals();
        const pct = parseNum($("AdvancePercentInput").value) || 0;
        const advance = t * (pct / 100);

        if (isEstimate) {
            $("MainTitle").textContent = "ESTIMATE";
            $("LblDocNumber").textContent = "Estimate Number:";
            $("LblDate").textContent = "Estimate Date:";
            $("LblDue").textContent = "Valid Until:";
            $("LblAdvanceType").textContent = "Required Deposit";
            $("LblAmountTop").textContent = (pct === 100) ? "Estimate Total" : "Required Deposit";
            $("LblAmountBottom").textContent = "Estimate Total:";
            if ($("RowAdvance")) $("RowAdvance").style.display = (pct === 100 || pct === 0) ? "none" : "flex";
            $("AmountDueTop").textContent = money(advance);
            $("AmountDueBottom").textContent = money(t);
        } else {
            $("MainTitle").textContent = "INVOICE";
            $("LblDocNumber").textContent = "Invoice Number:";
            $("LblDate").textContent = "Invoice Date:";
            $("LblDue").textContent = "Payment Due:";
            $("LblAdvanceType").textContent = "Advance";
            $("LblAmountTop").textContent = "Amount Due";
            $("LblAmountBottom").textContent = (pct === 100) ? "Total Amount:" : "Balance Due:";
            if ($("RowAdvance")) $("RowAdvance").style.display = (pct === 100 || pct === 0) ? "none" : "flex";
            $("AmountDueTop").textContent = money(advance);
            $("AmountDueBottom").textContent = money(advance);
        }

        $("ValPercentLabel").textContent = pct;
        $("ValAdvance").textContent = money(advance);
        $("Total").textContent = money(t);
    };

    const resetEditor = () => {
        $("ItemTitle").value = "";
        $("ItemDesc").value = "";
        $("ItemQty").value = "1";
        $("ItemUnitPrice").value = "";
    };

    window._edit = i => {
        EditingIndex = i;
        $("Editor").style.display = "block";
        $("ItemTitle").value = Items[i].title;
        $("ItemDesc").value = Items[i].desc;
        $("ItemQty").value = Items[i].qty;
        $("ItemUnitPrice").value = Items[i].unitPrice;
    };

    window._del = i => {
        if (confirm("¿Eliminar ítem?")) {
            Items.splice(i, 1);
            render();
        }
    };

    $("BtnAddGuided").onclick = () => {
        EditingIndex = -1;
        $("Editor").style.display = "block";
        resetEditor();
    };

    $("BtnFinishDesc").onclick = () => {
        const title = $("ItemTitle").value.trim();
        const desc = $("ItemDesc").value.trim();
        const qty = parseNum($("ItemQty").value);
        const unit = parseNum($("ItemUnitPrice").value);

        if (!title || !desc) return alert("Campos obligatorios.");
        if (isNaN(qty) || isNaN(unit)) return alert("Valores numéricos inválidos.");

        const nextItem = { title, desc, qty, unitPrice: unit };

        if (EditingIndex >= 0) Items[EditingIndex] = nextItem;
        else Items.push(nextItem);

        $("Editor").style.display = "none";
        render();
    };

    $("AdvancePercentInput").oninput = validateAndRender;
    $("BtnCancel").onclick = () => $("Editor").style.display = "none";
    $("BtnToggleMode").onclick = toggleMode;
    $("BtnPrint").onclick = () => window.print();

    $("InvoiceDateInput").value = todayISO();
    $("PaymentDueInput").value = todayISO();
    render();
})();
