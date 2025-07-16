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
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{ padding: "20px 0" }}
      >
        <tr>
          <td align="center">
            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              style={{
                maxWidth: "600px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <tr>
                <td
                  style={{
                    padding: "40px 30px 20px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#0284c7",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "12px",
                    }}
                  >
                    Payment Successful
                  </div>
                  <h1
                    style={{
                      fontSize: "28px",
                      fontWeight: "300",
                      margin: "0 0 16px 0",
                      color: "#1f2937",
                      lineHeight: "1.2",
                    }}
                  >
                    Thanks for your order, {firstName}!
                  </h1>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#374151",
                      lineHeight: "1.5",
                      margin: "0",
                    }}
                  >
                    Your order{" "}
                    <span style={{ fontWeight: "400", color: "#0284c7" }}>
                      #{orderNumber}
                    </span>{" "}
                    has been confirmed. We&apos;re processing it and will ship
                    it to you shortly.
                  </p>
                </td>
              </tr>

              {/* Order Items */}
              <tr>
                <td style={{ padding: "0 30px" }}>
                  {orderItems.map((item, index) => {
                    const selectedImage =
                      item?.product?.sizes
                        ?.find((size) => size.value === item.size)
                        ?.colors?.find((color) => color.name === item.color)
                        ?.images?.[0] ||
                      item.product?.images?.[0] ||
                      item.product?.bannerImage?.[0];

                    return (
                      <div
                        key={index}
                        style={{
                          padding: index === 0 ? "0 0 16px 0" : "16px 0",
                          borderTop: index === 0 ? "none" : "1px solid #e5e7eb",
                        }}
                      >
                        <table width="100%" cellPadding="0" cellSpacing="0">
                          <tr>
                            <td
                              width="80"
                              style={{
                                verticalAlign: "top",
                                paddingRight: "16px",
                              }}
                            >
                              {selectedImage && (
                                <img
                                  src={selectedImage.formats.small.url}
                                  alt={item.product.name}
                                  width="64"
                                  height="64"
                                  style={{
                                    width: "64px",
                                    height: "64px",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "6px",
                                    display: "block",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                            </td>
                            <td style={{ verticalAlign: "top" }}>
                              <div
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: "#1f2937",
                                  lineHeight: "1.2",
                                  marginBottom: "4px",
                                }}
                              >
                                {item.product.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  marginBottom: "2px",
                                }}
                              >
                                {item.size}{" "}
                                {item.color ? `/ ${item.color}` : ""}
                              </div>
                              <div
                                style={{ fontSize: "12px", color: "#6b7280" }}
                              >
                                {formatPrice(item.price)} × {item.quantity}
                              </div>
                            </td>
                            <td
                              width="80"
                              style={{
                                verticalAlign: "top",
                                textAlign: "right",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: "#1f2937",
                                }}
                              >
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    );
                  })}
                </td>
              </tr>

              {/* Order Summary */}
              <tr>
                <td style={{ padding: "0 30px 20px" }}>
                  <table
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    style={{
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: "16px",
                    }}
                  >
                    <tr>
                      <td style={{ paddingBottom: "8px" }}>
                        <table width="100%">
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#1f2937",
                              }}
                            >
                              Subtotal · {totalItems} items
                            </td>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#1f2937",
                                textAlign: "right",
                              }}
                            >
                              {formatPrice(total)}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#1f2937",
                                paddingTop: "8px",
                              }}
                            >
                              Shipping fees
                            </td>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#1f2937",
                                textAlign: "right",
                                paddingTop: "8px",
                              }}
                            >
                              Free
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#1f2937",
                                paddingTop: "8px",
                              }}
                            >
                              Total
                            </td>
                            <td
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#0284c7",
                                textAlign: "right",
                                paddingTop: "8px",
                              }}
                            >
                              {formatPrice(total)}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              {/* Shipping Address */}
              {shippingAddress && (
                <tr>
                  <td
                    style={{
                      padding: "0 30px 20px",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tr>
                        <td style={{ padding: "16px 0" }}>
                          <table width="100%">
                            <tr>
                              <td
                                style={{
                                  fontWeight: "500",
                                  color: "#1f2937",
                                  width: "50%",
                                  verticalAlign: "top",
                                }}
                              >
                                Shipping Address
                              </td>
                              <td
                                style={{
                                  color: "#374151",
                                  textAlign: "right",
                                  width: "50%",
                                  verticalAlign: "top",
                                }}
                              >
                                <div style={{ margin: "4px 0" }}>
                                  {shippingAddress.line1}
                                </div>
                                {shippingAddress.line2 && (
                                  <div style={{ margin: "4px 0" }}>
                                    {shippingAddress.line2}
                                  </div>
                                )}
                                <div style={{ margin: "4px 0" }}>
                                  {shippingAddress.city},{" "}
                                  {shippingAddress.state},{" "}
                                  {shippingAddress.postal_code},{" "}
                                  {shippingAddress.country}
                                </div>
                                {shippingAddress.contact && (
                                  <div style={{ margin: "4px 0" }}>
                                    {shippingAddress.contact}
                                  </div>
                                )}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              )}

              {/* Payment Method */}
              {paymentMethod && (
                <tr>
                  <td style={{ padding: "0 30px 20px" }}>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tr>
                        <td style={{ padding: "16px 0" }}>
                          <table width="100%">
                            <tr>
                              <td
                                style={{
                                  fontWeight: "500",
                                  color: "#1f2937",
                                  width: "50%",
                                  verticalAlign: "top",
                                }}
                              >
                                Payment information
                              </td>
                              <td
                                style={{
                                  color: "#374151",
                                  textAlign: "right",
                                  width: "50%",
                                }}
                              >
                                {paymentMethod.type === "card" &&
                                paymentMethod.card ? (
                                  <>
                                    <div style={{ margin: "4px 0" }}>
                                      {paymentMethod.card.brand}
                                    </div>
                                    <div style={{ margin: "4px 0" }}>
                                      Ending with {paymentMethod.card.last4}
                                    </div>
                                    <div style={{ margin: "4px 0" }}>
                                      Expires {paymentMethod.card.exp_month}/
                                      {paymentMethod.card.exp_year
                                        .toString()
                                        .slice(-2)}
                                    </div>
                                  </>
                                ) : (
                                  <div style={{ margin: "4px 0" }}>
                                    Cash on Delivery
                                  </div>
                                )}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              )}

              {/* Order Link */}
              <tr>
                <td
                  style={{
                    padding: "0 30px 40px",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <table width="100%" cellPadding="0" cellSpacing="0">
                    <tr>
                      <td style={{ padding: "20px 0 0", textAlign: "center" }}>
                        <a
                          href={`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`}
                          style={{
                            display: "block",
                            padding: "12px 24px",
                            backgroundColor: "#0284c7",
                            color: "#ffffff",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            fontWeight: "500",
                            letterSpacing: "0.1em",
                            borderRadius: "4px",
                            fontSize: "14px",
                          }}
                        >
                          View Order
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  );
}
