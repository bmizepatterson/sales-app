new Vue({

    el: "#root",

    data: {

        items: [],

        newItem: {
            description: '',
            qty: '',
            price: '',
            taxed: true
        },

        error: ''

    },

    computed: {

        grandSubtotal: function() {
            // let total = this.items.reduce((a, b) => { a + b.subtotal }, 0);
            let total = 0;

            for (let item of this.items) {
                total += parseFloat(item.subtotal);
            }

            return this.formatCurrency(total);
        },

        grandTaxAmount: function() {
            // let total = this.items.reduce((a, b) => { a + b.subtotal }, 0);
            let total = 0;

            for (let item of this.items) {
                total += parseFloat(item.taxAmount);
            }

            return this.formatCurrency(total);
        },

        grandTotal: function() {
            // let total = this.items.reduce((a, b) => { a + b.subtotal }, 0);
            let total = 0;

            for (let item of this.items) {
                total += parseFloat(item.total);
            }

            return this.formatCurrency(total);
        }

    },

    methods: {

        addItem: function() {
            // Reset any previous error messages
            this.error = '';

            // Validate user input
            let validItem = {
                description: this.validateDescription(this.newItem.description),
                qty: this.validateQty(this.newItem.qty),
                price: this.validatePrice(this.newItem.price),
                tax: this.newItem.taxed ? 0.06 : 0
            }

            if (!this.error) {

                // Push a COPY of the new item to the array
                this.items.push({
                    description: validItem.description,
                    qty:         validItem.qty,
                    price:       validItem.price,
                    tax:         this.formatCurrency(validItem.tax),
                    subtotal:    this.formatCurrency(validItem.qty * validItem.price),
                    taxAmount:   this.formatCurrency(validItem.qty * validItem.price * validItem.tax),
                    total:       this.formatCurrency(validItem.qty * validItem.price + (validItem.qty * validItem.price * validItem.tax))
                });

                // Reset the form
                this.newItem.description = '';
                this.newItem.qty = '';
                this.newItem.price = '';
                this.newItem.tax = 0;
            }
        },

        validateDescription: function(desc) {
            let candidate = desc.trim();
            if (candidate) {
                // No validation
                return candidate;
            }
            this.error = 'Please enter an item description.';
        },

        validateQty: function(qty) {
            let candidate = parseInt(qty);
            if (qty < 1 || qty > 999) {
                this.error = 'Please enter a valid quantity.';
                this.newItem.qty = '';
            } else {
                return candidate;
            }
        },

        validatePrice: function(price) {
            // Cast to a number
            let candidate = +price;

            if (isNaN(candidate)) {
                this.error = 'Please enter a valid unit price.';
                this.newItem.price = '';
            } else {
                return this.formatCurrency(candidate);
            }
        },

        formatCurrency: function(n) {
            n = +n;
            n = n.toFixed(2);
            if (n) return n;
            return '-';
        }

    }
});
