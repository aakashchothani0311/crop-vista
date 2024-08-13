import { FC } from 'react';
import { CircularProgress, Dialog } from '@mui/material';

/* Define the props type for the Spinner component */
type Props = {
    open: boolean;
}

/* Function that render a Dialog component that is controlled by the `open` prop */
const Spinner: FC<Props> = (props: Props) => {
    return (
        <Dialog open={props.open}>
            <CircularProgress />
        </Dialog>
    );
}

export default Spinner;