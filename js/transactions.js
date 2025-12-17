// Transactions Logic - Handles history display
$(document).ready(function () {
    function loadTransactions() {
        const container = $('#allTransactions');
        const transactions = JSON.parse(localStorage.getItem('alkeTransactions')) || [];

        container.empty();

        if (transactions.length === 0) {
            container.html(`
                <div class="text-center py-5">
                    <i class="bi bi-inbox fs-1 text-muted opacity-50"></i>
                    <p class="text-muted mt-3">No hay transacciones registradas.</p>
                </div>
            `);
            return;
        }

        // Sort new to old
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        transactions.forEach(t => {
            const isDeposit = t.type === 'deposit';
            const icon = isDeposit ? 'bi-arrow-down-circle-fill text-success' : 'bi-send-fill text-warning';
            const sign = isDeposit ? '+' : '-';
            const color = isDeposit ? 'text-success' : 'text-danger'; // Standard red for expense
            const dateStr = new Date(t.date).toLocaleString('es-CL');

            const html = `
                <div class="list-group-item p-4 hover-bg-light transition-base">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <div class="fs-2 me-3 ${isDeposit ? 'text-success' : 'text-warning'}">
                                <i class="bi ${icon}"></i>
                            </div>
                            <div>
                                <h6 class="mb-1 text-dark fw-semibold">${t.description}</h6>
                                <small class="text-muted d-block">${dateStr}</small>
                                <span class="badge bg-light text-secondary border mt-1">${t.type === 'deposit' ? 'Ingreso' : 'Egreso'}</span>
                            </div>
                        </div>
                        <div class="text-end">
                            <h5 class="mb-0 fw-bold ${color}">${sign} ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(t.amount)}</h5>
                        </div>
                    </div>
                </div>
            `;
            container.append(html);
        });
    }

    loadTransactions();

    // Clear History Logic (Optional but useful for testing)
    $('#clearHistoryBtn').click(function () {
        if (confirm('¿Estás seguro de querer borrar todo el historial?')) {
            localStorage.removeItem('alkeTransactions');
            loadTransactions();
            // Also reset balance? Maybe not, just history.
        }
    });
});
