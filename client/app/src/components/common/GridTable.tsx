import { FC } from 'react';
import { Demand } from '../../models/company';
import { Supply } from '../../models/farmer';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DistOffer, DistProc } from '../../models/distributor';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

/* Define a type for the data to be displayed in each cell of the table */
export type TableCellData = {
    key: string;
    value:  string | number | Date;
    type?: string;
    disabled?: boolean;
    handler?: (row: RowData) => void;
    ns?: string;
};

export type ResData = {
    [key: string]: string | number;
}

/* Define a type for the data to be displayed in each row of the table */
export type RowData = {
    resData: Demand | Supply | DistProc | DistOffer | ResData;
    rowCells: TableCellData[];
}

/* Define the props type for the GridTable component */
type Props = {
    header: string[];
    data: RowData[];
}

/* Styling for the table headers */
const headerstyles = {
    fontWeight: "bold",
    fontSize: "1rem",
}

const hindiNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/* Function to convert a number to Hindi numerals */
const convertToHindiNumerals = (num: number): string => {
    return num.toString().split('').map(digit => hindiNumerals[parseInt(digit, 10)]).join('');
};

/* Function to format a date value into a localized string (supports Hindi language) */
export const parseDateGrid = (value: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }

    const formattedDate = new Date(value).toLocaleDateString(i18n.language, options);

    const [day, month, year] = formattedDate.split(/[\s,]+/);

    const hindiDay = i18n.language === 'hi' ? convertToHindiNumerals(parseInt(day, 10)) : day;
    const hindiYear = i18n.language === 'hi' ? convertToHindiNumerals(parseInt(year, 10)) : year;

    return `${hindiDay} ${month} ${hindiYear}`;
}

/* GridTable component definition */
export const GridTable: FC<Props> = (props: Props) => {

    const { i18n, t } = useTranslation('marketview');

    /* Map headers to TableCell components with styles */
    const headerData = props.header.map((h, idx) => <TableCell key={idx} align="center">
        {h.includes(':') ? 
            <><div style={headerstyles}>{h.split(':')[0]}</div>{h.split(':')[1]}</> : 
            <div style={headerstyles}>{h}</div>
        }  
    </TableCell> );

    /* Map rows data to TableRow components */
    const gridData = props.data?.map((row: RowData, rowIdx) => (
        <TableRow key={rowIdx} sx={{ border: "2px solid #d1d1d1" }}>
            {row.rowCells?.map((cell: TableCellData) => {
                let cellVal: string = '';

                if(cell.type === 'date' || cell.value instanceof Date)
                    cellVal = parseDateGrid(cell.value as Date);
                else if(typeof(cell.value) == 'number' && i18n.language === 'hi')
                    cellVal = convertToHindiNumerals(cell.value as number);
                else
                    cellVal = t(cell.value as string, { ns: cell.ns });

                if(cell.type === 'button')
                    return (
                        <TableCell key={cell.key} align="center" size="small">
                            <Button disabled={cell.disabled} size="small" onClick={() => cell.handler && cell.handler(row)}>{t(cellVal as string, { ns: cell.ns })}</Button>
                        </TableCell>
                    )
                else
                    return (
                        <TableCell key={cell.key} align="center" size="small">{cellVal}</TableCell>
                    )
            })}
        </TableRow>
));
    return (    
        /* Render the table headers and table rows */      
        <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {headerData}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {gridData}
                </TableBody>
            </Table>
        </TableContainer>      
    );
}