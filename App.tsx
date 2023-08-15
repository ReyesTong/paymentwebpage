import React, { useEffect, useRef, useState } from "react";
import {
  Scrypt,
  ScryptProvider,
  SensiletSigner,
  ContractCalledEvent,
  ByteString,
  hash256,
  hash160,
  PubKey,
  toHex
} from "scrypt-ts";
import './App.css';
//import { Voting } from "./contracts/voting";


interface User {
  username: string;
  password: string;

}

const users: User[] = [
  { username: 'John Doe', password: '123456' },
  // Add more predefined users here if needed
];

const LoginPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      onLogin(user);
    } else {
      alert('Invalid username or password. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

const PaymentPage: React.FC<{ username: string; onLogout: () => void }> = ({
  username,
  onLogout,
}) => {
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);

  const handleConfirmTransaction = () => {
    // Here, you can perform additional actions related to the transaction confirmation if needed.
    setTransactionConfirmed(true);
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <p>Payment for {username}</p>
      {transactionConfirmed ? (
        <p>Transaction Confirmed! Thank you for your purchase.</p>
      ) : (
        <button onClick={handleConfirmTransaction}>Deposit</button>
      )}
      <button>Destroy</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};



const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <PaymentPage username={user.username} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
/*
const contract_id = {
  /** The deployment transaction id */
  //txId: "0871080448710bb3962ca9eb001d8cc3b5d652fa6f17c4779c5d4ab87c6019a4",
  /** The output index */
  //outputIndex: 0,
//};
/*
function App(){
  const predefinedCredentials = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    // Add more predefined credentials as needed
  ];
  const [PaymentContract, setContract] = useState<Payment>();
  const signerRef = useRef<SensiletSigner>();
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState<{
    txId: string;
    candidate: string;
  }>({
    txId: "",
    candidate: "",
  });
  
  const [loggedInUser, setLoggedInUser] = useState<string>(''); // To track logged-in user

  const handleLogin = (username: string, password: string) => {
    // Check if the provided credentials match predefined credentials
    const matchedCredentials = predefinedCredentials.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (matchedCredentials) {
      setLoggedInUser(username);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setLoggedInUser('');
    setError('');
  };

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setError("");
  };

  const handleSuccessClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess({
      txId: "",
      candidate: "",
    });
  };



  async function Payment(e:any) {
    handleSuccessClose(e);
    const signer = signerRef.current as SensiletSigner;

    if (PaymentContract && signer) {
      const {isAuthenticated,error} = await signer.requestAuth();
      if(!isAuthenticated){
        throw new Error(error);
      }

      await PaymentContract.connect(signer);
      const creatorPK = await signer.getDefaultPubKey();
      const creatorPKH = hash160(PubKey(toHex(creatorPK)))
      const depositAmount = 1;
      PaymentContract.methods.deposit(depositAmount,creatorPKH)
      PaymentContract.methods.destroy(creatorPKH)
    }
    

  }
  return( 
    <div className="App">
      {success.txId ? (
        <div className="success-message">
          <p>Transaction ID: {success.txId}</p>
          <p>You deposited {success.candidate}</p>
        </div>
      ) : (
        <div className="login-page">
          <h1>Login</h1>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
      {success.txId && (
        <div className="deposit-page">
          <h1>Welcome!</h1>
          <p>Deposit funds:</p>
          <button onClick={Payment}>Deposit</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
)
  
}
*/