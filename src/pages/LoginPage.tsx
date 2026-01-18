import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Mail, Lock, Eye, EyeOff, Users, Wallet, Leaf } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import SEO from '../components/SEO'

const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

type FormData = yup.InferType<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, error, clearError, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      clearError()
      await login(data)
      navigate('/search')
    } catch (err) {
      // Error is handled by the store
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(/images/bg-login.jpg)' }}
    >
      <SEO 
        title="Login"
        description="Login to Poolo to find and share rides. Access your bookings, messages, and ride history."
        keywords="login poolo, carpool login, ride sharing login"
      />
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <img src="/images/logo.png" alt="Poolo" className="h-16 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-white/80">Login to find rides and share costs</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 rounded-2xl shadow-card-lg p-6 mb-6">
          {error && (
            <div className="bg-status-error/10 border border-status-error/20 text-status-error rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              leftIcon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              leftIcon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="text-right">
              <button type="button" className="text-sm text-primary-main hover:underline">
                Forgot Password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="large" loading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">OR</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-main font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/90 rounded-xl p-4 space-y-3">
          <Feature icon={Users} text="Share rides with others" color="text-primary-main" />
          <Feature icon={Wallet} text="Save money on fuel" color="text-secondary-main" />
          <Feature icon={Leaf} text="Reduce carbon footprint" color="text-secondary-main" />
        </div>
      </div>
    </div>
  )
}

function Feature({ icon: Icon, text, color }: { icon: any; text: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${color}`} />
      <span className="text-neutral-700 font-medium">{text}</span>
    </div>
  )
}
