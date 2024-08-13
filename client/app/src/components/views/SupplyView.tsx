import { FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { differenceInDays } from 'date-fns';
import Crop from '../../models/crop';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GridTable, RowData, TableCellData } from '../common/GridTable';
import { Supply } from '../../models/farmer';
import { createSupply, getSupplies } from '../../services/supply-service';
import { useTranslation } from 'react-i18next';
import { getAllCrops, loadCrops } from '../../store/crop-slice';
import { toast, Toaster } from 'react-hot-toast';
import { Account } from '../../models/account';
import { lookInSession } from '../../session/session';
import Spinner from '../common/Spinner';
import { getCrops } from '../../services/crops-service';
import { AppDispatch } from '../../store';

type FormData = {
    [key: string]: string | undefined;
}

const SupplyView: FC = () => {

    const { t } = useTranslation(['supplyview', 'crop', 'appbar']);

    /* Table headers */
    const headers = [t("supplyview.header.crop"), t("supplyview.header.grade"), t("supplyview.header.quantity"), t("supplyview.header.created"), t("supplyview.header.timeline"), t("supplyview.header.remaining.days")];

    const [gridData, setGridData] = useState<RowData[]>([]);
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
    const [open, setDialogOpen] = useState<boolean>(false);
    const [spinner, setSpinner] = useState<boolean>(false);

    /* Retrieve account information from session */
    const account: Account = JSON.parse(lookInSession('account') as string);

    const dispatch = useDispatch<AppDispatch>();
    const crops = useSelector(getAllCrops());

    /* Effect to fetch supplies and crops */
    useEffect(() => {
        const farmerId: string = account.child;

        /* Fetch supplies for the current farmer */
        getSupplies({ farmerId })
        .then((response: Supply[]) => {
            parseDatatoGrid(response);
        })
        .catch((error: Error) => console.log('Error in fetching farmer supplies', error))

        /* Fetch crops if not already available in the state */
        if(crops.length == 0){
            getCrops()
            .then(response => dispatch(loadCrops(response)))
            .catch((error: Error) => console.log('Error fetching crops', error))
        }
    }, [])

    /* Parse supplies data to grid format */
    const parseDatatoGrid = (response: Supply[]): void => {
        if(response.length >= 0) { 
            const currDate = Date.now();
            const tempGridData: RowData[] = [];

            response.forEach((res: Supply) => {
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

    /* Handle creation of a new supply */
    const handleCreateSupply = (formJson: FormData): void => {
        setSpinner(true);
        handleDialogclose();

        formJson.farmerId = account.child;
        formJson.cropId = selectedCrop?.id;
        delete formJson.crop;

        createSupply(formJson)
        .then(response => {
            response.cropId = {
                id: selectedCrop?.id as string, 
                name: selectedCrop?.name as string, 
                grade: selectedCrop?.grade as string
            };

            parseDatatoGrid([response]);
            setSpinner(false);
            toast.success('Supply created successfully!');
        })
        .catch((error: Error) => { 
            setSpinner(false);
            toast.error('Supply not created.');
            console.log('Error creating new supply', error)
        })
    }

    /* Close dialog and reset selected crop */
    const handleDialogclose = ():void => {
        setSelectedCrop(null);
        setDialogOpen(false);
    }

    return (
        <>
            {/* Title for Supply Table*/}
            <Typography component="h4" variant="h4" textAlign="center">{t("app.mysupplies",{ns: 'appbar'})}</Typography>
            <Grid container>
                {/* Button for creating a new supply */}
                <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={() => setDialogOpen(true)}>
                        <AddIcon /> 
                        {t("supplyview.create.supply.button.label")}
                    </Button>
                </Grid>
                {/* Display grid table or a message if no data available */}
                <Grid item xs={12}>
                    {gridData.length > 0 ?
                        <GridTable header={headers} data={gridData} /> :
                        <Typography component="h5" variant="h5" textAlign="center">{t("supplyview.grid.typo")}</Typography>
                    }
                </Grid>
            </Grid>
            
            {/* Dialog for creating new supply */}
            <Dialog open={open} fullWidth onClose={() => handleDialogclose()} 
                PaperProps={{ 
                    component: "form", 
                    onSubmit: (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        handleCreateSupply(formJson);
                    }
                }}
            >
                <DialogTitle component="h5" variant="h5" sx={{ textAlign: "center" }}>{t("supplyview.dialog.title")}</DialogTitle>
                {/* Autocomplete for selecting crop and Input fields for crop, quantity, and timeline*/}
                <DialogContent>
                    <Autocomplete disablePortal options={crops} getOptionLabel={(option) => `${t(option.name, { ns: 'crop' })} - ${t(option.grade, { ns: 'crop' })}`} value={selectedCrop}
                        onChange={(event, newValue) => setSelectedCrop(newValue || null)}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        renderInput={(params) => <TextField {...params} name="crop" label={t("supplyview.header.crop")} required fullWidth margin="dense" />}
                    />
                    <TextField name="quantity" label={t("supplyview.header.quantity")} type="number" required fullWidth margin="dense" InputProps={{
                            endAdornment: <InputAdornment position="start">{t("supplyview.dialog.txtfield.input.adornment")}</InputAdornment>,
                        }}
                    />
                    <TextField name="timeline" label={t("supplyview.txtfield.label.timeline")} required fullWidth margin="dense" />
                </DialogContent>
                {/* Submit and cancel buttons */}
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button type="submit" variant="contained">{t("supplyview.dialog.button.confirm")}</Button>
                    <Button variant="outlined" onClick={() => handleDialogclose()}>{t("supplyview.dialog.button.cancel")}</Button>
                </DialogActions>
            </Dialog>

            {/* Spinner component to indicate loading state */}
            <Spinner open={spinner}/>

            <Toaster />
        </>
    )
}

export default SupplyView;