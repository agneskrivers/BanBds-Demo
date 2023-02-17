import React, { FunctionComponent, memo } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Spinner } from 'react-bootstrap';

// Configs
import { GoogleAPI } from '@client/configs';

// Props
interface Props {
    lat: number;
    lng: number;
}

const Index: FunctionComponent<Props> = (props) => {
    // Hooks
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-scrip',
        googleMapsApiKey: GoogleAPI,
    });

    if (!isLoaded)
        return (
            <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
                <Spinner variant='primary' />
            </div>
        );

    return (
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={props}
            zoom={17}
        >
            <Marker position={props} />
        </GoogleMap>
    );
};

export default memo(Index);
