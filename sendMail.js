require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendEmail() {
    const rfqNo = "RFQ-44411";
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const highLink = `${baseUrl}/high-form.html?rfq=${rfqNo}`;
    const mediumLink = `${baseUrl}/api/feedback?rfq=${rfqNo}&eval=Medium`;
    const lowLink = `${baseUrl}/api/feedback?rfq=${rfqNo}&eval=Low`;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #1f2328; margin-top: 0;">Quotation Feedback</h2>
      <p style="color: #57606a;">Thank you for reviewing our quotation. Your feedback is valuable to us.</p>
      
      <p style="color: #1f2328;"><strong>Quotation No.:</strong> ${rfqNo} : Version-1 / 259270-1/259270-2</p>
      
      <p style="color: #1f2328; font-weight: bold;">1. How do you evaluate our quotation?</p>
      
      <div style="margin-bottom: 20px;">
        <a href="${highLink}" style="display: block; padding: 14px 16px; border: 1px solid #d0d7de; border-radius: 6px; text-decoration: none; color: #24292f; margin-bottom: 10px; background-color: #f8f9fa;">⚪ High Price (点击填写超出百分比)</a>
        <a href="${mediumLink}" style="display: block; padding: 14px 16px; border: 1px solid #0969da; background-color: #f1f8ff; border-radius: 6px; text-decoration: none; color: #24292f; margin-bottom: 10px; font-weight: bold;">🔵 Medium Price (点击直接提交)</a>
        <a href="${lowLink}" style="display: block; padding: 14px 16px; border: 1px solid #d0d7de; border-radius: 6px; text-decoration: none; color: #24292f; margin-bottom: 10px; background-color: #f8f9fa;">⚪ Low Price (点击直接提交)</a>
      </div>
    </div>
    `;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: { 
            user: process.env.SMTP_USER, 
            pass: process.env.SMTP_PASS 
        }
    });

    try {
        let info = await transporter.sendMail({
            from: `"Your Company" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: `Quotation Feedback - ${rfqNo}`,
            html: htmlContent
        });
        console.log("测试邮件发送成功！Message ID:", info.messageId);
    } catch (err) {
        console.error("邮件发送失败:", err);
    }
}

sendEmail();
