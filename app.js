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
        defaultTaxRate: 0.06,
        error: '',
        hover: null
    },

    created: function() {
        if (sessionStorage.sales) {
            this.items = JSON.parse(sessionStorage.sales);
        }
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
                qty:         this.validateQty(this.newItem.qty),
                price:       this.validatePrice(this.newItem.price),
                taxRate:     this.newItem.taxed ? this.defaultTaxRate : 0
            }

            if (!this.error) {

                // Push a COPY of the new item to the array
                this.items.push({
                    description: validItem.description,
                    qty:         validItem.qty,
                    price:       validItem.price,
                    taxRate:     this.formatCurrency(validItem.taxRate),
                    subtotal:    this.formatCurrency(validItem.qty * validItem.price),
                    taxAmount:   this.formatCurrency(validItem.qty * validItem.price * validItem.taxRate),
                    total:       this.formatCurrency(validItem.qty * validItem.price + (validItem.qty * validItem.price * validItem.taxRate))
                });

                this.clearForm();
                this.saveToSession();
                this.$refs.itemInput.focus();
            }
        },

        validateDescription: function(desc) {
            let candidate = desc.trim();
            if (candidate) {
                // No validation
                return candidate;
            }
            this.error = 'Please enter an item description.';
            this.$refs.itemInput.focus();
        },

        validateQty: function(qty) {
            let candidate = parseInt(qty);
            if (qty < 1 || qty > 999) {
                this.error = 'Please enter a valid quantity.';
                this.newItem.qty = '';
                this.$refs.qtyInput.focus();
            } else {
                return candidate;
            }
        },

        validatePrice: function(price) {
            let candidate = price;
            if (!candidate) {
                // No empty strings!
                this.error = 'Please enter a unit price.';
            } else {
                // Cast to number
                candidate = +price;
                if (isNaN(candidate)) {
                    this.error = 'Please enter a valid unit price.';
                }
            }

            if (this.error) {
                this.newItem.price = '';
                this.$refs.priceInput.focus();
            } else {
                return this.formatCurrency(candidate);
            }
        },

        formatCurrency: function(n) {
            n = +n;             // Cast to a number
            n = n.toFixed(2);   // Fix to 2 decimal places
            if (n) return n;    // Return if > 0
            return '-';         // Return if 0
        },

        saveToSession: function() {
            sessionStorage.setItem('sales', JSON.stringify(this.items));
        },

        clearSale: function() {
            this.items = [];
            this.saveToSession();
        },

        clearForm: function() {
            this.newItem.description = this.newItem.qty = this.newItem.price = '';
            this.newItem.taxed = true;
        },

        deleteItem: function(index) {
            this.items.splice(index, 1);
            this.saveToSession();
        }
    }
});
