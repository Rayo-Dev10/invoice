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

    const todayISO = () => new Date().toISOString().split('T')[0];

    const money = n => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }).format(Number(n || 0));
    };

    const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));

    const totals = () => Items.reduce((a, it) => a + (it.qty * it.unitPrice), 0);

    const toggleMode = () => {
        isEstimate = !isEstimate;
        $("BtnToggleMode").textContent = isEstimate ? "MODO FACTURA" : "MODO ESTIMACIÓN";
        render();
    };

    const render = () => {
        const tbody = $("ItemsBody");
        tbody.innerHTML = Items.length ? "" : '<tr><td class="empty" colspan="4">Sin ítems agregados.</td></tr>';

        Items.forEach((it, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="item-title-row">
                        <div class="item-title">${esc(it.title)}</div>
                        <div class="item-actions no-print">
                            <button type="button" class="edit-btn" onclick="window._edit(${i})">Editar</button>
                            <button type="button" class="delete-btn" onclick="window._del(${i})">🗑️</button>
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
        const advance = t * 0.5;

        if (isEstimate) {
            $("MainTitle").textContent = "ESTIMATE";
            $("LblDocNumber").textContent = "Estimate Number:";
            $("LblDate").textContent = "Estimate Date:";
            $("LblDue").textContent = "Valid Until:";
            $("LblAmountTop").textContent = "Estimate Total";
            $("LblAmountBottom").textContent = "Estimate Total:";
            if($("RowAdvance")) $("RowAdvance").style.display = "none";
            $("AmountDueTop").textContent = money(t);
            $("AmountDueBottom").textContent = money(t);
        } else {
            $("MainTitle").textContent = "INVOICE";
            $("LblDocNumber").textContent = "Invoice Number:";
            $("LblDate").textContent = "Invoice Date:";
            $("LblDue").textContent = "Payment Due:";
            $("LblAmountTop").textContent = "Amount Due";
            $("LblAmountBottom").textContent = "Balance Due:";
            if($("RowAdvance")) {
                $("RowAdvance").style.display = "flex";
                $("ValAdvance").textContent = money(advance);
            }
            $("AmountDueTop").textContent = money(advance);
            $("AmountDueBottom").textContent = money(advance);
        }
        $("Total").textContent = money(t);
    };

    // Global helpers para botones en strings de render
    window._edit = i => {
        const it = Items[i];
        EditingIndex = i;
        $("Editor").style.display = "block";
        $("ItemTitle").value = it.title;
        $("ItemDesc").value = it.desc;
        $("ItemTitle").focus();
    };

    window._del = i => {
        if(confirm("¿Eliminar este ítem?")) { Items.splice(i, 1); render(); }
    };

    $("BtnAddGuided").onclick = () => {
        EditingIndex = -1;
        $("Editor").style.display = "block";
        $("ItemTitle").value = ""; $("ItemDesc").value = "";
        $("ItemTitle").focus();
    };

    $("BtnFinishDesc").onclick = () => {
        const title = $("ItemTitle").value.trim();
        const desc = $("ItemDesc").value.trim();
        if(!title || !desc) return alert("Complete los campos.");

        const qty = parseNum(prompt("Cantidad:", EditingIndex >= 0 ? Items[EditingIndex].qty : "1"));
        const unit = parseNum(prompt("Precio Unitario:", EditingIndex >= 0 ? Items[EditingIndex].unitPrice : "0"));

        if(isNaN(qty) || isNaN(unit)) return alert("Valores numéricos inválidos.");

        if(EditingIndex >= 0) Items[EditingIndex] = {title, desc, qty, unitPrice: unit};
        else Items.push({title, desc, qty, unitPrice: unit});

        $("Editor").style.display = "none";
        render();
    };

    $("BtnCancel").onclick = () => $("Editor").style.display = "none";
    $("BtnToggleMode").onclick = toggleMode;
    $("BtnPrint").onclick = () => window.print();

    $("InvoiceDateInput").value = todayISO();
    $("PaymentDueInput").value = todayISO();

    render();
})();
