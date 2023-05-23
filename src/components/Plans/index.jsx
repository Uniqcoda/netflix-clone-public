import React, { useEffect, useState, useCallback } from 'react';
import { collection, query, where, getDocs, doc, addDoc, onSnapshot } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import db from '../../utils/firebase';
import './index.css';

const STRIPE_API_KEY = process.env.REACT_APP_STRIPE_API_KEY;

function Plans() {
  const [products, setProducts] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const user = useSelector(selectUser);

  // Wrap in a `useCallback` to memoize the fetched subscription and 
  // prevent a refetch each time this component mounts, as long as user ID does nt change 
  const fetchSubscription = useCallback(async () => {
    const docRef = doc(db, 'customers', user.uid);
    const collectionRef = collection(docRef, 'subscriptions');
    const docSnap = await getDocs(collectionRef);

    docSnap.forEach((subscription) => {
      setSubscription({
        role: subscription.data().role,
        current_period_end: subscription.data().current_period_end.seconds,
        current_period_start: subscription.data().current_period_start.seconds,
      });
    });
  }, [user.uid]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const fetchProducts = async () => {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('active', '==', true));
    const querySnapshot = await getDocs(q);
    const productsObj = {};

    querySnapshot.forEach(async (productDoc) => {
      productsObj[productDoc.id] = productDoc.data();
      const priceSnap = await getDocs(collection(productDoc.ref, 'prices'));

      priceSnap.docs.forEach((price) => {
        productsObj[productDoc.id].prices = {
          priceId: price.id,
          priceData: price.data(),
        };
      });
    });

    setProducts(productsObj);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const loadCheckout = async (priceId) => {
    const docRef = doc(db, 'customers', user.uid);

    const checkoutRef = await addDoc(collection(docRef, 'checkout_sessions'), {
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

    onSnapshot(checkoutRef, async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        alert(`An error occurred: ${error.message}`);
      }
      if (sessionId) {
        const stripe = await loadStripe(STRIPE_API_KEY);
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className='plansScreen'>
      <br />
      {subscription && <p>Renewal date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}
      {products &&
        Object.entries(products).map(([productId, productData]) => {
          const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role);

          return (
            <div key={productId} className={`${isCurrentPackage && 'plansScreen__plan--disabled'} plansScreen__plan`}>
              <div className='plansScreen__info'>
                <h5>{productData.name}</h5>
                <h6>{productData.description}</h6>
              </div>
              <button onClick={() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}>
                {isCurrentPackage ? 'Current Package' : 'Subscribe'}
              </button>
            </div>
          );
        })}
    </div>
  );
}

export default Plans;
