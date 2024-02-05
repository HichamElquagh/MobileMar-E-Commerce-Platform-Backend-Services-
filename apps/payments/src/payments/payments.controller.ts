import {
  Controller,
  Post,
  Req,
  Body,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Request } from 'express';

@Controller('Payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('Stripe/:orderId')
  async StripeprocessPayment(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() paymantdata: CreatePaymentDto,
  ) {
    const payment = await this.paymentsService.StripeprocessPayment(
      orderId,
      paymantdata,
    );
    return { payment };
  }

  @Post('create-checkout-session')
  async ConfirmStripeprocessPayment(@Req() request: Request) {
    const payment = await this.paymentsService.CheckoutStripe();
    return { payment };
  }

  @Post('payment-status')
  async checkPaymentStatus(@Body() { sessionId }: { sessionId: string }) {
    console.log(sessionId);

    try {
      const paymentStatus =
        await this.paymentsService.checkPaymentStatus(sessionId);
      return { paymentStatus };
    } catch (error) {
      console.error('Error retrieving payment status:', error);
      return { paymentStatus: 'unknown' };
    }
  }

  @Post('Paypal/:orderId')
  async PaypalprocessPayment(@Param('orderId', ParseIntPipe) orderId: number) {
    const payment = await this.paymentsService.PaypalprocessPayment(orderId);
    return payment;
  }

  @Post('Paypal/Confirm_Payment/:orderId')
  async ConfirmPaypalprocessPayment(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body('token') token: string,
    @Body('ttoken') ttoken: string,
    @Req() request: Request,
  ) {
    const payment = await this.paymentsService.ConfirmPaypalprocessPayment(
      orderId,
      token,
      ttoken,
    );
    return payment;
  }
}
