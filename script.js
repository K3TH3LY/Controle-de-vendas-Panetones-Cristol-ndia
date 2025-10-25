const PASSWORD = '3101'; // senha de login da aplicação
const STOCK_PASSWORD = '0408'; // senha para editar estoque
const PANETTONE_PRICE = 450.00;

let currentUnit = '';
let editingSaleIndex = -1;

let salesData = {
    cristolandia: { chocolate: 50, frutas: 50, sales: [] },
    viver: { chocolate: 50, frutas: 50, sales: [] },
    reino: { chocolate: 50, frutas: 50, sales: [] }
};

// Carregar dados do localStorage
function loadData() {
    const saved = localStorage.getItem('panetonesSalesData');
    if (saved) salesData = JSON.parse(saved);
}

// Salvar dados no localStorage
function saveData() {
    localStorage.setItem('panetonesSalesData', JSON.stringify(salesData));
}

// Login da aplicação
function login() {
    const password = document.getElementById('passwordInput').value;
    if (password === PASSWORD) {
        document.querySelector('.login-screen').classList.remove('active');
        document.querySelector('.unit-selection').classList.add('active');
        document.getElementById('loginError').textContent = '';
    } else {
        document.getElementById('loginError').textContent = 'Senha incorreta!';
    }
}

// Seleção da unidade
function selectUnit(unit) {
    currentUnit = unit;
    const unitNames = { cristolandia: 'Cristolândia', viver: 'Viver', reino: 'Reino' };
    document.getElementById('unitTitle').textContent = unitNames[unit];
    updateStats();
    document.querySelector('.unit-selection').classList.remove('active');
    document.querySelector('.unit-details').classList.add('active');
}

// Atualizar estatísticas da unidade
function updateStats() {
    const unit = salesData[currentUnit];
    const totalStock = unit.chocolate + unit.frutas;
    const totalSold = unit.sales.reduce((sum, sale) => sum + (sale.chocolateQty || 0) + (sale.frutasQty || 0), 0);
    const totalRevenue = totalSold * PANETTONE_PRICE;

    document.getElementById('totalStock').textContent = totalStock;
    document.getElementById('totalSold').textContent = totalSold;
    document.getElementById('totalRevenue').textContent = `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`;
    document.getElementById('chocolateStock').textContent = unit.chocolate;
    document.getElementById('frutasStock').textContent = unit.frutas;
}

// Mostrar modal para ajustar estoque
function showStockModal() {
    document.getElementById('stockModal').classList.add('active');
    document.querySelector('.stock-inputs').style.display = 'none';
    document.getElementById('stockPassword').value = '';
}

// Verificar senha e mostrar inputs de estoque
document.getElementById('stockPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const pass = document.getElementById('stockPassword').value;
        if (pass === STOCK_PASSWORD) {
            const unit = salesData[currentUnit];
            document.getElementById('editChocolateStock').value = unit.chocolate;
            document.getElementById('editFrutasStock').value = unit.frutas;
            document.querySelector('.stock-inputs').style.display = 'block';
        } else {
            alert('Senha incorreta!');
        }
    }
});

// Salvar estoque ajustado
function saveStock() {
    const chocolateQty = parseInt(document.getElementById('editChocolateStock').value) || 0;
    const frutasQty = parseInt(document.getElementById('editFrutasStock').value) || 0;
    salesData[currentUnit].chocolate = chocolateQty;
    salesData[currentUnit].frutas = frutasQty;
    saveData();
    updateStats();
    closeStockModal();
    alert('Estoque atualizado com sucesso!');
}

// Fechar modal de estoque
function closeStockModal() {
    document.getElementById('stockModal').classList.remove('active');
}

