import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';

const BellWithTooltip = ({number,amount,payer, desc}) => {
  const [hovered, setHovered] = useState(false);

  const sendSMS = async () => {
    await fetch("http://localhost:8080/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "+91"+number,
        message: `${payer} remainded you to pay ${amount} for ${desc}`,
      }),
    });

    toast.success("Notified user!")
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '125%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 10,
            opacity: 0.9,
          }}
        >
          Notify user!
        </div>
      )}

      <FontAwesomeIcon
        icon={faBell}
        style={{
          fontSize: '20px',
          color: 'orange',
          cursor: hovered ? 'pointer' : 'default',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={()=>sendSMS()}
      />
    </div>
  );
};

export default BellWithTooltip;
