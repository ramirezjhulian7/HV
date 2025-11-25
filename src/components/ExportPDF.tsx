import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState } from 'react';
import profileImage from '../assets/profile.jpeg';
import styles from './ExportPDF.module.css';

export const ExportPDF = () => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

  const getBase64Image = (img: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
    }
    return canvas.toDataURL('image/png');
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      // Load and convert profile image to base64
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = profileImage;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      const profileImageBase64 = getBase64Image(img);

      // Create a temporary container for PDF content
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.width = '210mm'; // A4 width
      pdfContainer.style.background = '#ffffff';
      pdfContainer.style.padding = '20mm';
      pdfContainer.style.fontFamily = 'Inter, sans-serif';
      document.body.appendChild(pdfContainer);

      // Get translation data
      const name = t('name');
      const title = t('title');
      const profile = t('profile');
      const contact = {
        email: t('contact.email'),
        phone: t('contact.phone'),
        location: t('contact.location'),
        linkedin: t('contact.linkedin'),
      };
      const skills = t('skills', { returnObjects: true }) as any;
      const experience = t('experience', { returnObjects: true }) as any[];

      // Build PDF HTML content
      pdfContainer.innerHTML = `
        <div style="color: #1a1a1a;">
          <!-- Header with Profile Image -->
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 25px; border-bottom: 3px solid #00d4ff; padding-bottom: 20px;">
            <div style="flex-shrink: 0;">
              <img src="${profileImageBase64}" alt="${name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #00d4ff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
            </div>
            <div style="flex: 1;">
              <h1 style="margin: 0; font-size: 28px; color: #0a0e27; font-weight: 800;">${name}</h1>
              <h2 style="margin: 8px 0 0 0; font-size: 18px; color: #7c3aed; font-weight: 600;">${title}</h2>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 25px; font-size: 11px;">
            <div><strong>📧 Email:</strong> ${contact.email}</div>
            <div><strong>📱 Phone:</strong> ${contact.phone}</div>
            <div><strong>📍 Location:</strong> ${contact.location}</div>
            <div><strong>💼 LinkedIn:</strong> <span style="color: #00d4ff; font-size: 9px;">${contact.linkedin}</span></div>
          </div>

          <!-- Profile -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #00d4ff; font-size: 16px; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 12px;">Perfil Profesional</h3>
            <p style="font-size: 11px; line-height: 1.7; text-align: justify;">${profile}</p>
          </div>

          <!-- Skills -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #00d4ff; font-size: 16px; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 12px;">${t('sections.skills')}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 10px;">
              ${Object.keys(skills).map(key => `
                <div>
                  <strong style="color: #7c3aed; font-size: 11px;">${t(`sections.${key}`)}</strong>
                  <div style="margin-top: 5px;">
                    ${Array.isArray(skills[key]) ? skills[key].map((skill: string) => 
                      `<span style="display: inline-block; background: #f0f0f0; padding: 3px 8px; margin: 2px; border-radius: 10px; font-size: 9px;">${skill}</span>`
                    ).join('') : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Experience -->
          <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <h3 style="color: #00d4ff; font-size: 16px; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 12px;">${t('sections.experience')}</h3>
            ${experience.map((exp, index) => `
              <div style="margin-bottom: ${index === experience.length - 1 ? '0' : '20px'}; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <div>
                    <h4 style="margin: 0; font-size: 13px; color: #0a0e27; font-weight: 700;">${exp.company}</h4>
                    <p style="margin: 3px 0; font-size: 11px; color: #7c3aed; font-weight: 600;">${exp.position}</p>
                    <p style="margin: 3px 0; font-size: 10px; color: #666;">${exp.period}</p>
                  </div>
                  <div style="background: #f0f0ff; padding: 6px 12px; border-radius: 8px; text-align: right;">
                    <div style="font-size: 10px; font-weight: 600; color: #7c3aed;">${exp.project}</div>
                    ${exp.projectPeriod ? `<div style="font-size: 8px; color: #666;">${exp.projectPeriod}</div>` : ''}
                  </div>
                </div>
                ${exp.description ? `<p style="font-size: 10px; line-height: 1.6; margin-bottom: 8px; text-align: justify;">${exp.description}</p>` : ''}
                <ul style="margin: 0; padding-left: 18px; font-size: 10px; line-height: 1.6;">
                  ${exp.highlights.map((highlight: string) => 
                    `<li style="margin-bottom: 4px;">${highlight}</li>`
                  ).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Generate PDF
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      const fileName = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
      pdf.save(fileName);

      // Cleanup
      document.body.removeChild(pdfContainer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.button
      className={styles.exportButton}
      onClick={handleExportPDF}
      disabled={isExporting}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <span className={styles.icon}>
        {isExporting ? '⏳' : '📄'}
      </span>
      <span className={styles.text}>
        {isExporting ? t('exporting') : t('exportPDF')}
      </span>
    </motion.button>
  );
};
