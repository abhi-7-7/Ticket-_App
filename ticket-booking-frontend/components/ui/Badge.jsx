import styles from './Badge.module.css';

function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export default function Badge({ children, variant = 'neutral', className = '', ...props }) {
  const badgeClass = classNames(styles.badge, styles[variant] || styles.neutral, className);
  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
}
