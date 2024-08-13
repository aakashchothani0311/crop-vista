import { FC } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';

export type PieData = {
    label: string,
    value: number
}

type Props = {
   pieData: PieData[];
   label: string;
}

const EnhancedPieChart: FC<Props> = (props: Props) => {
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
                <PieChart height={400}
                    series={[
                        {
                            data: props.pieData,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' } 
                        }
                    ]}
                    slotProps={{
                        legend: {
                            direction: 'column',
                            padding: -30
                        }
                    }}
                />
                <Typography component="h5" variant="h5" textAlign="center">{props.label}</Typography>
            </Box>
        </>
    );
};

export default EnhancedPieChart;