// Modal para adicionar venda
function showAddSaleModal() {
    const saleForm = document.getElementById('saleForm');
    if (currentUnit === 'cristolandia') {
        saleForm.innerHTML = `
            <div class="form-group">
                <label>Igreja:</label>
                <input type="text" id="igreja" placeholder="Nome da igreja">
            </div>
            <div class="form-group">
                <label>Responsável da Igreja:</label>
                <input type="text" id="responsavelIgreja" placeholder="Nome do responsável">
            </div>
            <div class="form-group">
                <label>Responsável da Cristolândia:</label>
                <input type="text" id="responsavelCristolandia" placeholder="Nome do responsável">
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="email" placeholder="email@exemplo.com">
            </div>
            <div class="form-group">
                <label>Número de Contato:</label>
                <input type="tel" id="contato" placeholder="(00) 00000-0000">
            </div>
            <div class="form-group">
                <label>Quantidade de Panetones:</label>
                <div class="flavor-inputs">
                    <div class="flavor-input-group">
                        <label>Chocolate:</label>
                        <input type="number" id="chocolateQty" value="0" min="0">
                    </div>
                    <div class="flavor-input-group">
                        <label>Frutas:</label>
                        <input type="number" id="frutasQty" value="0" min="0">
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h3>Informações de Entrega e Pagamento</h3>
                <div class="checkbox-group">
                    <input type="checkbox" id="entregue">
                    <label for="entregue">Panetones foram entregues?</label>
                </div>
                <div class="form-group">
                    <label>Forma de Pagamento:</label>
                    <select id="formaPagamento">
                        <option value="nao_pago">Não Pago</option>
                        <option value="pix">PIX</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="boleto">Boleto</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Observações:</label>
                <textarea id="observacao" placeholder="Observações adicionais (opcional)"></textarea>
            </div>
            <button onclick="addSale()">Confirmar Venda</button>
            <button class="btn-back" onclick="closeModal()">Cancelar</button>
        `;
    } else {
        saleForm.innerHTML = `
            <div class="form-group">
                <label>Nome da Pessoa:</label>
                <input type="text" id="buyerName" placeholder="Digite o nome">
            </div>
            <div class="form-group">
                <label>Quantidade de Panetones:</label>
                <div class="flavor-inputs">
                    <div class="flavor-input-group">
                        <label>Chocolate:</label>
                        <input type="number" id="chocolateQty" value="0" min="0">
                    </div>
                    <div class="flavor-input-group">
                        <label>Frutas:</label>
                        <input type="number" id="frutasQty" value="0" min="0">
                    </div>
                </div>
            </div>
            <button onclick="addSale()">Confirmar Venda</button>
            <button class="btn-back" onclick="closeModal()">Cancelar</button>
        `;
    }
    document.getElementById('addSaleModal').classList.add('active');
}

// Fechar modal
function closeModal() {
    document.getElementById('addSaleModal').classList.remove('active');
}

// Adicionar venda e descontar automaticamente do estoque
function addSale() {
    const unit = salesData[currentUnit];
    const chocolateQty = parseInt(document.getElementById('chocolateQty').value) || 0;
    const frutasQty = parseInt(document.getElementById('frutasQty').value) || 0;

    if (chocolateQty === 0 && frutasQty === 0) {
        alert('Por favor, informe a quantidade de pelo menos um sabor!');
        return;
    }
    if (unit.chocolate < chocolateQty) {
        alert(`Estoque insuficiente! Restam apenas ${unit.chocolate} panetones de chocolate.`);
        return;
    }
    if (unit.frutas < frutasQty) {
        alert(`Estoque insuficiente! Restam apenas ${unit.frutas} panetones de frutas.`);
        return;
    }

    let saleData = { chocolateQty, frutasQty, date: new Date().toLocaleString('pt-BR'), unit: currentUnit };

    if (currentUnit === 'cristolandia') {
        const igreja = document.getElementById('igreja').value.trim();
        const responsavelIgreja = document.getElementById('responsavelIgreja').value.trim();
        const responsavelCristolandia = document.getElementById('responsavelCristolandia').value.trim();
        const email = document.getElementById('email').value.trim();
        const contato = document.getElementById('contato').value.trim();
        const entregue = document.getElementById('entregue').checked;
        const formaPagamento = document.getElementById('formaPagamento').value;
        const observacao = document.getElementById('observacao').value.trim();

        if (!igreja || !responsavelIgreja || !responsavelCristolandia || !email || !contato) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }

        saleData = { ...saleData, igreja, responsavelIgreja, responsavelCristolandia, email, contato, entregue, formaPagamento, observacao };
    } else {
        const buyerName = document.getElementById('buyerName').value.trim();
        if (!buyerName) { alert('Por favor, digite o nome da pessoa!'); return; }
        saleData.buyer = buyerName;
    }

    // Desconta automaticamente
    unit.chocolate -= chocolateQty;
    unit.frutas -= frutasQty;
    unit.sales.push(saleData);
    saveData();
    updateStats();
    closeModal();
    alert('Venda registrada com sucesso!');
}

