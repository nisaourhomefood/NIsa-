import { z } from 'zod';

export const addressSchema = z.object({
  full_name: z.string().min(2, 'Full name is required (at least 2 characters)'),
  phone: z
    .string()
    .min(10, 'Enter a valid 10-digit mobile number')
    .max(10, 'Mobile number should be 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number starting with 6-9'),
  email: z.string().email('Enter a valid email address'),
  address_line1: z.string().min(5, 'House/Flat No. & Building Name is required'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z
    .string()
    .length(6, 'Pincode must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Enter a valid 6-digit Pincode'),
  landmark: z.string().optional(),
});

export const checkoutSchema = z.object({
  address: addressSchema,
  payment_method: z.enum(['cod', 'cashfree', 'razorpay', 'online_placeholder', 'upi'], {
    message: 'Please select a payment option',
  }),
  discount_code: z.string().optional(),
  notes: z.string().max(200, 'Notes cannot exceed 200 characters').optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
