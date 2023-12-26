import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, open, onClose, className ='' }) { // if nothing is passed as classname, it's just an empty string
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current; // lock in the value once it runs

    if (open) {
      modal.showModal();
    } 

    return () => modal.close(); // so the same value is used here in the cleanup function
  }, [open]);

  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}
