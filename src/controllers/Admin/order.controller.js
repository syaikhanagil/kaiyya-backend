const mongoose = require('mongoose');

const Order = mongoose.model('Order');
const OrderDetail = mongoose.model('OrderDetail');

exports.createOrder = (request, response) => {
    const { products, address, courierName, courierCode, courierService, courierCost, subtotal } = request.body;
    const { uid } = request.session;
    const invoiceCode = Math.floor(1000000 + Math.random() * 9000000);

    const newOrder = new Order({
        account: uid,
        address,
        external_id: `KIS-00${invoiceCode}`,
        courier: {
            name: courierName,
            code: courierCode,
            service: courierService,
            cost: courierCost
        },
        subtotal
    });
    newOrder.save((err, order) => {
        if (err) {
            return response.status(400).json({
                status: false,
                message: 'failed to create order'
            });
        }
        const detailIds = [];
        for (let i = 0; i < products.length; i++) {
            const newOrderDetail = new OrderDetail({
                order: order.id,
                product: products[i].product.id,
                qty: products[i].qty,
                size: products[i].size.id
            });
            newOrderDetail.save((err2, detail) => {
                detailIds.push(detail.id);
                if (detailIds.length === products.length) {
                    order.order_detail = detailIds;
                    order.save();
                }
            });
        }
        return response.status(200).json({
            status: true,
            message: 'order created successfully',
            data: {
                id: order.id,
                external_id: order.external_id,
                subtotal: order.subtotal
            }
        });
    });
};

exports.getOrderDetail = (request, response) => {
    const { orderId } = request.params;
    Order.findOne({
        id: orderId
    }).populate('address payment order_detail').then((order) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get order data',
            data: order
        });
    }).catch(() => {
        return response.status(200).json({
            status: false,
            message: 'failed to get order data'
        });
    });
};

exports.getOrder = (request, response) => {
    Order.find().populate('account address payment order_detail').then((orders) => {
        const data = [];
        for (let i = 0; i < orders.length; i++) {
            const obj = {
                id: orders[i].id,
                account: orders[i].account,
                external_id: orders[i].external_id,
                courier: orders[i].courier,
                subtotal: orders[i].subtotal,
                status: orders[i].status,
                payment: orders[i].payment,
                order_detail: orders[i].order_detail,
                address: orders[i].address,
                createdAt: orders[i].createdAt
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get order data',
            data
        });
    }).catch(() => {
        return response.status(200).json({
            status: false,
            message: 'failed to get order data'
        });
    });
};

exports.getOrderByUser = (request, response) => {
    const { uid } = request.session;
    Order.find({
        account: uid
    }).populate('address payment order_detail').then((orders) => {
        const data = [];
        for (let i = 0; i < orders.length; i++) {
            const obj = {
                id: orders[i].id,
                external_id: orders[i].external_id,
                courier: orders[i].courier,
                subtotal: orders[i].subtotal,
                status: orders[i].status,
                payment: orders[i].payment,
                order_detail: orders[i].order_detail,
                address: orders[i].address,
                createdAt: orders[i].createdAt
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get order data',
            data
        });
    }).catch(() => {
        return response.status(200).json({
            status: false,
            message: 'failed to get order data'
        });
    });
};

exports.getOrderByAccountAndStatus = (request, response) => {
    const { accountId, status } = request.params;
    Order.find({
        account: accountId,
        status
    }).then((order) => {
        const data = [];
        for (let i = 0; i < order.length; i++) {
            const obj = {
                id: order[i].id,
                account: order[i].account,
                external_id: order[i].external_id,
                courier: order[i].courier,
                subtotal: order[i].subtotal,
                status: order[i].status,
                payment: order[i].payment,
                order_detail: order[i].order_detail,
                address: order[i].address
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get order data',
            data
        });
    });
};

exports.updateOrderStatus = (request, response) => {
    const { orderId } = request.params;
    const { status } = request.body;
    Order.findOne({
        id: orderId
    }).populate('address payment order_detail').then((order) => {
        order.status = status;
        order.save();
        return response.status(200).json({
            status: true,
            message: 'successfully update order status'
        });
    }).catch(() => {
        return response.status(200).json({
            status: false,
            message: 'failed to update order status'
        });
    });
};

exports.cancelOrder = (request, response) => {
    const { status } = request.body;
    Order.findOne().populate('address payment order_detail').then((order) => {
        order.status = status;
        order.save();
        return response.status(200).json({
            status: true,
            message: 'successfully update order status'
        });
    }).catch(() => {
        return response.status(200).json({
            status: false,
            message: 'failed to update order status'
        });
    });
};
