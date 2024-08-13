import { useEffect, useState } from "react";
import { Account } from "../../models/account";
import { lookInSession } from "../../session/session";
import { getDistProcs } from "../../services/dist-procservice";
import { DistOffer, DistProc } from "../../models/distributor";
import { Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { getDistOffers } from "../../services/dist-offer-service";
import Spinner from "../common/Spinner";
import DownloadInvoicePDF from "../common/DownloadInvoicePDF";
import { useTranslation } from "react-i18next";
import {parseDateGrid} from "../common/GridTable";
import Crop from "../../models/crop";

/* type for Params, where keys are strings and values are strings */
type Params = {
    [key: string] : string | boolean;
}

const ContractView = () => {

    const { t } = useTranslation(['contractview', 'names', 'crop']);

    /* State variables to store procurement and offer data, and loading states */
    const [distProcs, setDistProcs] = useState<DistProc[]>([]);
    const [distOffers, setDistOffers] = useState<DistOffer[]>([]);

    const [procLoading, setProcLoading] = useState<boolean>(true);
    const [offerLoading, setOfferLoading] = useState<boolean>(true);
    const [spinner, setSpinner] = useState<boolean>(true);

    /* Retrieve account information from session */
    const account: Account = JSON.parse(lookInSession('account') as string);

    /* Effect to fetch data based on the account role */
    useEffect(() => {
        setSpinner(true);
        let params: Params = {};
        params[account.role + 'Id'] = account.child;
        params.status = 'Completed';

        /* Fetch procurement data for roles distributor and farmer */
        if(account.role !== 'company'){
            getDistProcs( params )
            .then((response: DistProc[]) => {
                setDistProcs([...response]);
                setProcLoading(false);
            })
            .catch((error: Error) => {
                setProcLoading(false);
                console.log('Error in fetching Distributor Procurements', error);
            })

            if(account.role === 'farmer')
                setOfferLoading(false);
        }

        /* Fetch offer data for roles distributor and company */
        if(account.role !== 'farmer'){
            getDistOffers( params )
            .then((response: DistOffer[]) => {
                setDistOffers([...response]);
                setOfferLoading(false);
            })
            .catch((error: Error) => {
                setOfferLoading(false);
                console.log('Error in fetching Distributor Offers', error);
            })

            if(account.role === 'company')
                setProcLoading(false);
        }
    },[]);

    /* Effect to manage the spinner visibility based on loading states */
    useEffect(() => {
        setSpinner(procLoading || offerLoading);
    }, [procLoading, offerLoading])

    /* Map procurement data to UI components */
    const procContracts = distProcs.map((proc: DistProc) => (
        <Grid key={proc.id} item xs={12} sm={6}>
            <Card sx={{ margin: 1}}>
                <CardContent>
                    <Typography component="h5" variant="h5" gutterBottom>
                        {account.role === 'farmer' ?  t("contractview.proccontracts.account.role.distributor") + t(proc.distributorId.profile.name, {ns: 'names'}) : t("contractview.proccontracts.account.role.farmer") + t(proc.farmerId.profile.name, {ns: 'names'})}
                    </Typography>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                        {t("contractview.proccontracts.grid.crop")} {t((proc.cropId as Crop).name,{ns:'crop'}) + ' - ' + t((proc.cropId as Crop).grade,{ns:'crop'})}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {t("contractview.proccontracts.grid.contract.date")} {parseDateGrid(proc.contractDate)}
                        </Grid>
                    </Grid>       
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => DownloadInvoicePDF({ data: proc })}>{t("contractview.proccontracts.grid.button")}</Button>
                </CardActions>
            </Card>
        </Grid> 
    ));

    /* Map offer data to UI components */
    const offerContracts = distOffers.map((offer: DistOffer) => (
        <Grid key={offer.id} item xs={12} sm={6}>
            <Card key={offer.id} sx={{ margin: 1}}>
                <CardContent>
                    <Typography component="h5" variant="h5" gutterBottom>
                        {account.role === 'company' ? t("contractview.proccontracts.account.role.distributor") + t(offer.distributorId.profile.name, {ns: 'names'}) : t("contractview.proccontracts.account.role.company") + t(offer.companyId.profile.name, {ns: 'names'})}
                    </Typography>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            {t("contractview.proccontracts.grid.crop")} {t((offer.cropId as Crop).name,{ns:'crop'}) + ' - ' + t((offer.cropId as Crop).grade,{ns:'crop'})}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {t("contractview.proccontracts.grid.contract.date")} {parseDateGrid(offer.contractDate)}
                        </Grid>
                    </Grid>       
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => DownloadInvoicePDF({ data: offer })}>{t("contractview.proccontracts.grid.button")}</Button>
                </CardActions>
            </Card>
        </Grid> 
    ));

    return (
        <>
            <Typography paddingTop={2} component="h4" variant="h4" textAlign="center" gutterBottom>{t("contractview.typo.title")}</Typography>

            {!procLoading && procContracts.length === 0 && !offerLoading && offerContracts.length === 0 && account.role === 'distributor' && 
                <Typography component="h6" variant="h6" textAlign="center" paddingBlockStart={3}>{t("contractview.typo.no.contract")}</Typography>
            }

            {!procLoading && procContracts.length === 0 && account.role === 'farmer' &&
                <Typography component="h6" variant="h6" textAlign="center" paddingBlockStart={3}>{t("contractview.typo.no.contract")}</Typography>
            }

            {!offerLoading && offerContracts.length === 0 && account.role === 'company' &&
                <Typography component="h6" variant="h6" textAlign="center" paddingBlockStart={3}>{t("contractview.typo.no.contract")}</Typography>
            }

            {/* Display procurement contracts if any */}
            {!procLoading && procContracts.length > 0 && 
                <Grid container>{procContracts}</Grid>
            }

            {/* Display offer contracts if any */}
            {!offerLoading && offerContracts.length > 0 && 
                <Grid container>{offerContracts}</Grid>
            }

            <Spinner open={spinner}/>
        </>
    )
}

export default ContractView;