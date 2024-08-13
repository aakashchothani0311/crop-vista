import { FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { differenceInDays } from 'date-fns';
import Crop from '../../models/crop';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GridTable, RowData, TableCellData } from '../common/GridTable';
import { useTranslation } from 'react-i18next';
import { getAllCrops, loadCrops } from '../../store/crop-slice';
import { toast, Toaster } from 'react-hot-toast';
import { Account } from '../../models/account';
import { lookInSession } from '../../session/session';
import Spinner from '../common/Spinner';
import { getCrops } from '../../services/crops-service';
import { AppDispatch } from '../../store';
import { createDemand, getDemands } from '../../services/demand-service';
import { Demand } from '../../models/company';

/* type for form data, where keys are strings and values are strings or undefined */
type FormData = {
    [key: string]: string | undefined;
}

const DemandView: FC = () => {

    const { t } = useTranslation(['demandview', 'crop', 'appbar']);

    /* Column headers for the grid table */
    const headers = [t("demandview.header.crop"), t("demandview.header.grade"), t("demandview.header.quantity"), t("demandview.header.created"), t("demandview.header.timeline"), t("demandview.header.remaining.days")];

    const [gridData, setGridData] = useState<RowData[]>([]);
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
    const [open, setDialogOpen] = useState<boolean>(false);
    const [spinner, setSpinner] = useState<boolean>(false);

    /* Retrieve account information from session */
    const account: Account = JSON.parse(lookInSession('account') as string);

    const dispatch = useDispatch<AppDispatch>();
    const crops = useSelector(getAllCrops());

    /* Effect to fetch demands and crops when component mounts */
    useEffect(() => {
        const companyId: string = account.child;

        /* Fetch demands for the company */
        getDemands({ companyId })
        .then((response: Demand[]) => {
            parseDatatoGrid(response);
        })
        .catch((error: Error) => {
            console.log('Error in fetching company demands', error);
        })

        /* Fetch crops if not already in the Redux store */
        if(crops.length == 0){
            getCrops()
            .then(response => dispatch(loadCrops(response)))
            .catch((error: Error) => console.log('Error fetching crops', error))
        }
    }, [])

    /* Convert demand data to format suitable for the grid table */
    const parseDatatoGrid = (response: Demand[]): void => {
        if(response.length >= 0) { 
            const currDate = Date.now();
            const tempGridData: RowData[] = [];

            response.forEach((res: Demand) => {
                const rowCells: TableCellData[] = [];
                rowCells.push(
                    {key: 'crop', value: res.cropId.name, ns:'crop'},
                    {key: 'grade', value: res.cropId.grade, ns: 'crop'},
                    {key: 'qty', value: res.quantity},
                    {key: 'createdDate', type: 'date', value: res.createdDate},
                    {key: 'timeline', value: res.timeline},
                    {key: 'daysLeft', value: res.timeline - differenceInDays(currDate, res.createdDate)},
                );
                tempGridData.push({resData: {...res}, rowCells: rowCells});
            })

            setGridData([...gridData, ...tempGridData]);
        }
    }

    /* Handle form submission to create a new demand */
    const handleCreateDemand = (formJson: FormData): void => {
        setSpinner(true);
        handleDialogclose();

        formJson.companyId = account.child;
        formJson.cropId = selectedCrop?.id;
        delete formJson.crop;

        /* Create demand through the API */
        createDemand(formJson)
        .then(response => {
            response.cropId = {
                id: selectedCrop?.id as string, 
                name: selectedCrop?.name as string, 
                grade: selectedCrop?.grade as string
            };

            parseDatatoGrid([response]);
            setSpinner(false);
            toast.success('Demand created successfully!');
        })
        .catch((error: Error) => { 
            setSpinner(false);
            toast.error('Demand not created.');
            console.log('Error creating new demand', error)
        })
    }

    /* Close the dialog and reset selected crop */
    const handleDialogclose = ():void => {
        setSelectedCrop(null);
        setDialogOpen(false);
    }

    return (
        <>
            {/* Title of the page */}
            <Typography component="h4" variant="h4" textAlign="center">{t("app.mydemands",{ns: 'appbar'})}</Typography>
            {/* Container for the button and grid table */}
            <Grid container>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={() => setDialogOpen(true)}>
                        <AddIcon /> 
                        {t("demandview.create.demand.button.label")}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {gridData.length > 0 ?
                        <GridTable header={headers} data={gridData} /> :
                        <Typography component="h6" variant="h6" textAlign="center">{t("demandview.grid.typo")}</Typography>
                    }
                </Grid>
            </Grid>

            {/* Dialog for creating a new demand */}
            <Dialog open={open} fullWidth onClose={() => handleDialogclose()} 
                PaperProps={{ 
                    component: "form", 
                    onSubmit: (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        handleCreateDemand(formJson);
                    }
                }}
            >
                <DialogTitle component="h5" variant="h5" sx={{ textAlign: "center" }}>{t("demandview.dialog.title")}</DialogTitle>
                {/* Autocomplete for selecting a crop, Input field for quantity and timeline */}
                <DialogContent>
                    <Autocomplete disablePortal options={crops} getOptionLabel={(option) => `${t(option.name, { ns: 'crop' })} - ${t(option.grade, { ns: 'crop' })}`} value={selectedCrop}
                        onChange={(event, newValue) => setSelectedCrop(newValue || null)}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        renderInput={(params) => <TextField {...params} name="crop" label={t("demandview.header.crop")} required fullWidth margin="dense" />}
                    />
                    <TextField name="quantity" label={t("demandview.header.quantity")} type="number" required fullWidth margin="dense" InputProps={{
                            endAdornment: <InputAdornment position="start">{t("demandview.dialog.txtfield.input.adornment")}</InputAdornment>,
                        }}
                    />
                    <TextField name="timeline" label={t("demandview.timeline.label")} required fullWidth margin="dense" />
                </DialogContent>
                {/* Submit and cancel buttons */}
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button type="submit" variant="contained">{t("demandview.confirm.button")}</Button>
                    <Button variant="outlined" onClick={() => handleDialogclose()}>{t("demandview.cancel.button")}</Button>
                </DialogActions>
            </Dialog>

            {/* Spinner to indicate loading state */}
            <Spinner open={spinner}/>
            <Toaster />
        </>
    )
}

export default DemandView;