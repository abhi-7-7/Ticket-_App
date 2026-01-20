import styles from './SectionHeader.module.css';

function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export default function SectionHeader({ title, eyebrow, description, align = 'left', className = '' }) {
  const headerClass = classNames(styles.header, styles[align] || styles.left, className);

  return (
    <div className={headerClass}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      {title && <h2 className={styles.title}>{title}</h2>}
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
