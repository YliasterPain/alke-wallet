$(document).ready(function () {
    // Initial Setup: Show balance in form
    const currentBalance = parseFloat(localStorage.getItem('alkeBalance')) || 0;
    $('#formBalance').text(new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(currentBalance));

    // Dummy Contacts Data
    const contacts = [
        { name: "Ana Pérez", email: "ana.perez@email.com", id: 1 },
        { name: "Carlos López", email: "carlos.lopez@email.com", id: 2 },
        { name: "Beatriz Gonzalez", email: "bea.gonzalez@email.com", id: 3 },
        { name: "David Ruiz", email: "david.ruiz@email.com", id: 4 },
        { name: "Elena Torres", email: "elena.torres@email.com", id: 5 }
    ];

    // Autocomplete Logic
    $('#contactInput').on('input', function () {
        const query = $(this).val().toLowerCase();
        const suggestionsBox = $('#contactSuggestions');
        suggestionsBox.empty().addClass('d-none');

        if (query.length > 0) {
            const matches = contacts.filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query));

            if (matches.length > 0) {
                suggestionsBox.removeClass('d-none');
                matches.forEach(contact => {
                    suggestionsBox.append(`
                        <button type="button" class="list-group-item list-group-item-action contact-item" data-name="${contact.name}">
                            <div class="d-flex justify-content-between">
                                <strong>${contact.name}</strong>
                                <small class="text-muted">${contact.email}</small>
                            </div>
                        </button>
                    `);
                });
            }
        }
    });

    // Select Contact
    $(document).on('click', '.contact-item', function () {
        const name = $(this).data('name');
        $('#contactInput').val(name);
        $('#contactSuggestions').addClass('d-none');
    });

    // Hide suggestions when clicking outside
    $(document).click(function (e) {
        if (!$(e.target).closest('#contactInput, #contactSuggestions').length) {
            $('#contactSuggestions').addClass('d-none');
        }
    });

    // Submit Transfer
    $('#sendMoneyForm').on('submit', function (e) {
        e.preventDefault();

        const contact = $('#contactInput').val();
        const amount = parseFloat($('#transferAmount').val());
        const balance = parseFloat(localStorage.getItem('alkeBalance')) || 0;

        // Validation
        if (!contact) {
            showAlert('Selecciona un contacto válido.', 'danger');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            showAlert('Ingresa un monto válido.', 'danger');
            return;
        }
        if (amount > balance) {
            showAlert('Fondos insuficientes.', 'danger');
            return;
        }

        // Process Transaction
        const newBalance = balance - amount;
        localStorage.setItem('alkeBalance', newBalance);

        // Record History
        let transactions = JSON.parse(localStorage.getItem('alkeTransactions')) || [];
        transactions.push({
            id: Date.now(),
            type: 'transfer',
            amount: amount,
            date: new Date().toISOString(),
            description: `Transferencia a ${contact}`
        });
        localStorage.setItem('alkeTransactions', JSON.stringify(transactions));

        // Feedback
        showAlert('Transferencia realizada con éxito!', 'success');
        $('#sendMoneyForm')[0].reset();

        // Update displayed balance
        $('#formBalance').text(new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(newBalance));
    });

    function showAlert(message, type) {
        const feedback = $('#feedbackMessage');
        feedback.removeClass('d-none alert-success alert-danger').addClass(`alert-${type}`).text(message);
    }
});
