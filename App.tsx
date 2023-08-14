import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Scrypt,
  ScryptProvider,
  SensiletSigner,
  ContractCalledEvent,
  ByteString,
  hash160,
  PubKey,
  toHex,
  findSig,
  SignatureResponse
} from "scrypt-ts";
import { Voting } from './contracts/voting';
import artifact from '../artifacts/voting.json';
Voting.loadArtifact(artifact);

// `npm run deploycontract` to get deployment transaction id
const contract_id = {
  /** The deployment transaction id */
  txId: "0871080448710bb3962ca9eb001d8cc3b5d652fa6f17c4779c5d4ab87c6019a4",
  /** The output index */
  outputIndex: 0,
};

function App() {
  const [PaymentContract, setContract] = useState<payment>();
  const signerRef = useRef<SensiletSigner>();
  const [error, setError] = React.useState("");
  
  async function fetchContract() {
    try {
      const instance = await Scrypt.contractApi.getLatestInstance(
        Voting,
        contract_id
      );
      setContract(instance);
    } catch (error: any) {
      console.error("fetchContract error: ", error);
      setError(error.message);
    }
  }
  
  async function Deposit(e:any) {
    const signer = signerRef.current as SensiletSigner;

    if (PaymentContract && signer) {
      const { isAuthenticated, error } = await signer.requestAuth();
      if(!isAuthenticated) {
        throw new Error(error);
      }
      await PaymentContract.connect(signer);
      const nextInstance = PaymentContract.next();
      const studentPK = await signer.getDefaultPubKey();
      const depositAmount = 1n;
      PaymentContract.methods.deposit(depositAmount,
        (sigResps:SignatureResponse[]) => findSig(sigResps, studentPK),
        studentPK,{
          next:{
            instance: nextInstance,
            balance: PaymentContract.balance,
          },
        })
    }
  }

  async function Destroy(e:any) {
    const signer = signerRef.current as SensiletSigner;

    if (PaymentContract && signer) {
      const { isAuthenticated, error } = await signer.requestAuth();
      if(!isAuthenticated) {
        throw new Error(error);
      }
      await PaymentContract.connect(signer);
      const nextInstance = PaymentContract.next();
      const studentPK = await signer.getDefaultPubKey();
      PaymentContract.methods.destroy((sigResps:SignatureResponse[]) => findSig(sigResps, studentPK),studentPK,{
        next:{
          instance: nextInstance,
          balance: PaymentContract.balance,
        }
      }
      )
    }
  }


  return (
    <div className="center">
    <h1>Payment Management</h1>
    <p>Welcome to the payment management system. Use the buttons below to perform actions.</p>
    <button className="button" onClick={Deposit}>Deposit</button>
    <button className="button" onClick={Destroy}>Destroy</button>
    {error && <p className="error">{error}</p>}
  </div>
  );
}

export default App;
