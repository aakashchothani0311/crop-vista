import { FC, FormEvent, useEffect, useState } from 'react';
import { GridTable, ResData, RowData, TableCellData } from '../common/GridTable';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { createSupply, getSupplies } from '../../services/supply-service';
import { getDemands } from '../../services/demand-service';
import { Demand } from '../../models/company';
import { Supply } from '../../models/farmer';
import { getCrops } from '../../services/crops-service';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { useTranslation } from 'react-i18next';
import { getAllCrops, getCropByName, loadCrops } from '../../store/crop-slice';
import { lookInSession } from '../../session/session';
import { Account } from '../../models/account';
import Spinner from '../common/Spinner';
import { differenceInDays } from 'date-fns';
import { toast, Toaster } from 'react-hot-toast';
import Crop from '../../models/crop';
import EnhancedPieChart, { PieData } from '../common/PieChart';
import ChartComp from '../common/ChartComp';

/* Type definition for MarketData */
type MarketData = {
    [key: string]: {
        [key: string]: {
            [key: number]: {
                nd?: number;
                ns?: number;
            }
        }
    }
};

/* Type definition for FormData */
type FormData = {
    [key: string]: string | number | undefined;
}

const valueFormatter = (value: number | null) => `${value} quintal`;

const series = [
    { dataKey: 'a', label: 'A', valueFormatter },
    { dataKey: 'b', label: 'B', valueFormatter },
]

