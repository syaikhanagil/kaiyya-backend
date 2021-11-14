const mongoose = require('mongoose');

const Order = mongoose.model('Order');
const OrderDetail = mongoose.model('OrderDetail');
const Product = mongoose.model('Product');
const Size = mongoose.model('Size');

const createOrder = (request, response) => {
    const { uid } = request.session;
    const { products, address, courierName, courierCode, courierService, courierCost, discount, notes, subtotal, point, shipment } = request.body;
    const invoiceCode = Math.floor(1000000 + Math.random() * 9000000);
    const newOrder = new Order({
        account: uid,
        address,
        external_id: `KIS-00${invoiceCode}`,
        discount,
        notes,
        point,
        courier: {
            name: courierName,
            code: courierCode,
            service: courierService,
            cost: courierCost
        },
        subtotal: subtotal + courierCost,
        shipment: {
            name: shipment.name,
            phone: shipment.phone,
            province: shipment.province,
            province_id: shipment.provinceId,
            city: shipment.city,
            city_id: shipment.cityId,
            subdistrict: shipment.subdistrict,
            subdistrict_id: shipment.subdistrictId,
            detail: shipment.detail
        }
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
            Product.findOne({
                _id: products[i].product.id
            }).then((product) => {
                // reducing stock
                const currentStock = product.stock;
                const newStock = currentStock - products[i].qty;
                if (newStock < 1) {
                    product.stock = 0;
                    product.save();
                    return;
                }
                product.stock = newStock;
                product.save();
            });
            Size.findOne({
                _id: products[i].size.id
            }).then((size) => {
                // reducing stock
                const currentStock = size.stock;
                const newStock = currentStock - products[i].qty;
                if (newStock < 1) {
                    size.stock = 0;
                    size.save();
                    return;
                }
                size.stock = newStock;
                size.save();
            });
            const newOrderDetail = new OrderDetail({
                order: order.id,
                product: products[i].product.id,
                qty: products[i].qty,
                size: products[i].size.id,
                price: products[i].size.price
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
                resi: orders[i].resi,
                address: orders[i].address,
                shipment: orders[i].shipment
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

const getOrderDetail = (request, response) => {
    const { orderId } = request.params;
    Order.findOne({
        _id: orderId
    })
        .populate({
            path: 'order_detail',
            model: 'OrderDetail',
            populate: {
                path: 'product',
                model: 'Product'
            }
        })
        .populate({
            path: 'order_detail',
            model: 'OrderDetail',
            populate: {
                path: 'size',
                model: 'Size'
            }
        })
        .populate('payment address')
        .sort('createdAt')
        .then((order) => {
            return response.status(200).json({
                status: true,
                message: 'successfully get order data',
                data: order
            });
        })
        .catch(() => {
            return response.status(200).json({
                status: false,
                message: 'failed to get order data'
            });
        });
};

const cancelOrder = (request, response) => {
    const { orderId } = request.params;
    Order.findOne({
        _id: orderId
    }).populate('order_detail').then((order) => {
        const detail = order.order_detail;
        for (let i = 0; i < detail.length; i++) {
            // return the reduced stock
            Size.findOne({
                _id: detail[i].size
            }).then((size) => {
                const currentStock = size.stock;
                const newStock = currentStock + detail[i].qty;
                size.stock = newStock;
                size.save();
            });
        }
        order.status = 'cancel';
        order.save();

        return response.status(200).json({
            status: true,
            message: 'successfully cancel order'
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'failed to cancel order'
        });
    });
};

const updateOrderStatus = (request, response) => {
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

const confirmOrder = (request, response) => {
    const { orderId } = request.params;
    Order.findOne({
        _id: orderId
    }).then((order) => {
        order.status = 'done';
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

const OrderController = {
    createOrder,
    getOrder,
    getOrderDetail,
    cancelOrder,
    updateOrderStatus,
    confirmOrder
};

module.exports = OrderController;
