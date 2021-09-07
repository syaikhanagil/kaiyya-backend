const mongoose = require('mongoose');

const Order = mongoose.model('Order');
const OrderDetail = mongoose.model('OrderDetail');

const createOrder = (request, response) => {
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

const getOrder = (request, response) => {
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

const getOrders = (request, response) => {
    const { uid } = request.session;
    Order.find({
        account: uid
    }).populate('address order_detail').then((order) => {
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

const OrderController = {
    createOrder,
    getOrder,
    getOrders
};

module.exports = OrderController;
