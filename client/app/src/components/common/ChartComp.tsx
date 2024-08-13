import { FC } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import { ResData } from './GridTable';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

type Props = {
    dataset: ResData[];
    datakey: string;
    series: { dataKey: string, label: string, valueFormatter: (value: number | null) => string }[];
    label: string;
}

const chartSetting = {
    yAxis: [
        {
            label: 'quintals',
        }
    ],
    sx: {
        margin: "1rem",
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-25px, 0)',
        },
        [`.${axisClasses.bottom} .${axisClasses.tickLabel}`]: {
            transform: 'rotateZ(45deg) translate(50px, -25px)',
        },      
    }
}

const ChartComp: FC<Props> = (props: Props) => {
    const theme = useTheme();

    return (
        <>
            <Box borderColor={theme.palette.primary.main} sx={{
                    borderWidth: 2,
                    borderStyle: "solid",
                    borderRadius: 1,
                    padding: "1rem"
                }} 
            >
                <BarChart dataset={props.dataset} height={450} series={ props.series } xAxis={[{ scaleType: "band", dataKey: props.datakey }]} 
                    {...chartSetting}
                />
                <Typography component="h5" variant="h5" textAlign="center">{props.label}</Typography>
            </Box>
        </>
    );
};

export default ChartComp;