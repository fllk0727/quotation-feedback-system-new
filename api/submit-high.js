const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { rfq, price_diff } = req.body;
    const time = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

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
            subject: `【高价反馈通知】单号: ${rfq} - 高出目标价: ${price_diff}%`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 8px; background-color: #ffffff;">
                    <h3 style="color: #d9376e; margin-top: 0;">收到客户高价反馈！</h3>
                    <p><strong>报价单号 (RFQ No.):</strong> ${rfq}</p>
                    <p><strong>客户评估:</strong> <span style="color:red; font-weight:bold;">High Price</span></p>
                    <p><strong>高出目标价:</strong> <span style="font-size:16px; color:red; font-weight:bold;">${price_diff}%</span></p>
                    <p><strong>提交时间:</strong> ${time}</p>
                    <p style="font-size: 12px; color: #8c959f; margin-top: 20px;">此邮件由系统自动发出，请及时跟进客户。</p>
                </div>
            `
        });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("发送高价通知邮件失败:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};
