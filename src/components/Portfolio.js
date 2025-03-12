import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from "firebase/firestore";

export default function Portfolio({ userId }) {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", userId), (doc) => {
      setPortfolio(doc.data().portfolio);
    });
    return () => unsubscribe();
  }, [userId]);

  return (
    <div>
      <h1>Your AI Portfolio</h1>
      {portfolio && (
        <div>
          <p>Equity: {portfolio.equity}%</p>
          <p>Debt: {portfolio.debt}%</p>
        </div>
      )}
    </div>
  );
}
