import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NormalizedVehicle, formatBRL, getOptionalsList, slugify } from './data-normalizers';
import { loadImageSafe, getPlaceholderImage, resizeImage } from './image-helpers';

export async function exportVehicleToPDF(vehicle: NormalizedVehicle): Promise<void> {
  const filename = generatePDFFilename(vehicle.sku, vehicle.title);
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;

  let yPosition = margin;

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RELATÓRIO DE VEÍCULO', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Aurovel', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(vehicle.title, margin, yPosition);
  yPosition += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`SKU: ${vehicle.sku}`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Status: ${vehicle.status}`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Preço: ${formatBRL(vehicle.price)}`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Localização: ${vehicle.city}/${vehicle.state}`, margin, yPosition);
  yPosition += 5;

  const supplierName = vehicle.supplierContactName || vehicle.supplierCompanyName;
  pdf.text(`Fornecedor: ${supplierName}`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Telefone: ${vehicle.supplierPhone}`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Quantidade Disponível: ${vehicle.availableQuantity}`, margin, yPosition);
  yPosition += 10;

  if (vehicle.imageUrl) {
    try {
      const img = await loadImageSafe(vehicle.imageUrl);
      if (img) {
        const resized = await resizeImage(img, 600, 400);
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (imgWidth * img.height) / img.width;

        if (yPosition + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.addImage(resized, 'JPEG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }
    } catch (error) {
      console.error('Error loading main image:', error);
    }
  }

  if (yPosition > pageHeight - 50) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FICHA TÉCNICA', margin, yPosition);
  yPosition += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const technicalData = [
    ['Ano de Fabricação', vehicle.fabricationYear?.toString() || '—'],
    ['Ano Modelo', vehicle.modelYear?.toString() || '—'],
    ['Fabricante do Chassi', vehicle.chassisManufacturer || '—'],
    ['Modelo do Chassi', vehicle.chassisModel || '—'],
    ['Fabricante da Carroceria', vehicle.bodyManufacturer || '—'],
    ['Modelo da Carroceria', vehicle.bodyModel || '—'],
    ['Categoria', vehicle.category || '—'],
    ['Subcategoria', vehicle.subcategory || '—'],
    ['Sistema de Tração', vehicle.driveSystem],
    ['Posição do Motor', vehicle.motorPosition],
  ];

  technicalData.forEach(([label, value]) => {
    if (yPosition > pageHeight - margin - 5) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${label}:`, margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 60, yPosition);
    yPosition += 5;
  });

  yPosition += 5;

  if (yPosition > pageHeight - 50) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OPCIONAIS', margin, yPosition);
  yPosition += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const optionalsData = [
    ['Ar-Condicionado', vehicle.optionals.airConditioning ? 'Sim' : 'Não'],
    ['Banheiro', vehicle.optionals.bathroom ? 'Sim' : 'Não'],
    ['Bancos Reclináveis', vehicle.optionals.reclinableSeats ? 'Sim' : 'Não'],
    ['USB', vehicle.optionals.usb ? 'Sim' : 'Não'],
    ['Porta Pacote', vehicle.optionals.packageHolder ? 'Sim' : 'Não'],
    ['Sistema de Som', vehicle.optionals.soundSystem ? 'Sim' : 'Não'],
    ['TV', vehicle.optionals.tv ? 'Sim' : 'Não'],
    ['Wifi', vehicle.optionals.wifi ? 'Sim' : 'Não'],
    ['Vidro Basculante', vehicle.optionals.tiltingGlass ? 'Sim' : 'Não'],
    ['Vidro Colado', vehicle.optionals.gluedGlass ? 'Sim' : 'Não'],
    ['Cortina', vehicle.optionals.curtain ? 'Sim' : 'Não'],
    ['Acessibilidade', vehicle.optionals.accessibility ? 'Sim' : 'Não'],
  ];

  optionalsData.forEach(([label, value]) => {
    if (yPosition > pageHeight - margin - 5) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${label}:`, margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 60, yPosition);
    yPosition += 5;
  });

  yPosition += 5;

  if (vehicle.description) {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DESCRIÇÃO', margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const lines = pdf.splitTextToSize(vehicle.description, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin - 5) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    });
  }

  const galleryImages = vehicle.allImages.slice(1);
  if (galleryImages.length > 0) {
    pdf.addPage();
    yPosition = margin;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GALERIA DE IMAGENS', margin, yPosition);
    yPosition += 10;

    for (const imgUrl of galleryImages) {
      try {
        const img = await loadImageSafe(imgUrl);
        if (img) {
          const resized = await resizeImage(img, 600, 400);
          const imgWidth = pageWidth - 2 * margin;
          const imgHeight = (imgWidth * img.height) / img.width;

          if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.addImage(resized, 'JPEG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        }
      } catch (error) {
        console.error('Error loading gallery image:', error);
      }
    }
  }

  pdf.save(filename);
}

export async function exportVehiclesToPDFBatch(vehicles: NormalizedVehicle[]): Promise<void> {
  const filename = generateBatchPDFFilename();
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;

  let isFirstVehicle = true;

  for (const vehicle of vehicles) {
    if (!isFirstVehicle) {
      pdf.addPage();
    }
    isFirstVehicle = false;

    let yPosition = margin;

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(vehicle.title, margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`SKU: ${vehicle.sku} | ${formatBRL(vehicle.price)}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`${vehicle.city}/${vehicle.state}`, margin, yPosition);
    yPosition += 10;

    if (vehicle.imageUrl) {
      try {
        const img = await loadImageSafe(vehicle.imageUrl);
        if (img) {
          const resized = await resizeImage(img, 600, 400);
          const imgWidth = pageWidth - 2 * margin;
          const imgHeight = Math.min((imgWidth * img.height) / img.width, 150);

          pdf.addImage(resized, 'JPEG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        }
      } catch (error) {
        console.error('Error loading image:', error);
      }
    }

    const optionals = getOptionalsList(vehicle.optionals);
    if (optionals.length > 0) {
      pdf.setFontSize(9);
      pdf.text(`Opcionais: ${optionals.join(', ')}`, margin, yPosition);
    }
  }

  pdf.save(filename);
}

export function generatePDFFilename(sku: string, title: string): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '-')
    .slice(0, 15);
  const slug = slugify(title).slice(0, 30);
  return `Aurovel-RELATORIO-${sku}-${slug}-${timestamp}.pdf`;
}

export function generateBatchPDFFilename(): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '-')
    .slice(0, 15);
  return `Aurovel-RELATORIOS-${timestamp}.pdf`;
}
