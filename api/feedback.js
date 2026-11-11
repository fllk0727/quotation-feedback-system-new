const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    const { rfq, eval: evaluation } = req.query;
    if (!rfq || !evaluation) return res.status(400).send("参数不完整");

    const feedbackData = {
        rfq_no: rfq,
        evaluation: evaluation,
        time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    };

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
        await transporter.sendMail({
            from: `"报价反馈系统" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: `【一键反馈通知】单号: ${rfq} - 评估: ${evaluation}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 8px; background-color: #ffffff;">
                    <h3 style="color: #2b6cb0; margin-top: 0;">客户已完成一键报价反馈！</h3>
                    <p><strong>报价单号 (RFQ No.):</strong> ${rfq}</p>
                    <p><strong>客户评估 (Evaluation):</strong> <span style="color: #d97706; font-weight: bold;">${evaluation} Price</span></p>
                    <p><strong>提交时间:</strong> ${feedbackData.time}</p>
                    <p style="font-size: 12px; color: #8c959f; margin-top: 20px;">此邮件由系统自动发出，请及时跟进客户。</p>
                </div>
            `
        });
    } catch (err) {
        console.error("发送邮件失败:", err);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Feedback Successful - 感谢反馈</title>
            <style>
                body { font-family: -apple-system, sans-serif; background-color: #f6f8fa; color: #24292f; margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                .card { background: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; max-width: 400px; width: 90%; }
                h2 { color: #2ea44f; margin-top: 0; font-size: 26px; }
                p { color: #57606a; line-height: 1.5; font-size: 16px; }
                .badge { display: inline-block; background: #f1f8ff; color: #0969da; padding: 6px 12px; border-radius: 20px; font-weight: bold; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>Thank You!</h2>
                <p>您的反馈已成功提交！</p>
                <div class="badge">报价单号: ${rfq}</div>
                <p style="font-size: 14px; color: #656d76;">您对价格的评估 (<strong>${evaluation} Price</strong>) 已实时同步给我们的团队。</p>
            </div>
        </body>
        </html>
    `);
};
