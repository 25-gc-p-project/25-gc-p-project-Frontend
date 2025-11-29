import clsx from 'clsx';

export default function Button({
  children,
  variant = 'green', // green | blue | danger
  mode = 'filled',
  width,
  height,
  fontSize,
  paddingX = 16,
  paddingY = 8,
  className,
  ...props
}) {
  const colorMap = {
    green: {
      filled: 'bg-brandGreen text-white hover:bg-emerald-600',
      outlined:
        'border border-brandGreen text-brandGreen hover:bg-brandGreen/10',
    },
    blue: {
      filled: 'bg-brandBlue text-white hover:bg-blue-600',
      outlined: 'border border-brandBlue text-brandBlue hover:bg-brandBlue/10',
    },
    danger: {
      filled: 'bg-brandDanger text-white hover:bg-red-600',
      outlined:
        'border border-brandDanger text-brandDanger hover:bg-brandDanger/10',
    },
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        colorMap[variant][mode],
        className
      )}
      style={{
        width,
        height,
        fontSize,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
