import classNames from 'classnames';

export default function SubmitButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={classNames(
        "w-full py-2 rounded-lg transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}