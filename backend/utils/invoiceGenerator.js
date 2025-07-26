import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateInvoice = async (payment) => {
  return new Promise((resolve, reject) => {
    try {
      // Create invoices directory if it doesn't exist
      const invoicesDir = path.join(process.cwd(), 'invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const filename = `invoice-${payment.invoiceNumber}.pdf`;
      const filepath = path.join(invoicesDir, filename);

      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });
      
      // Pipe to file
      doc.pipe(fs.createWriteStream(filepath));

      // Header
      doc.fontSize(20)
         .text('INVOICE', 50, 50)
         .fontSize(10)
         .text('LinkShortener Pro', 50, 80)
         .text('Your Business Address', 50, 95)
         .text('City, State, PIN', 50, 110)
         .text('Email: billing@linkshortener.com', 50, 125)
         .text('Phone: +91-XXXXXXXXXX', 50, 140);

      // Invoice details (right side)
      doc.fontSize(10)
         .text(`Invoice #: ${payment.invoiceNumber}`, 350, 80)
         .text(`Date: ${new Date(payment.paidAt).toLocaleDateString()}`, 350, 95)
         .text(`Transaction ID: ${payment.transactionId}`, 350, 110)
         .text(`Payment Method: ${payment.paymentMethod.toUpperCase()}`, 350, 125);

      // Customer details
      doc.fontSize(12)
         .text('Bill To:', 50, 180)
         .fontSize(10)
         .text(`Customer ID: ${payment.userId}`, 50, 200)
         .text(`Email: [Customer Email]`, 50, 215) // You might want to populate this from user data
         .text(`Payment Status: ${payment.status.toUpperCase()}`, 50, 230);

      // Line separator
      doc.moveTo(50, 260)
         .lineTo(550, 260)
         .stroke();

      // Table header
      doc.fontSize(12)
         .text('Description', 50, 280)
         .text('Amount (₹)', 450, 280);

      // Line separator
      doc.moveTo(50, 300)
         .lineTo(550, 300)
         .stroke();

      // Service details
      doc.fontSize(10)
         .text('LinkShortener Pro Subscription', 50, 320)
         .text('Duration: 1 Month', 50, 335)
         .text(`${payment.amount.toFixed(2)}`, 450, 320);

      // Line separator
      doc.moveTo(50, 360)
         .lineTo(550, 360)
         .stroke();

      // Total
      doc.fontSize(12)
         .text('Total Amount: ₹', 350, 380)
         .text(`${payment.amount.toFixed(2)}`, 450, 380);

      // Footer
      doc.fontSize(8)
         .text('Thank you for your business!', 50, 450)
         .text('This is a computer-generated invoice.', 50, 465)
         .text('For support, email: support@linkshortener.com', 50, 480);

      // Finalize PDF
      doc.end();

      // Return the file path/URL
      const invoiceUrl = `/invoices/${filename}`; // This would be your actual URL
      resolve(invoiceUrl);

    } catch (error) {
      reject(error);
    }
  });
};
