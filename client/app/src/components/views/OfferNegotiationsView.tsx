import { FormEvent, useEffect, useState } from "react";
import { DistOffer } from "../../models/distributor";
import { createDistOffers, getDistOffers, updateDistOffers } from "../../services/dist-offer-service";
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
import { Company } from "../../models/company";

type Params = {
    [key: string] : string | boolean | Date;
}

type FormData = {
    [key: string] : string | undefined;
}

const OfferNegotiationsView = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [spinner, setSpinner] = useState<boolean>(true);

    const { t } = useTranslation(['offernegotiationsview', 'crop', 'numbers']);

    const [gridData, setGridData] = useState<RowData[]>([]);
    const [selectedCrop, setSelectedCrop] = useState<Crop>();
    const [open, setDialogOpen] = useState<boolean>(false);

    const account: Account = JSON.parse(lookInSession('account') as string);
    const crops = useSelector(getAllCrops());

    const dispatch = useDispatch<AppDispatch>();
    
    useEffect(() => {
        setSpinner(true);
        let params: Params = {};

        if(account.role !== 'company')
            params[account.role + 'Id'] = account.child;

        params.status = 'Completed';
        params.statusCond = 'notEqual'

        getDistOffers( params )
        .then((response: DistOffer[]) => {
            (response.length > 0) ? parseDatatoOfferGrid(response, false) : setLoading(false);
            setSpinner(false);
        })
        .catch((error: Error) => {
            setLoading(false);
            setSpinner(false);
            console.log('Error in fetching Distributor Offers', error);
        })

        if(crops.length == 0){
            getCrops()
            .then((repsonse: Crop[]) => dispatch(loadCrops(repsonse)))
            .catch((error: Error) => console.log('Error fetching crops', error))
        }
    },[]);

    const headers = [t("offernegotiationsview.header.crop"), t("offernegotiationsview.header.grade"), account.role === 'distributor' ? t("offernegotiationsview.header.company") : t("offernegotiationsview.header.distributor"), t("offernegotiationsview.header.quantity"), t("offernegotiationsview.header.msp"), t("offernegotiationsview.header.distoffer"), t("offernegotiationsview.header.confirmation"), t("offernegotiationsview.header.status")];

    const parseDatatoOfferGrid = (response: DistOffer[], newDistOffer: boolean = false): void => {
        if(response.length >= 0) { 
            const tempGridData: RowData[] = [];
            response.forEach((res: DistOffer) => {

                const rowCells: TableCellData[] = [];
                rowCells.push()
                rowCells.push(
                    {key: 'crop', value: t((res.cropId as Crop).name, {ns: 'crop'})},
                    {key: 'grade', value: (res.cropId as Crop).grade},
                    (account.role === 'distributor' ? {key: 'company', value: (res.companyId as Company)?.profile.name} : {key: 'distributor', value: res.distributorId.profile.name}),
                    {key: 'quantity', value: res.quantity},
                    {key: 'msp', value: (res.cropId as Crop).MSP as number},
                    {key: 'distQuote', value: res.distQuote},
                    {key: 'status', value: res.status},
                    {key: 'confirmation', type: 'button', disabled: (account.role === 'distributor' ? res.iAgreeDist || !res.companyId : res.iAgreeCompany), value: t("offernegotiationsview.response.key.confirm.button.value"), handler: handleIAgree},
                );
                tempGridData.push({resData: {...res}, rowCells: rowCells});
            })
            if(newDistOffer)
                setGridData([...gridData, ...tempGridData]);
            else
                setGridData([...tempGridData]);

            setLoading(false);
        }
    }

    const upgradeGridData = (response: DistOffer): void => {
        setGridData(prevData => {
            return prevData.filter(row => {
                if((row.resData as DistOffer).id === response.id && response.status === 'Completed')
                    return false;

                if((row.resData as DistOffer).id === response.id && response.status !== 'Completed'){
                    row.rowCells.forEach(rd => {
                        if(rd.key === 'distQuote')
                            rd.value = response.distQuote;

                        if(rd.key === 'confirmation')
                            rd.disabled = (account.role === 'distributor') ? response.iAgreeDist : response.iAgreeCompany;

                        if(rd.key === 'status')
                            rd.value = response.status;
                    })
                    row.resData = {...response};
                }
                
                return true;
            })
        })
    }

    const handleIAgree = (selectedItem: RowData) => {
        const distOfferBody: Params = {};

        if (account.role === 'distributor'){
            distOfferBody['status'] = (selectedItem.resData as DistOffer).status == 'Company Agreed' ? 'Completed' : 'Distributor Agreed';    
            distOfferBody['iAgreeDist'] = true;

            if(distOfferBody['status'] === 'Completed')
                distOfferBody['contractDate'] = new Date();
        } else if (account.role === 'company'){
            distOfferBody['status'] = (selectedItem.resData as DistOffer).status == 'Distributor Agreed' ? 'Completed' : 'Company Agreed'; 
            distOfferBody['iAgreeCompany'] = true;
            distOfferBody['companyId'] = account.child;

            if(distOfferBody['status'] === 'Completed')
                distOfferBody['contractDate'] = new Date();
        }
        setSpinner(true);

        updateDistOffers(selectedItem.resData.id as string, distOfferBody)
        .then((response: DistOffer) => {
            upgradeGridData(response);
            setSpinner(false);
            toast.success('Offer marked as Agreed.');
        })
        .catch((error: Error) => {
            setSpinner(false);
            toast.error('Error occured. Please refresh and try again.');
            console.log('Error occured while updating distOffer', error)
        });
    }

    const handleCreateOffer = (formJson: FormData): void => {
        setSpinner(true);

        formJson.distributorId = account.child;
        formJson.cropId = selectedCrop?.id;
        delete formJson.crop;
       
        createDistOffers(formJson)
        .then((response: DistOffer) => {
            const cropById = crops.filter(c => c.id === response.cropId)[0];

            const tempResponse: DistOffer = {...response};
            tempResponse.cropId = {name: (cropById as Crop).name, grade: (cropById as Crop).grade, id: response.cropId as string, MSP: (cropById as Crop).MSP};

            setDialogOpen(false);
            setSpinner(false);
            parseDatatoOfferGrid([tempResponse], true);
            toast.success('Procurement record created.');
        })
        .catch((error: Error) => {
            setDialogOpen(false);
            setSpinner(false);
            toast.error('Procurement record not created.');
            console.log('Error creating procurement record', error);
        })
    }

    const handleDialogclose = ():void => {
        setDialogOpen(false);
    }
    
    return (
        <>
            <Typography paddingTop={2} component="h4" variant="h4" textAlign="center" gutterBottom>{account.role === 'distributor' ? t("offernegotiationsview.typo.title.offers") : t("offernegotiationsview.typo.title.negotiations")}</Typography>

            <Grid container>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                    {account.role === 'distributor' && 
                        <Button onClick={() => setDialogOpen(true)}>
                            <AddIcon /> 
                            {t("offernegotiationsview.title")}
                        </Button>
                    }
                </Grid>
                <Grid item xs={12}>
                    {!loading && gridData.length == 0 && 
                        <Typography component="h6" variant="h6" textAlign="center" paddingBlockStart={3}>{t("offernegotiationsview.gird.no.data.show")}</Typography>
                    }
                
                    {!loading && gridData.length > 0 &&
                        <GridTable header={headers} data={gridData} />
                    }
                </Grid>
            </Grid>
            <Dialog open={open} fullWidth onClose={() => handleDialogclose()} 
                PaperProps={{ 
                    component: "form", 
                    onSubmit: (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        handleCreateOffer(formJson);
                    }
                }}
            >
                <DialogTitle component="h5" variant="h5" sx={{ textAlign: "center" }}>{t("offernegotiationsview.dailog.title")}</DialogTitle>
                <DialogContent>
                    <Autocomplete disablePortal options={crops} getOptionLabel={(option) => `${t(option.name, { ns: 'crop' })} - ${t(option.grade, { ns: 'crop' })}`} value={selectedCrop}
                        onChange={(event, newValue) => setSelectedCrop(newValue || undefined)}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        renderInput={(params) => <TextField {...params} name="crop" label={t("offernegotiationsview.header.crop")} required fullWidth margin="dense" />}
                    />
                    <TextField name="quantity" label={t("offernegotiationsview.dailog.txtfield.label.qty")} type="number" required fullWidth margin="dense" />
                    <TextField name="distQuote" label={t("offernegotiationsview.dailog.txtfield.label.price")} type="number" required fullWidth margin="dense" />
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button type="submit" variant="contained">{t("offernegotiationsview.dailog.button.confirm")}</Button>
                    <Button variant="outlined" onClick={() => handleDialogclose()}>{t("offernegotiationsview.dailog.button.cancel")}</Button>
                </DialogActions>
            </Dialog>
            
            <Toaster />

            <Spinner open={spinner}/>
        </>
    )
}

export default OfferNegotiationsView;