const MarketView: FC = () => {

    const { t } = useTranslation(['marketview', 'crop']);

    const [demands, setDemands] = useState<Demand[]>([]);
    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [marketData, setMarketData] = useState<MarketData>({});
    const [marketGridData, setMarketGridData] = useState<RowData[]>([]);

    const [demandLoading, setDemandLoading] = useState<boolean>(true);
    const [supplyLoading, setSupplyLoading] = useState<boolean>(true);
    const [spinner, setSpinner] = useState<boolean>(true);

    const [showVisualization, setShowVisualization] = useState<boolean>(false);

    const [demandPie, setDemandPie] = useState<PieData[]>([]);
    const [supplyPie, setSupplyPie] = useState<PieData[]>([]);

    const [chartDemands, setChartDemands] = useState<ResData[]>([]);
    const [chartSupplies, setChartSupplies] = useState<ResData[]>([]);

    const [selectedRow, setSelectedRow] = useState<FormData>({crop: ''});
    const [showDialog, setShowDialog] = useState<boolean>(false);

    /* Retrieve account information from session */
    const account: Account = JSON.parse(lookInSession('account') as string);

    /* Select crops and crop by name from Redux store */
    const crops = useSelector(getAllCrops());
    const cropByName = useSelector(getCropByName(selectedRow.crop as string));

    /* Dispatch action to Redux store */
    const dispatch = useDispatch<AppDispatch>();

    /* Fetch demands, supplies, and crops on component mount */
    useEffect(() => {
        getDemands({})
        .then((response: Demand[] ) => response.length > 0 ? setDemands([...response]) : setDemandLoading(false))
        .catch((error: Error) => {
            setSupplyLoading(false);
            toast.error('Some error occured. Please refresh the page.');
            console.log('Error fetching demands', error)
        })

        getSupplies({})
        .then((response: Supply[]) => response.length > 0 ? setSupplies([...response]) : setSupplyLoading(false))
        .catch((error: Error) => {
            setSupplyLoading(false);
            toast.error('Some error occured. Please refresh the page.');
            console.log('Error fetching supplies', error);
        })

        if(crops.length == 0){
            getCrops()
            .then((response: Crop[]) => dispatch(loadCrops(response)))
            .catch((error: Error) => console.log('Error fetching crops', error))
        }
    }, []);

    /* Update market data with demands */
    useEffect(() => {
        const currDate = Date.now();

        demands.forEach(demand => {
            const cropName: string = demand.cropId.name;
            const cropGrade: string = demand.cropId.grade;
            const timeline: number = demand.timeline - differenceInDays(currDate, demand.createdDate);
            
            if(marketData[cropName]){
                if(marketData[cropName][cropGrade]){
                    const timelines = marketData[cropName][cropGrade];
                    if(timelines[timeline])
                        timelines[timeline].nd = timelines[timeline].nd ? timelines[timeline].nd ?? + demand.quantity : demand.quantity;
                    else
                        timelines[timeline] = {nd: demand.quantity};
                } else
                    marketData[cropName][cropGrade] = {[timeline]: {nd: demand.quantity}};
            } else
                marketData[cropName] = {[cropGrade]: {[timeline]: {nd: demand.quantity}}};
        })
        
        if(demands.length > 0) {
            parseDataToGrid();
            setDemandLoading(false);
        }   
    }, [demands]);
    
    /* Update market data with supplies */
    useEffect(() => {
        const currDate = Date.now();

        supplies.forEach(supply => {
            const cropName = supply.cropId.name;
            const cropGrade = supply.cropId.grade;
            const timeline: number = (supply.timeline - differenceInDays(currDate, supply.createdDate) as number);
            
            if(marketData[cropName]){
                if(marketData[cropName][cropGrade]){
                    const timelines = marketData[cropName][cropGrade];
                    if(timelines[timeline])
                        timelines[timeline].ns = timelines[timeline].ns ? timelines[timeline].ns ?? + supply.quantity : supply.quantity;
                    else
                        timelines[timeline] = {ns: supply.quantity};
                } else
                    marketData[cropName][cropGrade] = {[timeline]: {ns: supply.quantity}};
            } else
                marketData[cropName] = {[cropGrade]: {[timeline]: {ns: supply.quantity}}};
        })

        if(supplies.length > 0) {
            parseDataToGrid();
            setSupplyLoading(false);
        }
            
    }, [supplies])

    useEffect(() => {
        if(marketGridData.length > 0){
            const supply: PieData[] = [];
            const demand: PieData[] = [];

            let prevCrop = '';

            let dPie: PieData = {label: '', value: 0};
            let sPie: PieData = {label: '', value: 0};

            marketGridData.forEach((market: RowData, index: number) => {
                const row = market.resData as ResData;
                const nd: number = row.netDemand ? row.netDemand as number : 0;
                const ns: number = row.netSupply ? row.netSupply as number : 0;
    
                if(prevCrop == row.crop){
                    dPie.value += nd;
                    sPie.value += ns;
                } else {
                    if(index != 0){
                        if(dPie.value != 0)
                            demand.push({...dPie});

                        if(sPie.value != 0)
                            supply.push({...sPie});
                    }
                    dPie = {label: row.crop as string, value: nd};
                    sPie = {label: row.crop as string, value: ns};
                }
                prevCrop = row.crop as string;
            })

            if(dPie.value != 0)
                demand.push({...dPie});

            if(sPie.value != 0)
                supply.push({...sPie});
    
            setDemandPie([...demand]);
            setSupplyPie([...supply]);
        }
    }, [marketGridData])

    useEffect(() => {
        if(marketGridData.length > 0){
            const demand: ResData[] = [];
            const supply: ResData[] = [];
    
            let dChart = {crop: '', a: 0, b: 0};
            let sChart = {crop: '', a: 0, b: 0};

            let prevCrop = '';
    
            marketGridData.forEach((market: RowData, index: number) => {
                const row = market.resData as ResData;
                const crop: string = row.crop as string;
                const grade: string = row.grade as string;
                const nd: number = row.netDemand ? row.netDemand as number : 0;
                const ns: number = row.netSupply ? row.netSupply as number : 0;

                if(prevCrop == crop){
                    if(grade === 'A'){
                        dChart.a += nd;
                        sChart.a += ns;
                    } else if (grade === 'B'){
                        dChart.b += nd;
                        sChart.b += ns;
                    }
                } else {
                    if(index != 0){
                        if(dChart.a != 0 || dChart.b != 0)
                            demand.push({...dChart});

                        if(sChart.a != 0 || sChart.b != 0)
                            supply.push({...sChart});
                    }

                    dChart = {crop: crop, a: 0, b: 0}  
                    sChart = {crop: crop, a: 0, b: 0}

                    if(grade === 'A'){
                        dChart.a = nd;
                        sChart.a = ns;
                    } else if (grade === 'B'){
                        dChart.b = nd;
                        sChart.b = ns;
                    }
                } 

                prevCrop = crop;
            })

            if(dChart.a != 0 || dChart.b != 0)
                demand.push({...dChart});

            if(sChart.a != 0 || sChart.b != 0)
                supply.push({...sChart});
    
            setChartDemands([...demand]);
            setChartSupplies([...supply]);
        }
    }, [marketGridData])

    /* Update spinner state based on loading states */
    useEffect(() => {
        setSpinner(supplyLoading || demandLoading);
    }, [supplyLoading, demandLoading])

    /* Define headers for the market grid table */
    const marketGridHeaders = [t("marketview.header.crop"), t("marketview.header.grade"), t("marketview.header.demand"), t("marketview.header.timeline"), t("marketview.header.supply")];
  
    if(account.role === 'farmer' || account.role === 'distributor')
        marketGridHeaders.push('');

    /* Convert market data to grid format */
    const parseDataToGrid = () => {
        const tempGridData: RowData[] = [];
       
        Object.keys(marketData).sort().forEach((crop: string) => {            
            Object.keys(marketData[crop]).sort().forEach((grade: string) => {
                const timeline: {[key: number] : {nd?: number, ns?: number}} = marketData[crop][grade];
                Object.keys(timeline).sort().forEach((time: string) => {
                    const rowCells: TableCellData[] = [];
                    rowCells.push(
                        {key: 'crop', value: crop, ns: 'crop'},
                        {key: 'grade', value: grade, ns: 'crop'},
                        {key: 'netDemand', value: timeline[time].nd ? timeline[time].nd as number : 0},
                        {key: 'timeline', value: parseInt(time)},
                        {key: 'netSupply', value: timeline[time].ns ? timeline[time].ns as number : 0}
                    );

                    if(account.role === 'farmer')
                        rowCells.push({key: 'action', type: 'button', value: "marketview.profiletype.farmer.button.label", ns: 'marketview', handler: commit});

                    tempGridData.push({resData: { crop: crop, grade: grade, netDemand: timeline[time].nd as number, timeline: time, netSupply: timeline[time].ns as number },
                                        rowCells: rowCells});
                })
            })
        })

        setMarketGridData([...tempGridData]);
    }

    /* Handle action when a row is selected for committing */
    const commit = (selectedItem: RowData): void => {
        const temp: FormData = {};

        selectedItem.rowCells.forEach(row => {
            if(row.key === 'crop')
                temp.crop = t(row.value as string, {ns:'crop'});

            if(row.key === 'grade')
                temp.crop += ' - ' + t(row.value as string, {ns:'crop'}); 

            if(row.key === 'timeline')
                temp.timeline = row.value as number;
        })

        setSelectedRow(temp);
        setShowDialog(true);
    }

    /* Handle the creation of a new supply */
    const handleCreateSupply = (formJson: FormData): void => {
        setSpinner(true);
        setShowDialog(false);

        formJson.farmerId = account.child;
        formJson.cropId = (cropByName as Crop).id;
        formJson.timeline = selectedRow.timeline;
        delete formJson.crop;

        createSupply(formJson)
        .then((response: Supply) => {
            const netAmounts = marketData[(cropByName as Crop).name][(cropByName as Crop).grade][formJson.timeline as string];
            netAmounts.ns ? netAmounts.ns += response.quantity : netAmounts.ns = response.quantity;

            for(let i: number = 0; i < marketGridData.length; i++){
                const row = marketGridData[i].resData as ResData;
            
                if(row.crop === (cropByName as Crop).name && row.grade === (cropByName as Crop).grade && row.timeline == response.timeline){
                    row.netSupply ? row.netSupply = response.quantity : row.netSupply =+ response.quantity;

                    marketGridData[i].rowCells.forEach(r => {
                        if(r.key === 'netSupply'){
                            let temp: number = r.value as number;
                            temp += response.quantity;
                            r.value = temp;
                        }
                    })

                    marketGridData[i].resData = {...response};
                    break;
                }
            }

            setSpinner(false);
            toast.success('Supply created successfully!');
        })
        .catch((error: Error) => { 
            setSpinner(false);
            toast.error('Supply not created.');
            console.log('Error creating new supply', error)
        })
    }

    return (
        <>
            {/* Header of Market View */}
            <Typography paddingTop={2} component="h4" variant="h4" textAlign="center" gutterBottom>{t("marketview.title")}</Typography>
            
            {/* Display message if no market data is available */}
            {!spinner && marketGridData.length == 0 && 
                <Typography component="h6" variant="h6" textAlign="center">{t("marketview.no.supplies")}</Typography>
            }
            
            {/* Display market grid data if available */}
            {!spinner && marketGridData.length > 0 && 
                <Grid container spacing={2}>
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button onClick={() => setShowVisualization(true)}>{t("marketview.grid.button.visualize")}</Button>
                    </Grid>
                    {/* Display market grid Headers */}
                    <Grid item xs={12}>
                        <GridTable header={marketGridHeaders} data={marketGridData}></GridTable>
                    </Grid>
                    {/* Display additional information if account role is distributor and a row is selected */}
                    {account.role === 'distributor' && selectedRow.crop &&
                        <>
                            <Grid item xs={12}>
                                <Box padding={1} sx={{ boxShadow: "none", border: "1px solid #d1d1d1" }}>
                                    <Card sx={{ boxShadow: "none", border: "1px solid #d1d1d1", padding: 0 }}>
                                        <CardContent>
                                            <Grid container textAlign="center">
                                                <Grid item xs={3}>
                                                    <Typography>{t("marketview.grid.typo.crop")} {selectedRow.crop}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography>{t("marketview.grid.typo.timeline")} {selectedRow.timeline}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography>{t("marketview.grid.typo.demand")} {selectedRow.nd ? selectedRow.nd : 0}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography>{t("marketview.grid.typo.supply")} {selectedRow.ns ? selectedRow.ns : 0}</Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                    <Box paddingTop={2}>
                                        <Grid container spacing={3}>
                                            {/* Display distributor grid table */}
                                            <Grid item xs={12} md={6}>
                                                <Typography component="h5" variant="h5" textAlign="center">{t("marketview.distributor.table.title.demand")}</Typography>
                                                <GridTable header={['Name', 'Quantity']} data={[]}></GridTable>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography component="h5" variant="h5" textAlign="center">{t("marketview.distributor.table.title.supply")}</Typography>
                                                <GridTable header={['Name', 'Quantity']} data={[]}></GridTable>
                                            </Grid>

                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>
                        </>
                    }
                </Grid>
            }

            {/* Dialog for creating a new supply */}
            <Dialog open={showDialog} fullWidth onClose={() => setShowDialog(false)} 
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
                <DialogTitle component="h5" variant="h5" sx={{ textAlign: "center" }}>{t("marketview.profiletype.farmer.button.label")}</DialogTitle>
                {/* Form fields for supply creation */}
                <DialogContent>
                    <TextField name="crop" label={t("marketview.header.crop")} value={selectedRow.crop} disabled fullWidth margin="dense" />
                    <TextField name="quantity" label={t("marketview.dialog.txtfield.label.qty")} type="number" required fullWidth margin="dense" InputProps={{
                            endAdornment: <InputAdornment position="start">{t("marketview.dialog.txtfield.input.adornment")}</InputAdornment>,
                        }}
                    />
                    <TextField name="timeline" label="Enter number of days" value={selectedRow.timeline} disabled fullWidth margin="dense" />
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button type="submit" variant="contained">{t("marketview.dialog.button.confirm")}</Button>
                    <Button variant="outlined" onClick={() => setShowDialog(false)}>{t("marketview.dialog.button.cancel")}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showVisualization} onClose={() => setShowVisualization(false)} fullScreen>
                <Grid container spacing={2} padding={2}>
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button onClick={() => setShowVisualization(false)}>Close</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <EnhancedPieChart pieData={demandPie} label="Net Demands" />
                     </Grid>
                    <Grid item xs={12}>
                        <EnhancedPieChart pieData={supplyPie} label="Net Supplies" />
                    </Grid>
                    <Grid item xs={12}>
                        <ChartComp dataset={chartDemands} datakey="crop" label="Net Demands by Crop Grade" series={series} />
                     </Grid>
                    <Grid item xs={12}>
                        <ChartComp dataset={chartSupplies} datakey="crop" label="Net Supplies by Crop Grade" series={series} />
                    </Grid>
                </Grid>
            </Dialog>

            <Dialog open={showVisualization} onClose={() => setShowVisualization(false)} fullScreen>
                <Grid container spacing={2} padding={2}>
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button onClick={() => setShowVisualization(false)}>Close</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <EnhancedPieChart pieData={demandPie} label="Net Demands" />
                     </Grid>
                    <Grid item xs={12}>
                        <EnhancedPieChart pieData={supplyPie} label="Net Supplies" />
                    </Grid>
                    <Grid item xs={12}>
                        <ChartComp dataset={chartDemands} datakey="crop" label="Net Demands by Crop Grade" series={series} />
                     </Grid>
                    <Grid item xs={12}>
                        <ChartComp dataset={chartSupplies} datakey="crop" label="Net Supplies by Crop Grade" series={series} />
                    </Grid>
                </Grid>
            </Dialog>

            {/* Spinner component to show loading state */}
            <Spinner open={spinner}/>
            <Toaster />
        </>
    );
}

export default MarketView;