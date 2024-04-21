'use server';

import getConfig from 'next/config';
import { v4 as uuidv4 } from 'uuid';
import { generateAccessToken } from './generateAccessToken';
import { APP_NAME, APP_PRODUCTION_DOMAIN, subscriptionTierType } from '@/app/_lib/constants';
import { getTotalPriceForSubscription } from '@/app/_lib/helpers';
import { createOrder, updateToPaypalOrderId } from '../orders';
import { handleResponse } from '@/app/_lib/apiHelpers';

const { serverRuntimeConfig } = getConfig();

export async function createSubscription(product: subscriptionTierType, email: string) {
    try {
        const { jsonResponse, success } = await _createSubscription(product, email);
        if (success) {
            return jsonResponse;
        }
        throw new Error('Failed to create order:', jsonResponse);
    } catch (error) {
        throw new Error(`Failed to create order: ${error}`);
    }
}

/**
 * Create a subscription for the customer
 * @see https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_create
 */
const _createSubscription = async (product: subscriptionTierType, email: string) => {
    const { isYearly, totalPrice } = getTotalPriceForSubscription(product);
    const order = await createOrder(
        email,
        product.productId,
        Number(totalPrice)
    );
    const accessToken = await generateAccessToken();
    const { jsonResponse: createdPaypalProduct, success }
        = await createSubscriptionProduct(accessToken, product);
    if (success) {
        const { jsonResponse: createdPaypalBillingPlan, success: success2 }
            = await createSubscriptionBillingPlan(
                accessToken, product, createdPaypalProduct.id, isYearly, totalPrice
            );
        if (success2) {
            const response = await fetch(`${serverRuntimeConfig.PAYPAL_API_URL}/v1/billing/subscriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                    Prefer: 'return=representation',
                },
                body: JSON.stringify({
                    plan_id: createdPaypalBillingPlan.id,
                    application_context: {
                        user_action: 'SUBSCRIBE_NOW',
                        shipping_preference: 'NO_SHIPPING',
                    },
                }),
            });
            const {
                jsonResponse: subscriptionResponse,
                success: subSuccess,
            } = await handleResponse(response);
            if (subSuccess) {
                await updateToPaypalOrderId({
                    email,
                    createdOrderId: order.transactionId,
                    subscriptionId: subscriptionResponse.id,
                });
                return { jsonResponse: subscriptionResponse, success: subSuccess };
            }
            throw new Error('Failed to create subscription', subscriptionResponse);
        }
        throw new Error('Failed to create the billing plan', createdPaypalBillingPlan);
    }
    throw new Error('Failed to create the product', createdPaypalProduct);
};

async function createSubscriptionProduct(accessToken: string, product: subscriptionTierType) {
    const response = await fetch('https://api-m.sandbox.paypal.com/v1/catalogs/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'PayPal-Request-Id': uuidv4(),
        },
        body: JSON.stringify({
            name: `${APP_NAME} ${product.title}`,
            description: `${APP_NAME} ${product.title}`,
            type: 'SERVICE',
            category: 'SOFTWARE',
            // image_url: 'https://example.com/streaming.jpg',
            home_url: APP_PRODUCTION_DOMAIN,
        }),
    });
    return handleResponse(response);
}

async function createSubscriptionBillingPlan(
    accessToken: string,
    product: subscriptionTierType,
    paypalProductId: string,
    isYearly: boolean,
    totalPrice: number
) {
    const response = await fetch('https://api-m.sandbox.paypal.com/v1/billing/plans', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'PayPal-Request-Id': uuidv4(),
        },
        body: JSON.stringify({
            product_id: paypalProductId,
            name: `${APP_NAME} ${product.title}`,
            description: `${APP_NAME} ${product.title}`,
            billing_cycles: [
                {
                    frequency: {
                        interval_unit: isYearly ? 'YEAR' : 'MONTH',
                        interval_count: 1,
                    },
                    tenure_type: 'REGULAR',
                    sequence: 1,
                    // total_cycles: 12,
                    pricing_scheme: {
                        fixed_price: {
                            value: totalPrice,
                            currency_code: 'EUR',
                        },
                    },
                },
            ],
            payment_preferences: {
                auto_bill_outstanding: true,
                // setup_fee: {
                //     value: '10',
                //     currency_code: 'EUR',
                // },
                // setup_fee_failure_action: 'CONTINUE',
                payment_failure_threshold: 1,
            },
            // taxes: {
            //     percentage: '10',
            //     inclusive: false,
            // },
        }),
    });
    return handleResponse(response);
}
