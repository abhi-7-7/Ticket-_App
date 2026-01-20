import styles from './Button.module.css';

function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export default function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading;
  const buttonClass = classNames(styles.button, styles[variant] || styles.primary, loading && styles.loading, className);

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {children}
      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </button>
  );
}
