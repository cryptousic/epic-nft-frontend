import twitterLogo from "../assets/twitter-logo.svg";
import React from "react";
import {CONTRACT_ADDRESS} from "../utils/config";

const TWITTER_HANDLE = 'natan_usic';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const RARIBLE_LINK = 'https://rinkeby.rarible.com/collection/';

export const Footer = () => {
    return(
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
    )
}