$(document).ready(function () {
    $('#depositForm').on('submit', function (e) {
        e.preventDefault();

        const amountInput = $('#depositAmount');
        const amount = parseFloat(amountInput.val());

        if (isNaN(amount) || amount <= 0) {
            showAlert('Por favor ingresa un monto válido.', 'danger');
            return;
        }

        // Processing Logic
        // 1. Get current balance
        let currentBalance = parseFloat(localStorage.getItem('alkeBalance')) || 0;

        // 2. Add amount
        let newBalance = currentBalance + amount;

        // 3. Save new balance
        localStorage.setItem('alkeBalance', newBalance);

        // 4. Record Transaction
        let transactions = JSON.parse(localStorage.getItem('alkeTransactions')) || [];
        const newTransaction = {
            id: Date.now(),
            type: 'deposit',
            amount: amount,
            date: new Date().toISOString(),
            description: 'Depósito de fondos'
        };
        transactions.push(newTransaction);
        localStorage.setItem('alkeTransactions', JSON.stringify(transactions));

        // 5. Success Feedback
        showAlert(`Has depositado $${amount.toLocaleString('es-CL')} exitosamente.`, 'success');
        amountInput.val('');

        // Update balance display in navbar/header if present (handled by main.js usually, but we can force update if element exists)
        if ($('#currentBalance').length) {
            $('#currentBalance').text(new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(newBalance));
        }
    });

    function showAlert(message, type) {
        const feedback = $('#feedbackMessage');
        feedback.removeClass('d-none alert-success alert-danger').addClass(`alert-${type}`).text(message);
    }
});