// Mostrar histórico
function showHistory() {
    const historyList = document.getElementById('historyList');
    const sales = salesData[currentUnit].sales;

    if (currentUnit === 'cristolandia') document.getElementById('searchBoxContainer').style.display = 'block';
    else document.getElementById('searchBoxContainer').style.display = 'none';

    if (sales.length === 0) historyList.innerHTML = '<p class="no-results">Nenhuma venda registrada ainda.</p>';
    else renderHistory(sales);

    document.getElementById('historyModal').classList.add('active');
}

// Renderizar histórico
function renderHistory(sales) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = sales.slice().reverse().map((sale, index) => {
        const realIndex = sales.length - 1 - index;
        const totalQty = sale.chocolateQty + sale.frutasQty;
        const totalValue = totalQty * PANETTONE_PRICE;

        let html = `<div class="history-item" data-search-text="${currentUnit==='cristolandia'?sale.igreja.toLowerCase():''}">`;
        if (currentUnit === 'cristolandia') {
            const pagamentoLabel = { pix: 'PIX', dinheiro: 'Dinheiro', boleto: 'Boleto', nao_pago: 'Não Pago' };
            html += `<strong>Igreja: ${sale.igreja}</strong>
                     <div class="history-detail">Responsável Igreja: ${sale.responsavelIgreja}</div>
                     <div class="history-detail">Responsável Cristolândia: ${sale.responsavelCristolandia}</div>
                     <div class="history-detail">Email: ${sale.email}</div>
                     <div class="history-detail">Contato: ${sale.contato}</div>
                     <div class="history-detail">Chocolate: ${sale.chocolateQty} | Frutas: ${sale.frutasQty} | Total: ${totalQty} panetones</div>
                     <div class="history-detail" style="color:#11998e;font-weight:bold;">Valor Total: R$ ${totalValue.toFixed(2).replace('.',',')}</div>
                     <div class="detail-section">
                         <div class="history-detail">Entrega: <span class="status-badge ${sale.entregue?'status-entregue':'status-nao-entregue'}">${sale.entregue?'Entregue':'Não Entregue'}</span></div>
                         <div class="history-detail">Pagamento: <span class="status-badge ${sale.formaPagamento!=='nao_pago'?'status-pago':'status-nao-pago'}">${pagamentoLabel[sale.formaPagamento]}</span></div>
                     </div>
                     ${sale.observacao?`<div class="observation-box">📝 ${sale.observacao}</div>`:''}
                     <button class="btn-edit" onclick="editSale(${realIndex})">✏️ Editar</button>`;
        } else {
            html += `<strong>${sale.buyer}</strong>
                     <div class="history-detail">Chocolate: ${sale.chocolateQty} | Frutas: ${sale.frutasQty} | Total: ${totalQty} panetones</div>
                     <div class="history-detail" style="color:#11998e;font-weight:bold;">Valor Total: R$ ${totalValue.toFixed(2).replace('.',',')}</div>
                     <button class="btn-edit" onclick="editSale(${realIndex})">✏️ Editar</button>`;
        }

        html += '</div>';
        return html;
    }).join('');
}

