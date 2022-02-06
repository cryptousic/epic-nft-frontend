import { useEffect, useState } from 'react';
import {getEpicContract} from "../utils/getter"
import {CONTRACT_ADDRESS} from "../utils/config";

const RARIBLE_LINK = 'https://rinkeby.rarible.com/collection/';


export function useWalletAndNetwork(run) {
    const [currentAccount, setCurrentAccount] = useState('');

    const checkIfWalletIsConnected = async () => {
        const {ethereum} = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({method: 'eth_accounts'});

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account)

            // Setup listener! This is for the case where a user comes to our site
            // and ALREADY had their wallet connected + authorized.
            //setupEventListener()

        } else {
            console.log("No authorized account found")
        }
    }

    /*
    * Implement your connectWallet method here
    */
    const connectWallet = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            /*
            * Fancy method to request access to account.
            */
            const accounts = await ethereum.request({method: "eth_requestAccounts"});

            /*
            * Boom! This should print out public address once we authorize Metamask.
            */
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error)
        }
    }

    // Setup our listener.
    const setupEventListener = async () => {
        // Most of this looks the same as our function askContractToMintNft
        try {
            const {ethereum} = window;

            if (ethereum) {
                const epicContract = getEpicContract(ethereum);

                await checkForNetwork();

                // THIS IS THE MAGIC SAUCE.
                // This will essentially "capture" our event when our contract throws it.
                // If you're familiar with webhooks, it's very similar to that!
                epicContract.on("NewEpicNFTMinted", (from, tokenId) => {
                    console.log(from, tokenId.toNumber())
                    alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on Rarible. Here's the link: ${RARIBLE_LINK}${CONTRACT_ADDRESS}`)
                });

                console.log("Setup event listener!")

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const checkForNetwork = async () => {
        const {ethereum} = window;

        let chainId = await ethereum.request({method: 'eth_chainId'});
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4";
        if (chainId !== rinkebyChainId) {
            alert("You are not connected to the Rinkeby Test Network! Redirecting you to Rinkeby!");
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: '0x4'}],
            });
            window.location.reload();
        }
    }
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);


    return { currentAccount, connectWallet, checkForNetwork };
}
