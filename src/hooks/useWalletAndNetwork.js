import { useEffect, useState } from 'react';

export function useWalletAndNetwork(run) {
    const [currentAccount, setCurrentAccount] = useState('');

    const accessWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log('Make sure you have metamask!');
            } else {
                console.log('We have the ethereum object', ethereum);
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log('Found an authorized account:', account);
                setCurrentAccount(account);
                run();
            } else {
                console.log('No authorized account found');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert('Get MetaMask!');
                return;
            }

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            console.log('Connected', accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        accessWallet();
    }, []);

    return { currentAccount, connectWallet };
}
