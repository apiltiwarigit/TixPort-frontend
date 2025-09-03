'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  ArrowRightIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeToNewsletter: true
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error and success when user starts typing
    if (error) {
      setError(null);
      setHasError(false);
    }
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setHasError(true);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service');
      setHasError(true);
      return;
    }

    const passwordRequirements = [
      { test: formData.password.length >= 8, message: 'Password must be at least 8 characters' },
      { test: /[A-Z]/.test(formData.password), message: 'Password must contain an uppercase letter' },
      { test: /[a-z]/.test(formData.password), message: 'Password must contain a lowercase letter' },
      { test: /\d/.test(formData.password), message: 'Password must contain a number' }
    ];

    const failedRequirement = passwordRequirements.find(req => !req.test);
    if (failedRequirement) {
      setError(failedRequirement.message);
      setHasError(true);
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        newsletter_subscribed: formData.subscribeToNewsletter
      });

      if (signUpError) {
        setError(signUpError.message || 'Failed to create account');
        setHasError(true);
        setIsLoading(false);
        return;
      } else {
        // Show success message briefly before redirect
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'One number', met: /\d/.test(formData.password) },
    { text: 'Passwords match', met: formData.password === formData.confirmPassword && formData.password !== '' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8 animate-fade-in-up">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Join TixPort
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Create your account to start buying tickets
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg animate-pulse">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-red-400 text-sm block">{error}</span>
                    <button
                      onClick={() => {
                        setError(null);
                        setHasError(false);
                      }}
                      className="text-red-300 hover:text-red-200 text-xs mt-1 underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg flex items-center space-x-3">
                <CheckIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-green-400 text-sm">{success}</span>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  leftIcon={<UserIcon className="h-5 w-5 text-gray-400" />}
                  placeholder="John"
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                />
              </div>

              {/* Email Field */}
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                placeholder="john.doe@example.com"
              />

              {/* Phone Field */}
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                leftIcon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
                placeholder="(555) 123-4567"
              />

              {/* Password Field */}
              <div>
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  }
                  placeholder="Create a strong password"
                />

                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <CheckIcon className={`h-3 w-3 mr-2 ${req.met ? 'text-green-500' : 'text-gray-500'}`} />
                        <span className={req.met ? 'text-green-400' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                leftIcon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                }
                placeholder="Confirm your password"
              />

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    required
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded mt-1"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-300">
                    I agree to the{' '}
                    <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    id="subscribeToNewsletter"
                    name="subscribeToNewsletter"
                    type="checkbox"
                    checked={formData.subscribeToNewsletter}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded mt-1"
                  />
                  <label htmlFor="subscribeToNewsletter" className="ml-2 block text-sm text-gray-300">
                    Subscribe to our newsletter for exclusive deals and event updates
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                disabled={isLoading || !!success}
                rightIcon={isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                ) : success ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <ArrowRightIcon className="h-4 w-4" />
                )}
              >
                {isLoading ? 'Creating Account...' : success ? 'Success!' : 'Create Account'}
              </Button>
            </form>

            {/* Social Register Divider */}
            <div className="mt-8 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Register Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
