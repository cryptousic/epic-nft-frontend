import React, {useEffect, useState} from "react";
import {useWalletAndNetwork} from "../hooks/useWalletAndNetwork";
import {CircularProgress} from "@mui/material";
import {useMintNFTs} from "../hooks/useMintNFTs";

const Minter = () => {

    const TOTAL_MINT_COUNT = 50;

    const {currentAccount, connectWallet} = useWalletAndNetwork();
    const {askContractToMintNft, askContractForNumberOfMintedNFTs, mining, totalMinted} = useMintNFTs();

    // Render Methods
    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
        </button>
    );

    const renderMintUI = () => (
        <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
            Mint NFT
        </button>
    )

    useEffect(() => {
        askContractForNumberOfMintedNFTs();
    }, []);

    return(
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
    )
}

export default Minter;