import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const Toast = () => {
  const { toastMessage, activeSection } = useApp();
  const [visible, setVisible] = useState(false);
  
  const isGame = ['letters', 'bloom', 'invaders', 'heartbeat', 'pop_pressure', 'tilted_minds'].includes(activeSection);

  useEffect(() => {
    if (toastMessage) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [toastMessage]);

  if (!toastMessage) return null;

  return (
    <div className={`toast ${visible ? 'show' : ''} ${isGame ? 'large' : ''}`} id="toast">
      {toastMessage}
    </div>
  );
};

export default Toast;
