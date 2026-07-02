package com.erp.system.service;

import com.erp.system.entity.Invoice;
import com.erp.system.entity.SalesOrderItem;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    private byte[] generateQrCodeBytes(String text, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            return pngOutputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Could not generate QR Code", e);
        }
    }

    public byte[] generateInvoicePdf(Invoice invoice) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.DARK_GRAY);
            Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.GRAY);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 8, Color.DARK_GRAY);

            // Title
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Company & Invoice Metadata Table
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{1, 1});

            // Company Info
            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.addElement(new Paragraph("ERP MASTER DISTRIBUTION CO.", boldFont));
            leftCell.addElement(new Paragraph("100 Business Boulevard, Suite 500\nNew York, NY 10001\nGSTIN: 22AAAAA0000A1Z5", smallFont));
            headerTable.addCell(leftCell);

            // Invoice Info
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            rightCell.addElement(new Paragraph("Invoice ID: INV-" + invoice.getId(), boldFont));
            rightCell.addElement(new Paragraph("Sales Order ID: SO-" + invoice.getSalesOrder().getId(), normalFont));
            rightCell.addElement(new Paragraph("Date: " + invoice.getInvoiceDate().format(formatter), normalFont));
            rightCell.addElement(new Paragraph("Payment Status: " + invoice.getStatus().name(), boldFont));
            headerTable.addCell(rightCell);
            
            headerTable.setSpacingAfter(20);
            document.add(headerTable);

            // Divider
            Paragraph divider = new Paragraph("----------------------------------------------------------------------------------------------------------------------------------");
            divider.setSpacingAfter(15);
            document.add(divider);

            // Bill To
            Paragraph billToTitle = new Paragraph("BILL TO:", sectionTitleFont);
            billToTitle.setSpacingAfter(5);
            document.add(billToTitle);

            Paragraph customerInfo = new Paragraph();
            customerInfo.setFont(normalFont);
            customerInfo.add(new Chunk(invoice.getSalesOrder().getCustomer().getName() + "\n", boldFont));
            customerInfo.add("Email: " + invoice.getSalesOrder().getCustomer().getEmail() + "\n");
            customerInfo.add("Phone: " + invoice.getSalesOrder().getCustomer().getPhone() + "\n");
            customerInfo.add("Address: " + invoice.getSalesOrder().getCustomer().getAddress() + "\n");
            if (invoice.getSalesOrder().getCustomer().getGstin() != null && !invoice.getSalesOrder().getCustomer().getGstin().isEmpty()) {
                customerInfo.add("GSTIN: " + invoice.getSalesOrder().getCustomer().getGstin() + "\n");
            }
            customerInfo.setSpacingAfter(20);
            document.add(customerInfo);

            // Items Table
            PdfPTable itemsTable = new PdfPTable(5);
            itemsTable.setWidthPercentage(100);
            itemsTable.setWidths(new float[]{3, 1.5f, 1, 1.5f, 1.5f});
            
            // Header Row
            String[] headers = {"Item Name", "SKU", "Qty", "Unit Price", "Total"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, boldFont));
                cell.setBackgroundColor(new Color(240, 240, 240));
                cell.setPadding(8);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                itemsTable.addCell(cell);
            }

            // Data Rows
            for (SalesOrderItem item : invoice.getSalesOrder().getItems()) {
                itemsTable.addCell(new PdfPCell(new Phrase(item.getProduct().getName(), normalFont)));
                itemsTable.addCell(new PdfPCell(new Phrase(item.getProduct().getSku(), normalFont)));
                
                PdfPCell qtyCell = new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), normalFont));
                qtyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                itemsTable.addCell(qtyCell);

                PdfPCell priceCell = new PdfPCell(new Phrase("$" + String.format("%.2f", item.getUnitPrice()), normalFont));
                priceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                itemsTable.addCell(priceCell);

                double total = item.getUnitPrice() * item.getQuantity();
                PdfPCell totalCell = new PdfPCell(new Phrase("$" + String.format("%.2f", total), normalFont));
                totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                itemsTable.addCell(totalCell);
            }

            itemsTable.setSpacingAfter(15);
            document.add(itemsTable);

            // Footer Info & Summary Section Table
            PdfPTable bottomTable = new PdfPTable(2);
            bottomTable.setWidthPercentage(100);
            bottomTable.setWidths(new float[]{1.5f, 1});

            // QR Code Cell (Left)
            PdfPCell qrCell = new PdfPCell();
            qrCell.setBorder(Rectangle.NO_BORDER);
            qrCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            try {
                String qrText = String.format("Invoice ID: INV-%d\nTotal: $%.2f\nStatus: %s\nVerify at: http://localhost:3000/invoices",
                        invoice.getId(), invoice.getTotalPayable(), invoice.getStatus().name());
                byte[] qrBytes = generateQrCodeBytes(qrText, 100, 100);
                Image qrImage = Image.getInstance(qrBytes);
                qrImage.setAlignment(Element.ALIGN_LEFT);
                qrCell.addElement(qrImage);
                Paragraph qrLabel = new Paragraph("Scan to verify & pay online", smallFont);
                qrLabel.setSpacingBefore(3);
                qrCell.addElement(qrLabel);
            } catch (Exception e) {
                qrCell.addElement(new Paragraph("QR Code unavailable", smallFont));
            }
            bottomTable.addCell(qrCell);

            // Summary Cell (Right)
            PdfPCell summaryCell = new PdfPCell();
            summaryCell.setBorder(Rectangle.NO_BORDER);
            
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.setWidths(new float[]{1.5f, 1});

            summaryTable.addCell(new PdfPCell(new Phrase("Subtotal:", normalFont)));
            PdfPCell subtotalVal = new PdfPCell(new Phrase("$" + String.format("%.2f", invoice.getSalesOrder().getTotalAmount()), normalFont));
            subtotalVal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.addCell(subtotalVal);

            summaryTable.addCell(new PdfPCell(new Phrase("Tax (18% GST):", normalFont)));
            PdfPCell taxVal = new PdfPCell(new Phrase("$" + String.format("%.2f", invoice.getTaxAmount()), normalFont));
            taxVal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.addCell(taxVal);

            summaryTable.addCell(new PdfPCell(new Phrase("Total Payable:", boldFont)));
            PdfPCell totalVal = new PdfPCell(new Phrase("$" + String.format("%.2f", invoice.getTotalPayable()), boldFont));
            totalVal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.addCell(totalVal);

            summaryCell.addElement(summaryTable);
            bottomTable.addCell(summaryCell);

            bottomTable.setSpacingBefore(15);
            document.add(bottomTable);

            // Footer / Thank You Note
            Paragraph footer = new Paragraph("\n\nThank you for your business!", italicFont());
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    private Font italicFont() {
        return FontFactory.getFont(FontFactory.HELVETICA, 10, Font.ITALIC, Color.GRAY);
    }
}
