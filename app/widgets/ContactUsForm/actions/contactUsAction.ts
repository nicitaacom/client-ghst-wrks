"use server"

import { businessInfo } from "@/consts/businessInfo"
import { Resend } from "resend"

export async function contactUsAction(firstName: string, phone: string, message: string): Promise<void | string> {
  // 1. Validate inputs
  if (!firstName || firstName.length < 2) return "Name must be at least 2 characters"
  if (!phone || !/^[+0-9\s]*$/.test(phone)) return "Invalid phone number"
  if (!message || message.length < 3) return "Message must be at least 3 characters"

  // 2. Initialize resend
  const resend = new Resend(process.env.RESEND_SECRET)

  try {
    await resend.emails.send({
      from: `notifications@${process.env.NEXT_PUBLIC_EMAIL_FROM_DOMAIN}`,
      to: businessInfo.email,
      subject: `New form submission`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>👻 New Ghost Contact</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #e5e5e5;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #404040; border-radius: 12px; overflow: hidden;">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, rgba(229,229,229,0.1), rgba(229,229,229,0.05)); padding: 24px 20px; text-align: center; position: relative; border-bottom: 1px solid #404040;">
                <div style="font-size: 32px; margin-bottom: 8px;">👻</div>
                <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #e5e5e5; text-shadow: 0 0 10px rgba(229,229,229,0.3);">Boo! New Ghost Message</h1>
                <div style="position: absolute; top: 10px; right: 20px; opacity: 0.1; font-size: 24px;">👻</div>
                <div style="position: absolute; bottom: 10px; left: 20px; opacity: 0.05; font-size: 16px;">👻</div>
              </div>
              
              <!-- Content -->
              <div style="padding: 20px; background-color: #0a0a0a; position: relative;">
                
                <!-- Floating spirits -->
                <div style="position: absolute; top: 20px; right: 30px; opacity: 0.1; font-size: 12px;">✨</div>
                <div style="position: absolute; bottom: 30px; left: 40px; opacity: 0.08; font-size: 10px;">✨</div>
                
                <!-- Contact Details -->
                <div style="background: linear-gradient(135deg, rgba(229,229,229,0.03), rgba(229,229,229,0.01)); border-radius: 8px; padding: 20px; margin-bottom: 16px; border: 1px solid rgba(229,229,229,0.1); box-shadow: 0 0 20px rgba(229,229,229,0.05);">
                  <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #e5e5e5; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">👻 Spirit Contact Info</h2>
                  
                  <div style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid rgba(229,229,229,0.1);">
                    <span style="color: #999999; font-size: 13px;">Haunting Name:</span>
                    <span style="color: #e5e5e5; font-size: 14px; margin-left: 12px; font-weight: 500; text-shadow: 0 0 5px rgba(229,229,229,0.2);">${firstName}</span>
                  </div>
                  
                  <div style="margin-bottom: 8px; padding: 8px 0;">
                    <span style="color: #999999; font-size: 13px;">Ethereal Phone:</span>
                    <span style="color: #e5e5e5; font-size: 14px; margin-left: 12px; font-weight: 500; font-family: 'Courier New', monospace; text-shadow: 0 0 5px rgba(229,229,229,0.2);">${phone}</span>
                  </div>
                </div>
                
                <!-- Message -->
                ${
                  message
                    ? `
                <div style="background: linear-gradient(135deg, rgba(229,229,229,0.03), rgba(229,229,229,0.01)); border-radius: 8px; padding: 20px; border: 1px solid rgba(229,229,229,0.1); box-shadow: 0 0 20px rgba(229,229,229,0.05); position: relative;">
                  <div style="position: absolute; top: 8px; right: 12px; opacity: 0.1; font-size: 16px;">💭</div>
                  <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #e5e5e5; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">👻 Ghost Message</h3>
                  <div style="background: rgba(229,229,229,0.02); padding: 16px; border-radius: 6px; border-left: 3px solid rgba(229,229,229,0.3);">
                    <p style="margin: 0; color: #e5e5e5; font-size: 14px; line-height: 1.6; text-shadow: 0 0 3px rgba(229,229,229,0.1);">${message}</p>
                  </div>
                </div>
                `
                    : ""
                }
                
              </div>
              
              <!-- Footer -->
              <div style="padding: 20px; text-align: center; border-top: 1px solid rgba(229,229,229,0.1); background: linear-gradient(135deg, rgba(229,229,229,0.02), rgba(229,229,229,0.01));">
                <div style="margin-bottom: 8px; opacity: 0.3; font-size: 20px;">👻 ✨ 👻</div>
                <p style="margin: 0; color: #666666; font-size: 12px; opacity: 0.7;">
                  A ghostly message has materialized from the spirit realm
                </p>
                <div style="margin-top: 8px; opacity: 0.1; font-size: 24px;">〜〜〜</div>
              </div>
              
            </div>
          </body>
        </html>
      `,
    })
  } catch (error) {
    if (error instanceof Error) return error.message
  }
}