// Fechar histórico
function closeHistoryModal() {
    document.getElementById('historyModal').classList.remove('active');
}

// Filtrar histórico por igreja
function filterHistory() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.history-item').forEach(item => {
        const text = item.getAttribute('data-search-text');
        item.style.display = text.includes(input) ? 'block' : 'none';
    });
}

// Editar venda
function editSale(index) {
    editingSaleIndex = index;
    const unit = salesData[currentUnit];
    const sale = unit.sales[index];
    const editSaleForm = document.getElementById('editSaleForm');

    if (currentUnit === 'cristolandia') {
        editSaleForm.innerHTML = `
            <div class="form-group">
                <label>Igreja:</label>
                <input type="text" id="igreja" value="${sale.igreja}">
            </div>
            <div class="form-group">
                <label>Responsável da Igreja:</label>
                <input type="text" id="responsavelIgreja" value="${sale.responsavelIgreja}">
            </div>
            <div class="form-group">
                <label>Responsável da Cristolândia:</label>
                <input type="text" id="responsavelCristolandia" value="${sale.responsavelCristolandia}">
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="email" value="${sale.email}">
            </div>
            <div class="form-group">
                <label>Contato:</label>
                <input type="tel" id="contato" value="${sale.contato}">
            </div>
            <div class="form-group">
                <label>Chocolate:</label>
                <input type="number" id="chocolateQty" value="${sale.chocolateQty}" min="0">
            </div>
            <div class="form-group">
                <label>Frutas:</label>
                <input type="number" id="frutasQty" value="${sale.frutasQty}" min="0">
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="entregue" ${sale.entregue?'checked':''}>
                <label for="entregue">Entregue?</label>
            </div>
            <div class="form-group">
                <label>Pagamento:</label>
                <select id="formaPagamento">
                    <option value="nao_pago" ${sale.formaPagamento==='nao_pago'?'selected':''}>Não Pago</option>
                    <option value="pix" ${sale.formaPagamento==='pix'?'selected':''}>PIX</option>
                    <option value="dinheiro" ${sale.formaPagamento==='dinheiro'?'selected':''}>Dinheiro</option>
                    <option value="boleto" ${sale.formaPagamento==='boleto'?'selected':''}>Boleto</option>
                </select>
            </div>
            <div class="form-group">
                <label>Observação:</label>
                <textarea id="observacao">${sale.observacao||''}</textarea>
            </div>
            <button onclick="saveEditedSale()">Salvar Alterações</button>
            <button class="btn-back" onclick="closeEditModal()">Cancelar</button>
            <button class="btn-danger" onclick="confirmDeleteSale(${index})">🗑️ Excluir Venda</button>

        `;
    } else {
        editSaleForm.innerHTML = `
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="buyerName" value="${sale.buyer}">
            </div>
            <div class="form-group">
                <label>Chocolate:</label>
                <input type="number" id="chocolateQty" value="${sale.chocolateQty}" min="0">
            </div>
            <div class="form-group">
                <label>Frutas:</label>
                <input type="number" id="frutasQty" value="${sale.frutasQty}" min="0">
            </div>
            <button onclick="saveEditedSale()">Salvar Alterações</button>
            <button class="btn-back" onclick="closeEditModal()">Cancelar</button>
        `;
    }
    document.getElementById('editSaleModal').classList.add('active');
}

