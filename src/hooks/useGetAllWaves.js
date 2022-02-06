import { useEffect, useState } from 'react';
import { getWavePortalContract } from '../utils/getter';

export function useGetAllWaves() {
    const [wavesList, setWavesList] = useState([]);

    const getWavesList = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) return;

            const wavePortalContract = getWavePortalContract(ethereum);
            const waves = await wavePortalContract.getAllWaves();

            const wavesCleaned = waves.map(wave => {
                return {
                    address: wave.waver,
                    timestamp: new Date(wave.timestamp * 1000),
                    message: wave.message,
                    success: wave.success,
                };
            });

            setWavesList(wavesCleaned);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Listen in for emitter events!
     */
    useEffect(() => {

        let wavePortalContract;

        const onNewWave = (from, timestamp, message) => {
            console.log("NewWave", from, timestamp, message);
            setWavesList(prevState => [
                ...prevState,
                {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message: message,
                },
            ]);
        };

        if (window.ethereum) {
            wavePortalContract = getWavePortalContract(window.ethereum);
            wavePortalContract.on("NewWave", onNewWave);
        }

        return () => {
            if (wavePortalContract) {
                wavePortalContract.off("NewWave", onNewWave);
            }
        };
    }, []);

    return { wavesList, setWavesList, getWavesList };
}
