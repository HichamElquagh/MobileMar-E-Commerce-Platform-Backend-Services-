import { Injectable, NotFoundException } from '@nestjs/common';
const { PrismaClient } = require('@prisma/client');
import { CreatePaymentDto } from './dto/create-payment.dto';
import axios from 'axios';
import { log } from 'console';
import { ConfigService } from '@nestjs/config';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

@Injectable()

export class PaymentsService {
  
  constructor(private readonly configService: ConfigService) {}

  
  async StripeprocessPayment(orderId: number, paymentData: CreatePaymentDto) {
    try {
      
      const prisma = new PrismaClient();
      // Retrieve order from the database
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          customer: true,
          OrderItem: {
            include: {
              product: true,
            },
          },
        },
      });
      if (!order) {
        throw new NotFoundException(`Order with id ${orderId} not found.`);
      }


      // const paymentMethod = await stripe.paymentMethods.create({
      //   type: paymentData.type,
      //   card: paymentData.card,
      // });
      // return {paymentMethod}


      // if (paymentMethod.status === 'succeeded') {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(order.total * 100), // Stripe expects amount in cents
          currency: 'usd',
          payment_method: 'pm_card_visa', // paymentMethod.id,
          confirm: true,
          return_url: 'https://your-website.com/success', // Specify your success page URL
          metadata: {
            orderId: order.id.toString(),
            customerName: order.customer.name,
            productName: order.OrderItem.product.name,
          },
          
        });
        return paymentIntent

          // Check if payment intent is successful
      // if (paymentIntent.status === 'succeeded') {
      //   // Insert into the payment table
      //   const payment = await prisma.payment.create({
      //     data: {
      //       orderId: order.id,
      //       amount: order.total,
      //       currency: 'usd',
      //       method: 'stripe',
      //       status: paymentIntent.status,
      //       createdAt: new Date(),
      //     },
      //   });

      //   return payment;
      // }     
      // }
      // else {
      //   // Handle unsuccessful payment
      //   throw new Error(`Payment failed with status: ${paymentMethod.status}`);
      // }
      






    } catch (error) {
      return error.message;
    }
  }
  async CheckoutStripe (){
    
    const YOUR_DOMAIN = process.env.FRONTEND_URL;
    // Define your line items
const lineItems = [
  {
      price_data: {
          currency: 'usd', // Replace with your desired currency code
          product_data: {
              name: 'Prodct Name', // Replace with the name of your product
          },
          unit_amount: 9900, // Replace with the price in cents
      },
      quantity: 1, // Replace with the desired quantity
  },
];

// Create a new session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'], // You can specify the payment methods you accept
  line_items: lineItems,
  metadata: {
    order_id: '1',
  },
  mode: 'payment',
  success_url: `${YOUR_DOMAIN}success?sessionId={CHECKOUT_SESSION_ID}` ,
  cancel_url: `${YOUR_DOMAIN}?canceled=true`,
});

    return session
  }
  async checkPaymentStatus(  sessionId: string ) {
    console.log(sessionId);
    
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const paymentStatus = session;
      console.log(paymentStatus);
      
    
        const prisma = new PrismaClient();
        const payment = await prisma.payment.create({
          data: {
            orderId: parseInt(session.metadata.order_id),
            amount: session.amount_total,
            currency: session.currency,
            method: 'stripe',
            status: session.status,
            stripeOrId: session.payment_intent,
            createdAt: new Date(),
          },
        });
        console.log(payment);
        
         
      return { paymentStatus };
    } catch (error) {
      console.error('Error retrieving payment status:', error);
      return { paymentStatus: 'unknown' };
    }
  }

  async PaypalprocessPayment(orderId: number) {

    try {
      const clientId = process.env.PAYPAL_CLIENT_KEY;
    const clientSecret = process.env.PAYPAL_SECRET_KEY;
    const YOUR_DOMAIN = 'http://localhost:5173/';


    const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

    try {
      const response = await axios.post(
        'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: authHeader,
          },
        }
      );  
        if (response.data.access_token) {
          const token = response.data.access_token;
          try {
          const paypalOrder = await axios.post(
            "https://api-m.sandbox.paypal.com/v2/checkout/orders",
            {
              "intent": "CAPTURE",
              "purchase_units": [
                  {
                      "items": [
                          {
                              "name": "T-shirt",
                              "description": "Green XL",
                              "quantity": "1",
                              "unit_amount": {
                                  "currency_code": "USD",
                                  "value": "20.00"
                              }
                          }
                      ],
                      "amount": {
                          "currency_code": "USD",
                          "value": "20.00",
                          "breakdown": {
                              "item_total": {
                                  "currency_code": "USD",
                                  "value": "20.00"
                              }
                          }
                      }
                  }
              ],
              "application_context": {
                "return_url": `${YOUR_DOMAIN}success?orderId=${orderId}&ttoken=${token}`,
                "cancel_url": "https://example.com/cancel"
              }
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(paypalOrder.data);
          return paypalOrder.data;  
        } catch (error) {
          console.log(error.message);
        }
          
        }
    } catch (error) {
      console.log(error);
    }

   

    } catch (error) {
      return error.message;
    }
  }
  async ConfirmPaypalprocessPayment(orderId : number , token: string ,  ttoken: string) { 
  console.log("ddddddddddddddd");
  
    try {
      const prisma = new PrismaClient();
      const captureResponse = await axios.post(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ttoken}`,
          },
        }
      );  
      console.log(captureResponse.data);
      // return captureResponse.data;
      
      // Insert into the payment table

      const payment = await prisma.payment.create({
        data: {
          orderId: orderId,
          amount: captureResponse.data.purchase_units[0].payments.captures[0].amount.value,
          currency: captureResponse.data.purchase_units[0].payments.captures[0].amount.currency_code,
          method: 'paypal',
          status: captureResponse.status,
          paypalOrId: captureResponse.data.id,
          createdAt: new Date(),
        },
      });
      return captureResponse.data;
    } catch (error) {

      return error.message;
    }


}
}
