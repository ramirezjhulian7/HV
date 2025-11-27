import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { useState } from 'react';
import profileImage from '../assets/profile.jpeg';
import styles from './ExportPDF.module.css';
import type { ExperienceItem, Skills, ContactInfo } from '../types';

export const ExportPDF = () => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      // 1. Initialize Document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Constants & Config
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      const primaryColor = '#00d4ff';
      const secondaryColor = '#7c3aed';
      const textColor = '#0a0e27';
      const textLightColor = '#555555';
      
      let cursorY = margin;

      // Helper: Add Page Break if needed
      const checkPageBreak = (heightNeeded: number) => {
        if (cursorY + heightNeeded > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
          return true;
        }
        return false;
      };

      // Helper: Draw Text with wrapping
      const drawText = (text: string, x: number, y: number, fontSize: number, color: string, fontStyle: 'normal' | 'bold' | 'italic' = 'normal', align: 'left' | 'center' | 'right' | 'justify' = 'left', maxWidth?: number) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(color);
        doc.setFont('helvetica', fontStyle);
        
        if (maxWidth) {
          const lines = doc.splitTextToSize(text, maxWidth);
          doc.text(lines, x, y, { align, maxWidth });
          return lines.length * (fontSize * 0.3527 * 1.2); // Return height used (approx conversion pt to mm)
        } else {
          doc.text(text, x, y, { align });
          return fontSize * 0.3527 * 1.2;
        }
      };

      // 2. Load Image
      const img = new Image();
      img.src = profileImage;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      // --- HEADER SECTION ---
      // Profile Image
      const imgSize = 35;
      doc.addImage(img, 'JPEG', margin, cursorY, imgSize, imgSize);
      
      // Draw circle border around image (simulated with lines or just a rect for now, circle is harder in raw jspdf without plugins, keeping it simple or using a rounded rect clip if possible, but standard addImage is rect. Let's draw a border rect)
      doc.setDrawColor(primaryColor);
      doc.setLineWidth(1);
      doc.rect(margin, cursorY, imgSize, imgSize);

      // Name & Title
      const textStartX = margin + imgSize + 10;
      let headerCursor = cursorY + 10;
      
      const name = t('name');
      const title = t('title');
      
      drawText(name, textStartX, headerCursor, 24, textColor, 'bold');
      headerCursor += 10;
      drawText(title, textStartX, headerCursor, 14, secondaryColor, 'bold');
      
      cursorY += imgSize + 10;

      // Separator
      doc.setDrawColor(primaryColor);
      doc.setLineWidth(0.5);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 10;

      // --- CONTACT INFO ---
      const contact: ContactInfo = {
        email: t('contact.email'),
        phone: t('contact.phone'),
        location: t('contact.location'),
        linkedin: t('contact.linkedin'),
      };

      const contactFontSize = 9;
      const colWidth = contentWidth / 2;
      
      // Row 1
      drawText(`Email: ${contact.email}`, margin, cursorY, contactFontSize, textColor);
      drawText(`Phone: ${contact.phone}`, margin + colWidth, cursorY, contactFontSize, textColor);
      cursorY += 6;
      
      // Row 2
      drawText(`Location: ${contact.location}`, margin, cursorY, contactFontSize, textColor);
      drawText(`LinkedIn: ${contact.linkedin}`, margin + colWidth, cursorY, contactFontSize, primaryColor);
      cursorY += 15;

      // --- PROFILE ---
      checkPageBreak(40);
      drawText(t('sections.profile') || 'Perfil Profesional', margin, cursorY, 12, primaryColor, 'bold');
      cursorY += 6;
      doc.setDrawColor(0, 0, 0, 0.1); // Light grey
      doc.line(margin, cursorY, pageWidth - margin, cursorY); // Underline section
      cursorY += 6;

      const profileText = t('profile');
      const profileHeight = drawText(profileText, margin, cursorY, 10, textColor, 'normal', 'justify', contentWidth);
      cursorY += profileHeight + 10;

      // --- SKILLS ---
      checkPageBreak(60);
      drawText(t('sections.skills'), margin, cursorY, 12, primaryColor, 'bold');
      cursorY += 6;
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 8;

      const skills = t('skills', { returnObjects: true }) as Skills;
      const skillKeys = Object.keys(skills) as (keyof Skills)[];
      
      let skillCol = 0; // 0 or 1
      let skillRowStartY = cursorY;
      
      skillKeys.forEach((key) => {
        const categoryTitle = t(`sections.${key}`);
        const categorySkills = skills[key];
        
        if (!Array.isArray(categorySkills)) return;

        // Check space for category block (approx)
        const blockHeight = 15 + (categorySkills.length / 2) * 5; // Rough estimate
        
        // If we are in col 0 and need break, do it. If col 1, we might need to reset Y
        if (skillCol === 0 && checkPageBreak(blockHeight)) {
           skillRowStartY = cursorY;
        }
        
        const xPos = skillCol === 0 ? margin : margin + colWidth;
        let localY = skillCol === 0 ? cursorY : skillRowStartY;

        // If col 1 and it doesn't fit, we might have an issue where col 0 is already drawn.
        // For simplicity in this linear script, let's just do a single column list if it's easier, 
        // OR strictly manage the two columns.
        // Let's try a simpler grid: Just flow them and wrap.
        
        // Actually, let's stick to a cleaner list for PDF
        // Category Title
        drawText(categoryTitle, xPos, localY, 10, secondaryColor, 'bold');
        localY += 5;
        
        // Skills string
        const skillsStr = categorySkills.join(', ');
        const skillsHeight = drawText(skillsStr, xPos, localY, 9, textLightColor, 'normal', 'left', colWidth - 5);
        
        localY += skillsHeight + 5;

        if (skillCol === 0) {
          skillRowStartY = localY; // Track where col 0 ended
          skillCol = 1;
        } else {
          cursorY = Math.max(cursorY, localY); // Advance main cursor to the lowest point
          skillCol = 0;
          // Add some spacing after the row
          if (skillCol === 0) cursorY += 2; 
        }
      });
      
      // Reset cursor if we ended on col 1
      if (skillCol === 1) cursorY = Math.max(cursorY, skillRowStartY) + 5;
      else cursorY += 5;


      // --- EXPERIENCE ---
      cursorY += 5;
      checkPageBreak(30);
      drawText(t('sections.experience'), margin, cursorY, 12, primaryColor, 'bold');
      cursorY += 6;
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 8;

      const experience = t('experience', { returnObjects: true }) as ExperienceItem[];

      experience.forEach((exp) => {
        // Calculate estimated height for this item to decide on page break
        // Title + Position + Desc + Highlights
        // This is hard to predict perfectly, but we can be conservative.
        const estimatedHeight = 40; // Min height
        checkPageBreak(estimatedHeight);

        // Company & Date
        drawText(exp.company, margin, cursorY, 11, textColor, 'bold');
        drawText(exp.period, pageWidth - margin, cursorY, 9, textLightColor, 'normal', 'right');
        cursorY += 5;

        // Position
        drawText(exp.position, margin, cursorY, 10, secondaryColor, 'bold');
        cursorY += 5;

        // Project
        if (exp.project) {
           drawText(`Project: ${exp.project}`, margin, cursorY, 9, textLightColor, 'italic');
           cursorY += 5;
        }

        // Description
        if (exp.description) {
          const descHeight = drawText(exp.description, margin, cursorY, 9, textColor, 'normal', 'justify', contentWidth);
          cursorY += descHeight + 3;
        }

        // Highlights
        exp.highlights.forEach((highlight) => {
          checkPageBreak(10); // Check for each bullet
          
          // Bullet point
          doc.setTextColor(secondaryColor);
          doc.text('•', margin + 2, cursorY);
          
          // Text
          const highlightHeight = drawText(highlight, margin + 6, cursorY, 9, textLightColor, 'normal', 'left', contentWidth - 10);
          cursorY += highlightHeight + 2;
        });

        cursorY += 8; // Spacing between items
      });

      // Metadata
      doc.setProperties({
        title: `${name} - Resume`,
        subject: 'Resume / CV',
        author: name,
        keywords: 'software, architect, developer, cv, resume',
        creator: 'Jhulian Resume App'
      });

      // Save
      const fileName = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
      doc.save(fileName);

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

