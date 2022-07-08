import { Web3Storage } from 'web3.storage';
import nftMinter from '../../utils/nftMinter.json';
import { ethers } from 'ethers';
import { Button } from '@mui/material';
import React from 'react';
import { useState, useEffect } from 'react';
import ImageLogo from './image.svg';
import './NftUploader.css';

const NftUploader = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    console.log('currentAccount:', currentAccount);
    const isWalletConnected = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log('Make sure you have Metamask!');
            return;
        } else {
            console.log('We have the ethreum object', ethereum);
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log('Found an authorized account:', account);
            setCurrentAccount(account);
        } else {
            console.log('No authorized account found');
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert('Get Metamask!');
                return;
            }
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected', accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const imageToNFT = async (e) => {
        const client = new Web3Storage({
            token: `${process.env.REACT_APP_API_KEY}`,
        });
        const image = e.target;
        console.log(image);

        const rootCid = await client.put(image.files, {
            name: 'experiment',
            maxRetries: 3,
        });
        const res = await client.get(rootCid);
        const files = await res.files();
        for (const file of files) {
            console.log('file.cid', file.cid);
            askContractToMintNft(file.cid);
        }
    };

    const askContractToMintNft = async (ipfs) => {
        const CONTRACT_ADDRESS = '0x096847E5E52824FBd6c04A7e101D1635F81C10c2';
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, nftMinter.abi, signer);
                console.log('Going to pop wallet noe to pay gas...');
                let nftTxn = await connectedContract.mintNFT('sample', ipfs);
                console.log('Mining...please wait.');
                await nftTxn.wait();
                console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
        </button>
    );

    useEffect(() => {
        isWalletConnected();
    }, []);

    return (
        <div className="outerBox">
            {currentAccount === '' ? renderNotConnectedContainer() : <p>If you choose image, you can mint your NFT</p>}
            <div className="title">
                <h2>NFTアップローダー</h2>
                <p>JpegかPngの画像ファイル</p>
            </div>
            <div className="nftUplodeBox">
                <div className="imageLogoAndText">
                    <img src={ImageLogo} alt="imagelogo" />
                    <p>ここにドラッグ＆ドロップしてね</p>
                </div>
                <input
                    className="nftUploadInput"
                    multiple
                    name="imageURL"
                    type="file"
                    accept=".jpg , .jpeg , .png"
                    onChange={imageToNFT}
                />
            </div>
            <p>または</p>
            <Button variant="contained">
                ファイルを選択
                <input className="nftUploadInput" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT} />
            </Button>
        </div>
    );
};

export default NftUploader;
