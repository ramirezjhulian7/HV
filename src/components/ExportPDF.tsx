import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { useState } from 'react';
import { FileDown, Loader } from 'lucide-react';
import profileImage from '../assets/profile.jpeg';
import styles from './ExportPDF.module.css';
import type { ExperienceItem, Skills } from '../types';

const COLORS = {
  sidebar: '#0f1629',
  sidebarLight: '#1a2340',
  accent: '#00d4ff',
  accentDark: '#0099bb',
  purple: '#7c3aed',
  white: '#ffffff',
  whiteOff: '#e2e8f0',
  whiteMuted: '#94a3b8',
  dark: '#0f172a',
  darkText: '#334155',
  darkMuted: '#64748b',
  lightBg: '#f8fafc',
  border: '#e2e8f0',
};

export const ExportPDF = () => {
  const { t, i18n } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const sidebarWidth = 65;
      const mainLeft = sidebarWidth + 10;
      const mainWidth = pageWidth - mainLeft - 12;
      const sidebarPadding = 8;
      const sidebarContentWidth = sidebarWidth - sidebarPadding * 2;

      let mainY = 18;
      let sidebarY = 0;
      let currentPage = 1;

      const drawSidebar = () => {
        doc.setFillColor(COLORS.sidebar);
        doc.rect(0, 0, sidebarWidth, pageHeight, 'F');
        doc.setFillColor(COLORS.sidebarLight);
        doc.rect(0, 0, sidebarWidth, 2, 'F');
      };

      const drawAccentBar = () => {
        doc.setFillColor(COLORS.accent);
        doc.rect(sidebarWidth, 0, 1.5, pageHeight, 'F');
      };

      const addNewPage = () => {
        doc.addPage();
        currentPage++;
        drawSidebar();
        drawAccentBar();
        mainY = 15;
        sidebarY = 15;
      };

      const checkMainBreak = (needed: number) => {
        if (mainY + needed > pageHeight - 12) {
          addNewPage();
          return true;
        }
        return false;
      };

      const drawSidebarSection = (title: string, y: number): number => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(COLORS.accent);
        doc.text(title.toUpperCase(), sidebarPadding, y);
        y += 2;
        doc.setDrawColor(COLORS.accent);
        doc.setLineWidth(0.3);
        doc.line(sidebarPadding, y, sidebarPadding + 20, y);
        return y + 4;
      };

      const drawSidebarText = (text: string, y: number, color = COLORS.whiteOff, size = 7.5, style: 'normal' | 'bold' = 'normal'): number => {
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        doc.setTextColor(color);
        const lines = doc.splitTextToSize(text, sidebarContentWidth);
        doc.text(lines, sidebarPadding, y);
        return y + lines.length * (size * 0.38);
      };

      const drawMainHeading = (text: string) => {
        checkMainBreak(14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(COLORS.dark);
        doc.text(text.toUpperCase(), mainLeft, mainY);
        mainY += 2;
        doc.setDrawColor(COLORS.accent);
        doc.setLineWidth(0.5);
        doc.line(mainLeft, mainY, mainLeft + 35, mainY);
        doc.setDrawColor(COLORS.border);
        doc.setLineWidth(0.15);
        doc.line(mainLeft + 35, mainY, mainLeft + mainWidth, mainY);
        mainY += 5;
      };

      const drawWrapped = (text: string, x: number, fontSize: number, color: string, maxW: number, style: 'normal' | 'bold' | 'italic' = 'normal', lineH = 1.25): number => {
        doc.setFont('helvetica', style);
        doc.setFontSize(fontSize);
        doc.setTextColor(color);
        const lines = doc.splitTextToSize(text, maxW);
        const lh = fontSize * 0.353 * lineH;
        for (const line of lines) {
          checkMainBreak(lh + 2);
          doc.text(line, x, mainY);
          mainY += lh;
        }
        return lines.length * lh;
      };

      // --- PAGE 1 ---
      drawSidebar();
      drawAccentBar();

      // Profile image
      const img = new Image();
      img.src = profileImage;
      await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });

      const imgSize = 40;
      const imgX = (sidebarWidth - imgSize) / 2;
      sidebarY = 16;

      const cx = imgX + imgSize / 2;
      const cy = sidebarY + imgSize / 2;
      const r = imgSize / 2;

      // Create circular image via offscreen canvas
      const canvasSize = 400;
      const canvas = document.createElement('canvas');
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext('2d')!;
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
      const circularImgData = canvas.toDataURL('image/png');

      // Accent ring behind photo
      doc.setFillColor(COLORS.accent);
      doc.circle(cx, cy, r + 1.5, 'F');

      // Place circular image
      doc.addImage(circularImgData, 'PNG', imgX, sidebarY, imgSize, imgSize);

      sidebarY += imgSize + 8;

      // Name in sidebar
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(COLORS.white);
      const nameLines = doc.splitTextToSize(t('name'), sidebarContentWidth);
      doc.text(nameLines, sidebarWidth / 2, sidebarY, { align: 'center' });
      sidebarY += nameLines.length * 5 + 2;

      // Title in sidebar
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(COLORS.accent);
      const titleLines = doc.splitTextToSize(t('title'), sidebarContentWidth);
      doc.text(titleLines, sidebarWidth / 2, sidebarY, { align: 'center' });
      sidebarY += titleLines.length * 3.5 + 8;

      // Divider
      doc.setDrawColor(COLORS.sidebarLight);
      doc.setLineWidth(0.3);
      doc.line(sidebarPadding, sidebarY, sidebarWidth - sidebarPadding, sidebarY);
      sidebarY += 6;

      // Contact section
      sidebarY = drawSidebarSection(t('pdf.contact'), sidebarY);

      const contactItems = [
        { label: t('contact.email') },
        { label: t('contact.phone') },
        { label: t('contact.location') },
        { label: t('pdf.linkedinShort') },
      ];

      for (const item of contactItems) {
        sidebarY = drawSidebarText(item.label, sidebarY, COLORS.whiteOff, 7);
        sidebarY += 1.5;
      }

      sidebarY += 4;

      // Skills in sidebar
      const skills = t('skills', { returnObjects: true }) as Skills;
      const skillKeys = Object.keys(skills) as (keyof Skills)[];

      for (const key of skillKeys) {
        const categorySkills = skills[key];
        if (!Array.isArray(categorySkills)) continue;

        if (sidebarY > pageHeight - 20) {
          // Skills overflow: continue on next page sidebar
          break;
        }

        sidebarY = drawSidebarSection(t(`sections.${key}`), sidebarY);

        for (const skill of categorySkills) {
          if (sidebarY > pageHeight - 8) break;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(COLORS.whiteMuted);
          doc.text(skill, sidebarPadding + 3, sidebarY);

          // Small dot
          doc.setFillColor(COLORS.accent);
          doc.circle(sidebarPadding + 0.8, sidebarY - 0.8, 0.6, 'F');
          sidebarY += 3.2;
        }
        sidebarY += 2;
      }

      // --- MAIN CONTENT ---

      // Profile section
      drawMainHeading(t('sections.profile'));
      drawWrapped(t('profile'), mainLeft, 9, COLORS.darkText, mainWidth, 'normal', 1.4);
      mainY += 6;

      // Experience section
      drawMainHeading(t('sections.experience'));
      const experience = t('experience', { returnObjects: true }) as ExperienceItem[];

      for (const exp of experience) {
        checkMainBreak(25);

        // Company row
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(COLORS.dark);
        doc.text(exp.company, mainLeft, mainY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(COLORS.darkMuted);
        doc.text(exp.period, mainLeft + mainWidth, mainY, { align: 'right' });
        mainY += 4;

        // Position
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(COLORS.purple);
        doc.text(exp.position, mainLeft, mainY);
        mainY += 4;

        // Project badge
        if (exp.project) {
          const projectLabel = `${t('pdf.project')}: ${exp.project}`;
          const periodLabel = exp.projectPeriod ? ` (${exp.projectPeriod})` : '';
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.5);
          doc.setTextColor(COLORS.darkMuted);
          doc.text(projectLabel + periodLabel, mainLeft, mainY);
          mainY += 4;
        }

        // Description
        if (exp.description) {
          drawWrapped(exp.description, mainLeft, 8, COLORS.darkText, mainWidth, 'normal', 1.35);
          mainY += 2;
        }

        // Highlights
        for (const highlight of exp.highlights) {
          checkMainBreak(8);

          doc.setFillColor(COLORS.accent);
          doc.circle(mainLeft + 1.5, mainY - 0.8, 0.7, 'F');

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(COLORS.darkText);
          const hLines = doc.splitTextToSize(highlight, mainWidth - 6);
          const lh = 3.2;
          for (const line of hLines) {
            checkMainBreak(lh + 1);
            doc.text(line, mainLeft + 5, mainY);
            mainY += lh;
          }
          mainY += 0.8;
        }

        mainY += 4;

        // Thin separator between experiences
        if (experience.indexOf(exp) < experience.length - 1) {
          checkMainBreak(4);
          doc.setDrawColor(COLORS.border);
          doc.setLineWidth(0.15);
          doc.line(mainLeft, mainY - 2, mainLeft + mainWidth, mainY - 2);
          mainY += 2;
        }
      }

      // Footer on each page
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        // Sidebar footer
        doc.setFillColor(COLORS.sidebarLight);
        doc.rect(0, pageHeight - 8, sidebarWidth, 8, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor(COLORS.whiteMuted);
        doc.text(`${p} / ${totalPages}`, sidebarWidth / 2, pageHeight - 3.5, { align: 'center' });
      }

      doc.setProperties({
        title: `${t('name')} - Resume`,
        subject: 'Resume / CV',
        author: t('name'),
        keywords: 'software, architect, developer, cv, resume',
        creator: 'Jhulian Resume App',
      });

      const langSuffix = i18n.language === 'es' ? 'ES' : 'EN';
      const fileName = `${t('name').replace(/\s+/g, '_')}_CV_${langSuffix}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
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
        {isExporting ? <Loader size={18} className={styles.spinner} /> : <FileDown size={18} />}
      </span>
      <span className={styles.text}>
        {isExporting ? t('exporting') : t('exportPDF')}
      </span>
    </motion.button>
  );
};
