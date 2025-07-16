import { Address, OrderItem, PaymentMethod } from "@/lib/definitions";
import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  orderId: string;
  orderNumber: string;
  orderItems: OrderItem[];
  total: number;
  shippingAddress?: Address;
  paymentMethod?: PaymentMethod;
}

export function EmailTemplate({
  firstName,
  orderId,
  orderNumber,
  orderItems,
  total,
  shippingAddress,
  paymentMethod,
}: EmailTemplateProps) {
  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Calculate total items count
  const totalItems = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <title>Order Confirmation</title>
              <!--[if mso]>
              <noscript>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
              </noscript>
              <![endif]-->
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.4; color: #333333;">
              <!-- Email Container -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <!-- Email Content -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                      <!-- Header -->
                      <tr>
                        <td style="padding: 40px 30px 20px 30px; background-color: #ffffff;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td>
                                <div style="font-size: 12px; color: #0284c7; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
                                  Payment Successful
                                </div>
                                <h1 style="font-size: 28px; font-weight: 300; text-transform: uppercase; letter-spacing: -0.025em; margin: 0 0 16px 0; color: #1f2937; line-height: 1.2;">
                                  Thanks for ordering, ${firstName}!
                                </h1>
                                <p style="font-size: 16px; color: #374151; line-height: 1.5; margin: 0;">
                                  Your order <span style="font-weight: 400; color: #0284c7;">#${orderNumber}</span> has been confirmed. We&apos;re processing it and will ship it to you shortly.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Order Items -->
                      <tr>
                        <td style="padding: 0 30px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            ${orderItems
                              .map((item, index) => {
                                // Find the selected image based on size and color
                                const selectedImage =
                                  item?.product?.sizes
                                    ?.find((size) => size.value === item.size)
                                    ?.colors?.find(
                                      (color) => color.name === item.color
                                    )?.images?.[0] ??
                                  item.product?.images?.[0] ??
                                  item.product?.bannerImage?.[0];

                                return `
                                <tr>
                                  <td style="padding: ${index === 0 ? "0 0 16px 0" : "16px 0"}; border-top: ${index === 0 ? "none" : "1px solid #e5e7eb"};">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                      <tr>
                                        <td width="80" style="vertical-align: top; padding-right: 16px;">
                                          ${
                                            selectedImage
                                              ? `
                                            <div style="position: relative; display: inline-block;">
                                              <img
                                                src="${selectedImage.formats.small.url}"
                                                alt="${item.product.name}"
                                                width="64"
                                                height="64"
                                                style="width: 64px; height: 64px; border: 1px solid #e5e7eb; border-radius: 6px; display: block;object-fit: cover;"
                                              />
                                              <div style="position: absolute; top: -8px; right: -8px; width: 20px; height: 20px; background-color: rgba(0, 0, 0, 0.7); color: white; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: 600;">
                                                ${item.quantity}
                                              </div>
                                            </div>
                                          `
                                              : ""
                                          }
                                        </td>
                                        <td style="vertical-align: top;">
                                          <div style="font-size: 14px; font-weight: 600; color: #1f2937; line-height: 1.2; margin-bottom: 4px;">
                                            ${item.product.name}
                                          </div>
                                          <div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">
                                            ${item.size} ${item.color ? `/ ${item.color}` : ""}
                                          </div>
                                          <div style="font-size: 12px; color: #6b7280;">
                                            ${formatPrice(item.price)}
                                          </div>
                                        </td>
                                        <td width="80" style="vertical-align: top; text-align: right;">
                                          <div style="font-size: 14px; font-weight: 600; color: #1f2937;">
                                            ${formatPrice(item.price * item.quantity)}
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              `;
                              })
                              .join("")}
                          </table>
                        </td>
                      </tr>

                      <!-- Order Summary -->
                      <tr>
                        <td style="padding: 0 30px 20px 30px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 16px 0; border-top: 1px solid #e5e7eb;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="font-size: 14px; font-weight: 600; color: #1f2937;">
                                      Subtotal · ${totalItems} items
                                    </td>
                                    <td style="text-align: right; font-size: 14px; font-weight: 600; color: #1f2937;">
                                      ${formatPrice(total)}
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="font-size: 14px; font-weight: 600; color: #1f2937;">
                                      Shipping fees
                                    </td>
                                    <td style="text-align: right; font-size: 14px; font-weight: 600; color: #1f2937;">
                                      Free
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="font-size: 18px; font-weight: 600; color: #1f2937;">
                                      Total
                                    </td>
                                    <td style="text-align: right; font-size: 18px; font-weight: 600; color: #1f2937;">
                                      ${formatPrice(total)}
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      ${
                        shippingAddress
                          ? `
                        <!-- Shipping Address -->
                        <tr>
                          <td style="padding: 0 30px 20px 30px; border-top: 1px solid #e5e7eb;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="padding: 16px 0;">
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                      <td width="140" style="vertical-align: top; font-weight: 500; color: #1f2937;">
                                        Shipping Address
                                      </td>
                                      <td style="vertical-align: top; text-align: right; color: #374151;">
                                        <div style="margin: 0; line-height: 1.4;">
                                          <div style="margin: 4px 0;">${shippingAddress.line1}</div>
                                          ${shippingAddress.line2 ? `<div style="margin: 4px 0;">${shippingAddress.line2}</div>` : ""}
                                          <div style="margin: 4px 0;">
                                            ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postal_code}, ${shippingAddress.country}
                                          </div>
                                          ${shippingAddress.contact ? `<div style="margin: 4px 0;">${shippingAddress.contact}</div>` : ""}
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      `
                          : ""
                      }

                      ${
                        paymentMethod
                          ? `
                        <!-- Payment Method -->
                        <tr>
                          <td style="padding: 0 30px 20px 30px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="padding: 16px 0;">
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                      <td width="140" style="vertical-align: top; font-weight: 500; color: #1f2937;">
                                        Payment information
                                      </td>
                                      <td style="vertical-align: top; text-align: right; color: #374151;">
                                        ${
                                          paymentMethod.type === "card" &&
                                          paymentMethod.card
                                            ? `
                                          <div style="margin: 0; line-height: 1.4;">
                                            <div style="margin: 4px 0;">${paymentMethod.card.brand}</div>
                                            <div style="margin: 4px 0;">Ending with ${paymentMethod.card.last4}</div>
                                            <div style="margin: 4px 0;">
                                              Expires ${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year.toString().slice(-2)}
                                            </div>
                                          </div>
                                        `
                                            : `
                                          <div style="margin: 4px 0;">Cash on Delivery</div>
                                        `
                                        }
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      `
                          : ""
                      }

                      <!-- Order Link -->
                      <tr>
                        <td style="padding: 0 30px 40px 30px; border-top: 1px solid #e5e7eb;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 20px 0 0 0;">
                                <p style="font-size: 16px; color: #374151; line-height: 1.5; margin: 0 0 16px 0;text-align: center;">
                                  You can view your complete order details at:
                                  <a
                                    href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}"
                                    style="color: #0284c7; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500;"
                                  >
                                    View Order
                                  </a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      }}
    />
  );
}
