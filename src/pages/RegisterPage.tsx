import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Mail, Lock, Eye, EyeOff, User, Phone, AtSign } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import SEO from '../components/SEO'

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone_number: yup.string().required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

type FormData = yup.InferType<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, error, clearError, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
      const { confirmPassword, ...registerData } = data
      await registerUser(registerData)
      navigate('/search')
    } catch (err) {
      // Error is handled by the store
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(/images/bg-register.jpg)' }}
    >
      <SEO 
        title="Register"
        description="Join Poolo - India's smart carpooling platform. Create your free account and start saving on daily commute."
        keywords="register poolo, join carpool, sign up ride sharing, create account"
      />
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <img src="/images/logo.png" alt="Poolo" className="h-14 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/80">Join our ride-sharing community</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/95 rounded-2xl shadow-card-lg p-6">
          {error && (
            <div className="bg-status-error/10 border border-status-error/20 text-status-error rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              leftIcon={User}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Username"
              type="text"
              placeholder="Choose a username"
              leftIcon={AtSign}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              leftIcon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              leftIcon={Phone}
              error={errors.phone_number?.message}
              {...register('phone_number')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              leftIcon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              leftIcon={Lock}
              rightIcon={showConfirmPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full" size="large" loading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-main font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
