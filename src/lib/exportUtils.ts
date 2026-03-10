import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';


export interface InterventionExport {
  id: string;
  titre: string;
  description: string;
  priorite: string;
  equipement?: string;
  dateEcheance?: string;
  statut: string;
  dateCreation: string;
  dateCloture?: string;
  employe: {
    nom: string;
    prenom: string;
    email: string;
  };
  technicien?: {
    nom: string;
    prenom: string;
    email: string;
  };
}

export const exportToPDF = (interventions: InterventionExport[], title: string = 'Fiches d\'interventions') => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(title, 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
  doc.text(`Total: ${interventions.length} intervention(s)`, 14, 36);
  
  // Table data - reduced columns for better fit
  const tableData = interventions.map(intervention => [
    intervention.id.substring(0, 6) + '...',
    intervention.titre.length > 25 ? intervention.titre.substring(0, 25) + '...' : intervention.titre,
    intervention.priorite,
    intervention.statut,
    intervention.employe.prenom + ' ' + intervention.employe.nom,
    intervention.technicien ? intervention.technicien.prenom + ' ' + intervention.technicien.nom : 'Non assigné',
    intervention.dateCreation ? new Date(intervention.dateCreation).toLocaleDateString('fr-FR') : ''
  ]);

  // Table headers - reduced columns
  const headers = [
    'ID',
    'Titre',
    'Priorité',
    'Statut',
    'Demandeur',
    'Technicien',
    'Date création'
  ];

  // Add table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 45,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      halign: 'left',
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // Light gray
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' }, // ID
      1: { cellWidth: 35, halign: 'left' }, // Titre
      2: { cellWidth: 18, halign: 'center' }, // Priorité
      3: { cellWidth: 18, halign: 'center' }, // Statut
      4: { cellWidth: 25, halign: 'left' }, // Demandeur
      5: { cellWidth: 25, halign: 'left' }, // Technicien
      6: { cellWidth: 20, halign: 'center' }, // Date création
    },
    margin: { top: 45, left: 10, right: 10 },
    tableWidth: 'wrap',
    showHead: 'everyPage',
  });

  // Save the PDF
  const fileName = `interventions_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const exportToExcel = (interventions: InterventionExport[], title: string = 'Fiches d\'interventions') => {
  // Prepare data for Excel
  const excelData = interventions.map(intervention => ({
    'ID': intervention.id,
    'Titre': intervention.titre,
    'Description': intervention.description,
    'Priorité': intervention.priorite,
    'Équipement': intervention.equipement || '',
    'Statut': intervention.statut,
    'Demandeur': `${intervention.employe.prenom} ${intervention.employe.nom}`,
    'Email Demandeur': intervention.employe.email,
    'Technicien': intervention.technicien ? `${intervention.technicien.prenom} ${intervention.technicien.nom}` : 'Non assigné',
    'Email Technicien': intervention.technicien?.email || '',
    'Date création': intervention.dateCreation ? new Date(intervention.dateCreation).toLocaleDateString('fr-FR') : '',
    'Date échéance': intervention.dateEcheance ? new Date(intervention.dateEcheance).toLocaleDateString('fr-FR') : '',
    'Date clôture': intervention.dateCloture ? new Date(intervention.dateCloture).toLocaleDateString('fr-FR') : ''
  }));

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const colWidths = [
    { wch: 15 }, // ID
    { wch: 30 }, // Titre
    { wch: 50 }, // Description
    { wch: 12 }, // Priorité
    { wch: 20 }, // Équipement
    { wch: 12 }, // Statut
    { wch: 25 }, // Demandeur
    { wch: 30 }, // Email Demandeur
    { wch: 25 }, // Technicien
    { wch: 30 }, // Email Technicien
    { wch: 15 }, // Date création
    { wch: 15 }, // Date échéance
    { wch: 15 }, // Date clôture
  ];
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Interventions');

  // Save the Excel file
  const fileName = `interventions_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

export const printInterventions = (interventions: InterventionExport[], title: string = 'Fiches d\'interventions') => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez que les pop-ups ne sont pas bloqués.');
    return;
  }

  // Generate HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #3b82f6;
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          font-size: 12px;
        }
        th {
          background-color: #3b82f6;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .priority-high {
          color: #dc2626;
          font-weight: bold;
        }
        .priority-critical {
          color: #991b1b;
          font-weight: bold;
        }
        .status-completed {
          color: #059669;
          font-weight: bold;
        }
        .status-pending {
          color: #d97706;
          font-weight: bold;
        }
        .status-in-progress {
          color: #2563eb;
          font-weight: bold;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        <p>Total: ${interventions.length} intervention(s)</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Priorité</th>
            <th>Statut</th>
            <th>Demandeur</th>
            <th>Technicien</th>
            <th>Date création</th>
            <th>Date échéance</th>
          </tr>
        </thead>
        <tbody>
          ${interventions.map(intervention => `
            <tr>
              <td>${intervention.id.substring(0, 8)}...</td>
              <td>${intervention.titre}</td>
              <td class="priority-${intervention.priorite.toLowerCase()}">${intervention.priorite}</td>
              <td class="status-${intervention.statut.toLowerCase().replace('_', '-')}">${intervention.statut}</td>
              <td>${intervention.employe.prenom} ${intervention.employe.nom}</td>
              <td>${intervention.technicien ? `${intervention.technicien.prenom} ${intervention.technicien.nom}` : 'Non assigné'}</td>
              <td>${intervention.dateCreation ? new Date(intervention.dateCreation).toLocaleDateString('fr-FR') : ''}</td>
              <td>${intervention.dateEcheance ? new Date(intervention.dateEcheance).toLocaleDateString('fr-FR') : ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Write content and print
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};