// Salvar venda editada
function saveEditedSale() {
    const unit = salesData[currentUnit];
    const sale = unit.sales[editingSaleIndex];

    const newChocolate = parseInt(document.getElementById('chocolateQty').value) || 0;
    const newFrutas = parseInt(document.getElementById('frutasQty').value) || 0;

    // Ajuste automático do estoque
    const chocolateDiff = sale.chocolateQty - newChocolate;
    const frutasDiff = sale.frutasQty - newFrutas;
    unit.chocolate += chocolateDiff;
    unit.frutas += frutasDiff;

    sale.chocolateQty = newChocolate;
    sale.frutasQty = newFrutas;

    if (currentUnit === 'cristolandia') {
        sale.igreja = document.getElementById('igreja').value.trim();
        sale.responsavelIgreja = document.getElementById('responsavelIgreja').value.trim();
        sale.responsavelCristolandia = document.getElementById('responsavelCristolandia').value.trim();
        sale.email = document.getElementById('email').value.trim();
        sale.contato = document.getElementById('contato').value.trim();
        sale.entregue = document.getElementById('entregue').checked;
        sale.formaPagamento = document.getElementById('formaPagamento').value;
        sale.observacao = document.getElementById('observacao').value.trim();
    } else {
        sale.buyer = document.getElementById('buyerName').value.trim();
    }

    saveData();
    updateStats();
    closeEditModal();
    showHistory();
}
 function confirmDeleteSale(index) {
    const senha = prompt("Digite a senha para excluir a venda:");
    if (senha !== STOCK_PASSWORD) {
        alert("❌ Senha incorreta. A exclusão foi cancelada.");
        return;
    }

    if (confirm("Tem certeza que deseja excluir esta venda? Isso irá devolver os panetones ao estoque.")) {
        const unit = salesData[currentUnit];
        const sale = unit.sales[index];

        // Devolve os panetones ao estoque
        unit.chocolate += sale.chocolateQty || 0;
        unit.frutas += sale.frutasQty || 0;

        // Remove a venda
        unit.sales.splice(index, 1);

        saveData();
        updateStats();
        closeEditModal();
        showHistory();

        alert("✅ Venda excluída com sucesso e estoque atualizado!");
    }
}

// Fechar modal de edição
function closeEditModal() {
    document.getElementById('editSaleModal').classList.remove('active');
}

// Voltar para seleção de unidades
function backToUnits() {
    document.querySelector('.unit-details').classList.remove('active');
    document.querySelector('.unit-selection').classList.add('active');
}

// Exportar Excel
function downloadExcel() {
    const unit = salesData[currentUnit];
    if (unit.sales.length === 0) { alert('Nenhuma venda registrada para exportar.'); return; }

    let headers = currentUnit === 'cristolandia'
        ? ["IGREJA","RESPONSÁVEL DA IGREJA","PANETONES DE FRUTA","PANETONES DE CHOCOLATE","TOTAL DE CAIXAS","VALOR TOTAL","CONTATO DO RESPONSÁVEL","SITUAÇÃO DO PAGAMENTO","E-MAIL","DATA QUE PEGOU","ENTREGUE (SIM/NÃO)","TIPO DE PAGAMENTO"]
        : ["NOME","PANETONES DE FRUTA","PANETONES DE CHOCOLATE","TOTAL DE CAIXAS","VALOR TOTAL","DATA QUE PEGOU"];

    let csvContent = headers.join(";") + "\n";

    unit.sales.forEach(sale => {
        if (currentUnit === 'cristolandia') {
            const total = sale.chocolateQty + sale.frutasQty;
            const totalValue = total * PANETTONE_PRICE;
            const entregue = sale.entregue ? 'SIM' : 'NÃO';
            csvContent += [
                sale.igreja,
                sale.responsavelIgreja,
                sale.frutasQty,
                sale.chocolateQty,
                total,
                `R$ ${totalValue.toFixed(2).replace('.',',')}`,
                sale.contato,
                sale.formaPagamento,
                sale.email,
                sale.date,
                entregue,
                sale.formaPagamento
            ].join(";") + "\n";
        } else {
            const total = sale.chocolateQty + sale.frutasQty;
            const totalValue = total * PANETTONE_PRICE;
            csvContent += [
                sale.buyer,
                sale.frutasQty,
                sale.chocolateQty,
                total,
                `R$ ${totalValue.toFixed(2).replace('.',',')}`,
                sale.date
            ].join(";") + "\n";
        }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${currentUnit}_vendas.csv`;
    link.click();
}

// Inicialização
loadData();
