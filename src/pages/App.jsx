import React, {useEffect, useState} from "react";
import '../styles/App.css';
import twitterLogo from '../assets/twitter-logo.svg';
import {ethers} from "ethers";
import myEpicNft from '../utils/MyEpicNFT.json';
import {CircularProgress} from "@mui/material";

const TWITTER_HANDLE = 'natan_usic';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const RARIBLE_LINK = 'https://rinkeby.rarible.com/collection/';
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0x71e1c4C3D42686c620E0A84D3714954802B64C8c";

const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [totalMinted, setTotalMinted] = useState(localStorage.getItem('totalMinted'));
    const [mining, setMining] = useState(false);

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
            setupEventListener()

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
                // Same stuff again
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

                await checkForNetwork();

                // THIS IS THE MAGIC SAUCE.
                // This will essentially "capture" our event when our contract throws it.
                // If you're familiar with webhooks, it's very similar to that!
                connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
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

    const askContractToMintNft = async () => {

        try {
            const {ethereum} = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

                setMining(false)

                await checkForNetwork();

                console.log("Going to pop wallet now to pay gas...")
                let nftTxn = await connectedContract.makeAnEpicNFT();

                setMining(true)
                console.log("Mining...please wait.")
                await nftTxn.wait();
                setMining(false)
                console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

                let totalMinted = await connectedContract.getTotalNFTsMintedSoFar();
                setTotalMinted(totalMinted)
                localStorage.setItem('totalMinted', totalMinted)
                console.log('totalMinted: ' + totalMinted)

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Render Methods
    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
        </button>
    );

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    const renderMintUI = () => (
        <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
            Mint NFT
        </button>
    )

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">My NFT Collection</p>
                    <p className="sub-text">
                        Each unique. Each beautiful. Discover your NFT today.
                    </p>
                    {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
                    <p className="sub-text">
                        Supply {totalMinted.toString()}/{TOTAL_MINT_COUNT}
                    </p>

                    {mining ?
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <CircularProgress color="secondary"/>
                        </div> : null}
                </div>
                <div className="footer-container">
                    <svg onClick={() => window.open(`${RARIBLE_LINK}${CONTRACT_ADDRESS}`, "_blank")}
                         className="rarible-logo" width="50" height="50" viewBox="0 0 40 40" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="8" fill="#FEDA03"></rect>
                        <path
                            d="M27.6007 19.8536C28.8607 19.5262 29.9817 18.5838 29.9817 16.6889C29.9817 13.5342 27.3031 12.8 23.8706 12.8H10.2V27.0064H15.9539V22.185H22.7793C23.8309 22.185 24.446 22.6016 24.446 23.6334V27.0064H30.2V23.4548C30.2 21.5203 29.1087 20.3 27.6007 19.8536ZM22.8785 18.3556H15.9539V16.9667H22.8785C23.6325 16.9667 24.0888 17.0659 24.0888 17.6612C24.0888 18.2564 23.6325 18.3556 22.8785 18.3556Z"
                            fill="black"></path>
                    </svg>

                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo}/>
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noreferrer"
                    >{`built by @${TWITTER_HANDLE}`}</a>

                </div>
            </div>
        </div>
    );
};

export default App;