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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const totalItems = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
      }}
      dangerouslySetInnerHTML={{
        __html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <title>Order Confirmation</title>
              <!--[if mso]>
              <style>
                td, th, div, p, a, h1, h2, h3 {
                  font-family: Arial, Helvetica, sans-serif !important;
                }
                .button-link {
                  padding: 12px 24px !important;
                }
              </style>
              <![endif]-->
              <style>
                @media only screen and (max-width: 600px) {
                  .responsive-table {
                    width: 100% !important;
                  }
                  .responsive-padding {
                    padding-left: 15px !important;
                    padding-right: 15px !important;
                  }
                  .stack-columns {
                    display: block !important;
                    width: 100% !important;
                  }
                  .button-link {
                  display: block !important;
                  width: 100% !important;
                  text-align: center !important;
                  box-sizing: border-box !important;
                }
                }
              </style>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.5; color: #333333; background-color: #f5f5f5;">
              <!-- Outlook wrapper table -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f5f5f5" style="background-color: #f5f5f5;">
                <tr>
                  <td align="center" valign="top">
                    <!--[if (gte mso 9)|(IE)]>
                    <table border="0" cellspacing="0" cellpadding="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    <table class="responsive-table" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; border-collapse: collapse;">
                      <!-- Header -->
                      <tr>
                        <td class="responsive-padding" style="padding: 30px 30px 15px 30px; background-color: #ffffff;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td>
                                <div style="font-size: 12px; color: #0284c7; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
                                  Payment Successful
                                </div>
                                <h1 style="font-size: 24px; font-weight: 300; margin: 0 0 12px 0; color: #1f2937; line-height: 1.3;">
                                  Thanks for your order, ${firstName}!
                                </h1>
                                <p style="font-size: 16px; color: #374151; margin: 0;">
                                  Your order <strong style="color: #0284c7;">#${orderNumber}</strong> has been confirmed. We're processing it and will ship it to you shortly.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Order Items -->
                      <tr>
                        <td class="responsive-padding" style="padding: 0 30px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            ${orderItems
                              .map((item, index) => {
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
                                  <td style="padding: ${
                                    index === 0 ? "15px 0" : "15px 0"
                                  }; border-top: ${
                                    index === 0 ? "none" : "1px solid #e5e7eb"
                                  };">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                      <tr>
                                        <td width="64" style="vertical-align: top; padding-right: 15px;">
                                          ${
                                            selectedImage
                                              ? `<img
                                                src="${selectedImage.formats.small.url}"
                                                alt="${item.product.name}"
                                                width="64"
                                                height="64"
                                                style="display: block; width: 64px; height: 64px; border: 1px solid #e5e7eb; border-radius: 4px; object-fit: cover;"
                                              />`
                                              : `<div style="width:64px; height:64px; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:4px;"></div>`
                                          }
                                        </td>
                                        <td style="vertical-align: top; padding-right: 10px;">
                                          <div style="font-size: 14px; font-weight: 600; color: #1f2937; line-height: 1.3; margin-bottom: 4px;">
                                            ${item.product.name}
                                          </div>
                                          <div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">
                                            ${item.size}${item.color ? ` / ${item.color}` : ""}
                                          </div>
                                          <div style="font-size: 12px; color: #6b7280;">
                                            ${formatPrice(item.price)} × ${
                                              item.quantity
                                            }
                                          </div>
                                        </td>
                                        <td width="80" style="vertical-align: top; text-align: right; font-size: 14px; font-weight: 600; color: #1f2937;">
                                          ${formatPrice(
                                            item.price * item.quantity
                                          )}
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
                        <td class="responsive-padding" style="padding: 0 30px 20px 30px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #e5e7eb;">
                            <tr>
                              <td style="padding: 16px 0 8px 0;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td width="50%" style="font-size:14px;font-weight:600;color:#1f2937; padding-bottom: 8px;">
                                      Subtotal · ${totalItems} items
                                    </td>
                                    <td width="50%" align="right" style="font-size:14px;font-weight:600;color:#1f2937; padding-bottom: 8px;">
                                      ${formatPrice(total)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="50%" style="font-size:14px;font-weight:600;color:#1f2937; padding-bottom: 8px;">
                                      Shipping fees
                                    </td>
                                    <td width="50%" align="right" style="font-size:14px;font-weight:600;color:#1f2937; padding-bottom: 8px;">
                                      Free
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="50%" style="font-size:18px;font-weight:600;color:#1f2937; padding-top: 8px;">
                                      Total
                                    </td>
                                    <td width="50%" align="right" style="font-size:18px;font-weight:600;color:#0284c7; padding-top: 8px;">
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
                          <td class="responsive-padding" style="padding: 0 30px 20px 30px; border-top: 1px solid #e5e7eb;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td style="padding: 16px 0;">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td class="stack-columns" width="50%" style="vertical-align: top; font-weight: 600; color: #1f2937; padding-bottom: 8px;">
                                        Shipping Address
                                      </td>
                                      <td class="stack-columns" width="50%" style="vertical-align: top; text-align: right; color: #374151; font-size: 14px; line-height: 1.4;">
                                        <div>${shippingAddress.line1}</div>
                                        ${
                                          shippingAddress.line2
                                            ? `<div>${shippingAddress.line2}</div>`
                                            : ""
                                        }
                                        <div>${shippingAddress.city}, ${
                                          shippingAddress.state
                                        }, ${shippingAddress.postal_code}</div>
                                        <div>${shippingAddress.country}</div>
                                        ${
                                          shippingAddress.contact
                                            ? `<div>${shippingAddress.contact}</div>`
                                            : ""
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

                      ${
                        paymentMethod
                          ? `
                        <!-- Payment Method -->
                        <tr>
                          <td class="responsive-padding" style="padding: 0 30px 20px 30px; border-top: ${
                            shippingAddress ? "none" : "1px solid #e5e7eb"
                          };">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td style="padding: 16px 0;">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td class="stack-columns" width="50%" style="vertical-align: top; font-weight: 600; color: #1f2937; padding-bottom: 8px;">
                                        Payment information
                                      </td>
                                      <td class="stack-columns" width="50%" style="vertical-align: top; text-align: right; color: #374151; font-size: 14px; line-height: 1.4;">
                                        ${
                                          paymentMethod.type === "card" &&
                                          paymentMethod.card
                                            ? `
                                          <div>${paymentMethod.card.brand}</div>
                                          <div>Ending with ${paymentMethod.card.last4}</div>
                                          <div>Expires ${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year
                                            .toString()
                                            .slice(-2)}</div>
                                        `
                                            : `
                                          <div>Cash on Delivery</div>
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
                        <td class="responsive-padding" style="padding: 0 30px 30px 30px; border-top: 1px solid #e5e7eb;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td align="center" style="padding: 20px 0 0 0;">
                                <a
                                  href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}"
                                  class="button-link"
                                  style="display: inline-block; padding: 12px 24px; background-color: #0284c7; color: #ffffff !important; text-decoration: none; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; border-radius: 4px; font-size: 14px;"
                                  target="_blank"
                                >
                                  View Order
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
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
