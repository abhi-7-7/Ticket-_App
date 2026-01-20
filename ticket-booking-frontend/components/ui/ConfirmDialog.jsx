'use client';

import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Yes',
  cancelText = 'No',
  isDangerous = false
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        
        <div className={styles.actions}>
          <button 
            onClick={onCancel}
            className={styles.cancelBtn}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`${styles.confirmBtn} ${isDangerous ? styles.dangerous : ''}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
