import { FormEvent, useEffect, useState } from "react";
import { DistProc } from "../../models/distributor";
import { createDistProcs, getDistProcs, updateDistProc } from "../../services/dist-procservice";
import { GridTable, RowData, TableCellData } from "../common/GridTable";
import Crop from "../../models/crop";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { getAllCrops, loadCrops } from "../../store/crop-slice";
import { useTranslation } from "react-i18next";
import { lookInSession } from "../../session/session";
import { Account } from "../../models/account";
import Spinner from "../common/Spinner";
import { getCrops } from "../../services/crops-service";
import { AppDispatch } from "../../store";
import { toast, Toaster } from "react-hot-toast";
import { Farmer } from "../../models/farmer";

/* Type for URL parameters */
type Params = {
    [key: string] : string | boolean | Date;
}

/* Type for form data */
type FormData = {
    [key: string]: string | undefined;
}

const ProcNegotiationsView = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [spinner, setSpinner] = useState<boolean>(true);
    
    const { t } = useTranslation(['procnegotiationsview', 'crop', 'numbers', 'names']);
    
    /* State hooks for component data */
    const [gridData, setGridData] = useState<RowData[]>([]);
    const [selectedCrop, setSelectedCrop] = useState<Crop>();
    const [open, setDialogOpen] = useState<boolean>(false);

    /* Get account information from session */
    const account: Account = JSON.parse(lookInSession('account') as string);
    const crops = useSelector(getAllCrops());

    const dispatch = useDispatch<AppDispatch>();

    /* Fetch data on component mount */
    useEffect(() => {
        setSpinner(true);
        let params: Params = {};
        
        if(account.role !== 'farmer')
            params[account.role + 'Id'] = account.child;
        
        params.status = 'Completed';
        params.statusCond = 'notEqual'

        getDistProcs( params )
        .then((response: DistProc[]) => {
            (response.length > 0) ? parseDatatoProcGrid(response, false) : setLoading(false);
            setSpinner(false);
        })
        .catch((error: Error) => {
            setLoading(false);
            setSpinner(false);
            console.log('Error in fetching Distributor Procurements', error);
        })

        if(crops.length == 0){
            getCrops()
            .then((response: Crop[]) => dispatch(loadCrops(response)))
            .catch((error: Error) => console.log('Error fetching crops', error))
        }
    },[]);

    /* Define table headers using translations */
    const headers = [t("procnegotiationsview.header.crop"), t("procnegotiationsview.header.grade"), account.role === 'distributor' ? t("procnegotiationsview.header.farmer") : t("procnegotiationsview.header.distributor"), t("procnegotiationsview.header.quantity"), t("procnegotiationsview.header.msp"), t("procnegotiationsview.header.distoffer"), t("procnegotiationsview.header.status"), t("procnegotiationsview.header.confirmation")];

    /* Parse API response data into GridTable format */
    const parseDatatoProcGrid = (response: DistProc[], newDistProc: boolean = false): void => {
        if(response.length >= 0) { 
            const tempGridData: RowData[] = [];

            response.forEach((res: DistProc) => {
                const rowCells: TableCellData[] = [];
                rowCells.push(
                    {key: 'crop', value: t((res.cropId as Crop).name, {ns: 'crop'})},
                    {key: 'grade', value: (res.cropId as Crop).grade},
                    (account.role === 'distributor' ? {key: 'farmer', value: t((res.farmerId as Farmer)?.profile.name, {ns: 'names'})} : {key: 'distributor', value: t(res.distributorId?.profile.name, {ns:'names'})}),
                    {key: 'quantity', value: res.quantity},
                    {key: 'msp', value: (res.cropId as Crop).MSP as number},
                    {key: 'distQuote', value: res.distQuote},
                    {key: 'status', value: res.status},
                    {key: 'confirmation', type: 'button', disabled: (account.role === 'distributor' ? res.iAgreeDist || !res.farmerId : res.iAgreeFarmer), value: t("procnegotiationsview.response.key.confirm.button.value"), handler: handleIAgree},
                );
                tempGridData.push({resData: {...res}, rowCells: rowCells});
            })

            // Update grid data based on whether it's new or existing procurement
            if(newDistProc)
                setGridData([...gridData, ...tempGridData]);
            else
                setGridData([...tempGridData]);

            setLoading(false);
        }
    }

    /* Update grid data when procurement is updated */
    const upgradeGridData = (response: DistProc): void => {
        setGridData(prevData => {
            return prevData.filter(row => {
                if((row.resData as DistProc).id === response.id && response.status === 'Completed')
                    return false;

                if((row.resData as DistProc).id === response.id && response.status !== 'Completed'){
                    row.rowCells.forEach(rd => {
                        if(rd.key === 'distQuote')
                            rd.value = response.distQuote;

                        if(rd.key === 'confirmation')
                            rd.disabled = (account.role === 'distributor') ? response.iAgreeDist : response.iAgreeFarmer

                        if(rd.key === 'status')
                            rd.value = response.status;
                    })
                    row.resData = {...response};
                }
                
                return true;
            })
        })
    }

    /* Handle confirmation button click */
    const handleIAgree = (selectedItem: RowData) => {
        const distProcBody: Params = {};

        if (account.role === 'distributor'){
            distProcBody['status'] = (selectedItem.resData as DistProc).status == 'Farmer Agreed' ? 'Completed' : 'Distributor Agreed';    
            distProcBody['iAgreeDist'] = true;

            if(distProcBody['status'] === 'Completed')
                distProcBody['contractDate'] = new Date();
        } else if (account.role === 'farmer'){
            distProcBody['status'] = (selectedItem.resData as DistProc).status == 'Distributor Agreed' ? 'Completed' : 'Farmer Agreed'; 
            distProcBody['iAgreeFarmer'] = true;
            distProcBody['farmerId'] = account.child;

            if(distProcBody['status'] === 'Completed')
                distProcBody['contractDate'] = new Date();
        }
        setSpinner(true);

        /* Update procurement and handle response */
        updateDistProc(selectedItem.resData.id as string, distProcBody)
        .then((response: DistProc) => {
            upgradeGridData(response);
            setSpinner(false);
            toast.success(t("procnegotiationsview.handleiagree.updatedistproc.toast.success"));
        })
        .catch((error: Error) => {
            setSpinner(false);
            toast.error('Error occured. Please refresh and try again.');
            console.log('Error occured while updating distProc', error)
        });
    }

    /* Handle procurement creation */
    const handleCreateProc = (formJson: FormData): void => {
        setSpinner(true);

        formJson.distributorId = account.child;
        formJson.cropId = selectedCrop?.id;
        delete formJson.crop;
       
        createDistProcs(formJson)
        .then((response: DistProc) => {
            const cropById = crops.filter(c => c.id === response.cropId)[0];

            const tempResponse: DistProc = {...response};
            tempResponse.cropId = {name: (cropById as Crop).name, grade: (cropById as Crop).grade, id: response.cropId as string, MSP: (cropById as Crop).MSP};

            setDialogOpen(false);
            setSpinner(false);
            parseDatatoProcGrid([tempResponse], true);
            toast.success('Procurement record created.');
        })
        .catch((error: Error) => {
            setDialogOpen(false);
            setSpinner(false);
            toast.error('Procurement record not created.');
        //    console.log('Error creating procurement record', error);
        })
    }

    /* Handle dialog close */
    const handleDialogclose = ():void => {
        setDialogOpen(false);
    }
    
    return (
        <>
            {/* Page title based on account role */}
            <Typography paddingTop={2} component="h4" variant="h4" textAlign="center" gutterBottom>{account.role === 'distributor' ? t("procnegotiationsview.typo.title1") : t("procnegotiationsview.typo.title2")}</Typography>

            <Grid container>
                {/* Button for creating new procurement (visible only for distributors) */}
                <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                    {account.role === 'distributor' && 
                        <Button onClick={() => setDialogOpen(true)}>
                            <AddIcon /> 
                            {t("procnegotiationsview.title")}
                        </Button>
                    }
                </Grid>
                {/* Grid table for displaying procurement data */}
                <Grid item xs={12}>
                    {/* Message displayed when no data is available and not loading */}
                    {!loading && gridData.length == 0 && 
                        <Typography component="h6" variant="h6" textAlign="center" paddingBlockStart={3}>
                            {account.role === 'distributor' && t("procnegotiationsview.grid.typo.dist")}
                            {account.role === 'farmer' && t("procnegotiationsview.grid.typo.farmer")}
                        </Typography>
                    }
                
                    {/* Grid table displaying data if available and not loading */}
                    {!loading && gridData.length > 0 &&
                        <GridTable header={headers} data={gridData} />
                    }
                </Grid>
            </Grid>
            {/* Dialog for creating new procurement */}
            <Dialog open={open} fullWidth onClose={() => handleDialogclose()} 
                PaperProps={{ 
                    component: "form", 
                    onSubmit: (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        handleCreateProc(formJson);
                    }
                }}
            >
                <DialogTitle component="h5" variant="h5" sx={{ textAlign: "center" }}>{t("procnegotiationsview.dailog.title")}</DialogTitle>
                {/* Autocomplete for selecting a crop and Input labels for crop, quantity and timeline */}
                <DialogContent>
                    <Autocomplete disablePortal options={crops} getOptionLabel={(option) => `${t(option.name, { ns: 'crop' })} - ${t(option.grade, { ns: 'crop' })}`} value={selectedCrop}
                        onChange={(event, newValue) => setSelectedCrop(newValue || undefined)}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        renderInput={(params) => <TextField {...params} name="crop" label={t("procnegotiationsview.header.crop")} required fullWidth margin="dense" />}
                    />
                    <TextField name="quantity" label={t("procnegotiationsview.dailog.txtfield.label.qty")} type="number" required fullWidth margin="dense" />
                    <TextField name="distQuote" label={t("procnegotiationsview.dailog.txtfield.label.price")} type="number" required fullWidth margin="dense" />
                </DialogContent>
                {/* Submit and Cancel button*/}
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button type="submit" variant="contained">{t("procnegotiationsview.dailog.button.confirm")}</Button>
                    <Button variant="outlined" onClick={() => handleDialogclose()}>{t("procnegotiationsview.dailog.button.cancel")}</Button>
                </DialogActions>
            </Dialog>
            
            <Toaster />

            <Spinner open={spinner}/>
        </>
    )
}

export default ProcNegotiationsView;