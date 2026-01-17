import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import { LucideIcon } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  onRightIconClick?: () => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon: LeftIcon, rightIcon: RightIcon, onRightIconClick, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              <LeftIcon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-3 border rounded-lg text-neutral-900 placeholder-neutral-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent',
              'transition-all duration-200',
              error ? 'border-status-error' : 'border-neutral-300',
              LeftIcon && 'pl-10',
              RightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
            >
              <RightIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-status-error">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-neutral-500">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
