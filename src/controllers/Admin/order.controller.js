const mongoose = require('mongoose');

const Account = mongoose.model('Account');
const Order = mongoose.model('Order');
const OrderDetail = mongoose.model('OrderDetail');
const Referral = mongoose.model('Referral');

exports.createOrder = (request, response) => {
    const {
        products,
        address,
        courierName,
        courierCode,
        courierService,
        courierCost,
        subtotal
    } = request.body;
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
        .populate('account address payment')
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

exports.getOrder = (request, response) => {
    Order.find()
        .populate('account address payment order_detail')
        .then((orders) => {
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
        })
        .catch(() => {
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
    })
        .populate('address payment order_detail')
        .then((orders) => {
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
        })
        .catch(() => {
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
    })
        .populate('address payment order_detail')
        .then((order) => {
            order.status = status;
            order.save();
            return response.status(200).json({
                status: true,
                message: 'successfully update order status'
            });
        })
        .catch(() => {
            return response.status(200).json({
                status: false,
                message: 'failed to update order status'
            });
        });
};

exports.cancelOrder = (request, response) => {
    const { orderId } = request.params;
    Order.findOne({
        _id: orderId
    })
        .then((order) => {
            order.status = 'cancel';
            order.save();
            return response.status(200).json({
                status: true,
                message: 'successfully cancel order'
            });
        })
        .catch(() => {
            return response.status(200).json({
                status: false,
                message: 'failed to cancel order'
            });
        });
};

exports.confirmOrder = (request, response) => {
    const { orderId } = request.params;

    const getProfit = (amount, downlineDiscount, discount) => {
        const hargaJual = amount * ((100 - downlineDiscount) / 100);
        const fee = hargaJual * (discount / 100);
        const result = parseInt(fee, 10);
        return Math.round(result);
    };

    Order.findOne({
        _id: orderId
    })
        .then((order) => {
            order.status = 'done';
            order.save();
            // Add referral profit
            Account.findOne({
                _id: order.account
            }).then((account) => {
                /**
                 * cari upline pertama
                 */
                if (account.referral_code !== 'none') {
                    Account.findOne({
                        username: account.referral_code
                    }).then((firstUpline) => {
                        firstUpline.addons.referral_point += getProfit(order.subtotal, account.addons.discount, firstUpline.addons.referral_profit);
                        firstUpline.save();

                        const firstReferral = new Referral({
                            account: firstUpline.id,
                            referral_account: account.id,
                            amount: getProfit(order.subtotal, account.addons.discount, firstUpline.addons.referral_profit)
                        });
                        firstReferral.save();
                        console.log('1');

                        /**
                         * cari upline kedua
                         */
                        if (firstUpline.referral_code !== 'none') {
                            Account.findOne({
                                username: firstUpline.referral_code
                            }).then((secondUpline) => {
                                secondUpline.addons.referral_point += getProfit(order.subtotal, firstUpline.addons.discount, secondUpline.addons.referral_profit);
                                secondUpline.save();
                                const secondReferral = new Referral({
                                    account: secondUpline.id,
                                    referral_account: firstUpline.id,
                                    amount: getProfit(order.subtotal, firstUpline.addons.discount, secondUpline.addons.referral_profit)
                                });
                                secondReferral.save();
                                console.log('2');

                                /**
                                 * cari upline ketiga
                                 */
                                if (secondUpline.referral_code !== 'none') {
                                    Account.findOne({
                                        username: secondUpline.referral_code
                                    }).then((thirdUpline) => {
                                        thirdUpline.addons.referral_point += getProfit(order.subtotal, secondUpline.addons.discount, thirdUpline.addons.referral_profit);
                                        thirdUpline.save();
                                        const thirdReferral = new Referral({
                                            account: thirdUpline.id,
                                            referral_account: secondUpline.id,
                                            amount: getProfit(order.subtotal, secondUpline.addons.discount, thirdUpline.addons.referral_profit)
                                        });
                                        thirdReferral.save();
                                        console.log('3');

                                        return response.status(200).json({
                                            status: true,
                                            message: 'payment succesfully paid, not have upline',
                                            data: order
                                        });
                                    });
                                } else {
                                    return response.status(200).json({
                                        status: true,
                                        message: 'payment succesfully paid, not have upline',
                                        data: order
                                    });
                                }
                            });
                        } else {
                            return response.status(200).json({
                                status: true,
                                message: 'payment succesfully paid, not have upline',
                                data: order
                            });
                        }
                    });
                } else {
                    return response.status(200).json({
                        status: true,
                        message: 'payment succesfully paid, not have upline',
                        data: order
                    });
                }
            });
        })
        .catch(() => {
            return response.status(200).json({
                status: false,
                message: 'failed to confirm order'
            });
        });
};

// exports.confirmOrder = (request, response) => {
//     const { orderId } = request.params;
//     Order.findOne({
//         _id: orderId
//     })
//         .then((order) => {
//             order.status = 'done';
//             order.save();
//             return response.status(200).json({
//                 status: true,
//                 message: 'successfully confirm order'
//             });
//         })
//         .catch(() => {
//             return response.status(200).json({
//                 status: false,
//                 message: 'failed to confirm order'
//             });
//         });
// };

exports.addOrderResi = (request, response) => {
    const { orderId } = request.params;
    const { resi } = request.body;
    Order.findOne({
        _id: orderId
    })
        .then((order) => {
            order.status = 'shipment';
            order.resi = resi;
            order.save();
            return response.status(200).json({
                status: true,
                message: 'successfully shipment order'
            });
        })
        .catch(() => {
            return response.status(200).json({
                status: false,
                message: 'failed to shipment order'
            });
        });
};
