// Global Application Logic
$(document).ready(function () {
    // 1. Check Session
    const user = localStorage.getItem('alkeUser');
    if (!user) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }

    // Update UI with user info
    $('#userDisplay').text(`Hola, ${user}`);

    // Logout Logic
    $('#logoutBtn').click(function (e) {
        e.preventDefault();
        localStorage.removeItem('alkeUser');
        window.location.href = 'login.html';
    });

    // 2. Manage Balance
    // Initialize balance if not exists
    let balance = localStorage.getItem('alkeBalance');
    if (balance === null) {
        balance = 50000; // Starting Balance Simualtion
        localStorage.setItem('alkeBalance', balance);
    }

    // Format currency function
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    }

    // Update Balance Display
    $('#currentBalance').text(formatCurrency(balance));

    // 3. Transactions Mock Data
    let transactions = JSON.parse(localStorage.getItem('alkeTransactions')) || [];

    // Function to render recent transactions (limit 3 for menu)
    function renderRecentTransactions() {
        const container = $('#recentTransactions');
        container.empty();

        if (transactions.length === 0) {
            container.append('<div class="list-group-item text-center text-muted py-3">No hay movimientos recientes.</div>');
            return;
        }

        // Show last 3
        const recent = transactions.slice(-3).reverse();

        recent.forEach(t => {
            const icon = t.type === 'deposit' ? 'bi-arrow-down-circle text-success' : 'bi-send text-warning';
            const sign = t.type === 'deposit' ? '+' : '-';
            const color = t.type === 'deposit' ? 'text-success' : 'text-danger';

            const html = `
                <div class="list-group-item border-0 d-flex justify-content-between align-items-center py-3">
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-light p-2 me-3">
                            <i class="bi ${icon}"></i>
                        </div>
                        <div>
                            <h6 class="mb-0 text-dark">${t.description}</h6>
                            <small class="text-muted">${new Date(t.date).toLocaleDateString()}</small>
                        </div>
                    </div>
                    <span class="fw-bold ${color}">${sign} ${formatCurrency(t.amount)}</span>
                </div>
            `;
            container.append(html);
        });
    }

    if ($('#recentTransactions').length) {
        renderRecentTransactions();
    }
});
