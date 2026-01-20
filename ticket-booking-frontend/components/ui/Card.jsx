import styles from './Card.module.css';

function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export default function Card({ as: Component = 'div', className = '', children, padding = 'md', ...props }) {
  const cardClass = classNames(styles.card, styles[padding] || '', className);
  return (
    <Component className={cardClass} {...props}>
      {children}
    </Component>
  );
}
