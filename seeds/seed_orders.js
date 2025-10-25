exports.seed = async function(knex) {
    // Clear existing data
    await knex('orders').del();

    // Insert sample orders
    await knex('orders').insert([{
            orderId: 'ORD001',
            customerName: 'Lerato Mokoena',
            productOrdered: 'Cake',
            quantity: 2,
            orderDate: '2025-10-21',
            orderStatus: 'Pending'
        },
        {
            orderId: 'ORD002',
            customerName: 'Thabo Mphahlele',
            productOrdered: 'Bread',
            quantity: 5,
            orderDate: '2025-10-20',
            orderStatus: 'Completed'
        },
        {
            orderId: 'ORD003',
            customerName: 'Naledi Khoza',
            productOrdered: 'Muffin',
            quantity: 12,
            orderDate: '2025-10-19',
            orderStatus: 'Pending'
        }
    ]);
};