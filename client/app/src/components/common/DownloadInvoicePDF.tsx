import jsPDF from 'jspdf';
import { DistOffer, DistProc, Distributor } from '../../models/distributor';
import Crop from '../../models/crop';
import { Farmer } from '../../models/farmer';
import { Company } from '../../models/company';

/* Props containing either a DistProc or DistOffer object */
type Props = {
    data: DistProc | DistOffer;
}

/* Function to generate and download an invoice PDF */
const DownloadInvoicePDF = (props: Props): void => {
    const doc = new jsPDF();

    /* Function to check if the data is of type DistProc */
    const isDistProc = (data: DistProc | DistOffer): data is DistProc => {
        return (data as DistProc).farmerId !== undefined;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    /* Center align the Contract title */
    doc.setFontSize(32);
    doc.text('Contract', pageWidth / 2, 30, { align: 'center' });

    /* Center align the contract description */
    doc.setFontSize(16);
    const stringTemp = !isDistProc(props.data) ?
                        `${((props.data as DistOffer).companyId as Company).profile.name} (Company)` :
                        `${((props.data as DistProc).farmerId as Farmer).profile.name} (Farmer)`;

    const contractText = `This is a contract between ${(props.data.distributorId as Distributor).profile.name} (Distributor) and ${stringTemp}.`;
    const lines = doc.splitTextToSize(contractText, pageWidth - 2 * margin);
    lines.forEach((line: string, index: number) => {
        doc.text(line, 14, 50 + (index * 10));
    })

    /* Display the crop name and grade in the PDF */
    doc.setFontSize(14);
    const cropDetails = `Crop: ${(props.data.cropId as Crop).name} - ${(props.data.cropId as Crop).grade}`;
    doc.text(cropDetails, 14, 90);

    /* Display the agreed quantity in quintals (q) */
    const quantityDetails = `Agreed Qty: ${props.data.quantity} qunital(s)`;
    doc.text(quantityDetails, 14, 100);

    /* Display the agreed cost per quintal in dollars */
    const costDetails = `Agree Cost: ${props.data.distQuote.toFixed(2)} ($/q)`;
    doc.text(costDetails, 14, 110);

    /* Calculate and display the total amount based on quantity and agreed cost */
    const totalAmount = props.data.quantity * props.data.distQuote;
    const totalDetails = `Total: $ ${totalAmount.toFixed(2)}`;
    doc.text(totalDetails, 14, 130);

    /* Display the contract date, aligned to the right */
    const contractDate = `Contract Date: ${new Date(props.data.contractDate).toLocaleDateString(undefined, undefined)}`;
    const dateWidth = doc.getTextWidth(contractDate);
    doc.text(contractDate, pageWidth - margin - dateWidth, 180);

    doc.text('-----EOF-----', pageWidth / 2, 200, { align: 'center' });

    /* Generate PDF as Blob and open in a new tab */
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, '_blank');
};
   
export default DownloadInvoicePDF;