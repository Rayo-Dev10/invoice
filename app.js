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
            style: "currency", currency: "USD", minimumFractionDigits: 2
        }).format(Number(n || 0));
    };

    const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));

    const totals = () => Items.reduce((a, it) => a + (it.qty * it.unitPrice), 0);

    const toggleMode = () => {
        isEstimate = !isEstimate;
        $("BtnToggleMode").textContent = isEstimate ? "CAMBIAR A MODO FACTURA" : "CAMBIAR A MODO ESTIMACIÓN";
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
                            <button type="button" class="edit-btn" data-edit="${i}">Editar</button>
                            <button type="button" class="delete-btn" data-del="${i}">🗑️</button>
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
        
        // CAPTURA DE PORCENTAJE MANUAL
        const pctInput = parseNum($("AdvancePercentInput").value);
        const pct = isNaN(pctInput) ? 100 : pctInput;
        const advance = t * (pct / 100);

        if (isEstimate) {
            $("MainTitle").textContent = "ESTIMATE";
            $("LblDocNumber").textContent = "Estimate Number:";
            $("LblDate").textContent = "Estimate Date:";
            $("LblDue").textContent = "Valid Until:";
            $("LblAmountTop").textContent = "Estimate Total";
            $("LblAmountBottom").textContent = "Estimate Total:";
            if($("RowAdvance")) $("RowAdvance").style.display = "none";
            if($("RowPercentInput")) $("RowPercentInput").style.display = "none";
            $("AmountDueTop").textContent = money(t);
            $("AmountDueBottom").textContent = money(t);
        } else {
            $("MainTitle").textContent = "INVOICE";
            $("LblDocNumber").textContent = "Invoice Number:";
            $("LblDate").textContent = "Invoice Date:";
            $("LblDue").textContent = "Payment Due:";
            $("LblAmountTop").textContent = "Amount Due";
            $("LblAmountBottom").textContent = (pct === 100) ? "Total Amount:" : "Balance Due:";
            
            if($("RowPercentInput")) $("RowPercentInput").style.display = "flex";
            if($("RowAdvance")) {
                // Solo mostrar la fila de anticipo si es menor al 100%
                $("RowAdvance").style.display = (pct === 100) ? "none" : "flex";
                $("ValPercentLabel").textContent = pct;
                $("ValAdvance").textContent = money(advance);
            }
            $("AmountDueTop").textContent = money(advance);
            $("AmountDueBottom").textContent = money(advance);
        }
        $("Total").textContent = money(t);
    };

    // EVENTOS
    $("AdvancePercentInput").oninput = render; // Actualización en tiempo real
    
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

    $("ItemsBody").onclick = e => {
        const edit = e.target.closest("[data-edit]");
        if(edit) {
            const i = Number(edit.getAttribute("data-edit"));
            EditingIndex = i;
            $("Editor").style.display = "block";
            $("ItemTitle").value = Items[i].title;
            $("ItemDesc").value = Items[i].desc;
        }
        const del = e.target.closest("[data-del]");
        if(del && confirm("¿Eliminar ítem?")) {
            Items.splice(Number(del.getAttribute("data-del")), 1);
            render();
        }
    };

    $("BtnCancel").onclick = () => $("Editor").style.display = "none";
    $("BtnToggleMode").onclick = toggleMode;
    $("BtnPrint").onclick = () => window.print();

    $("InvoiceDateInput").value = todayISO();
    $("PaymentDueInput").value = todayISO();
    render();
})();
