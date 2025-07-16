import { EmailTemplate } from "@/components/email/EmailTemplate";
import { Address, OrderItem, PaymentMethod } from "@/lib/definitions";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailRequest {
  email: string;
  name: string;
  orderId: string;
  orderNumber: string;
  orderItems: OrderItem[];
  total: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
}

export async function POST(req: NextRequest) {
  try {
    const body: EmailRequest = await req.json();
    const {
      email,
      name,
      orderId,
      orderNumber,
      orderItems,
      total,
      shippingAddress,
      paymentMethod,
    } = body;

    // Validate required fields
    if (!email || !name || !orderId || !orderNumber || !orderItems || !total) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate orderItems is an array
    if (!Array.isArray(orderItems)) {
      return Response.json(
        { error: "orderItems must be an array" },
        { status: 400 }
      );
    }

    // Validate each order item has required fields
    for (const item of orderItems) {
      if (
        !item.product?.name ||
        !item.quantity ||
        !item.size ||
        item.price === undefined
      ) {
        return Response.json(
          {
            error:
              "Each order item must have productName, quantity, size, and price",
          },
          { status: 400 }
        );
      }
    }

    const { data, error } = await resend.emails.send({
      from: "Focal <onboarding@resend.dev>",
      to: [email],
      subject: `Order Confirmation - #${orderNumber}`,
      react: EmailTemplate({
        firstName: name,
        orderNumber: orderNumber,
        orderId: orderId,
        orderItems: orderItems,
        total: total,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
