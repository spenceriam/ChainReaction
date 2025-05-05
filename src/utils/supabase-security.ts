import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

/**
 * Supabase security utilities for the ChainReaction application
 */

/**
 * Creates client-side Row Level Security (RLS) policies
 * For client-side policy enforcement and security checks
 */

// Type for role-based access control (RBAC)
export type UserRole = 'anonymous' | 'user' | 'premium' | 'admin';

// Get user role based on user metadata and subscription status
export const getUserRole = async (user: User | null): Promise<UserRole> => {
  if (!user) return 'anonymous';
  
  // Check if the user has admin role in user metadata
  const isAdmin = user.app_metadata?.role === 'admin';
  if (isAdmin) return 'admin';
  
  // Check if user has premium subscription
  // In a real app, this would query a subscriptions table
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('is_premium')
    .eq('user_id', user.id)
    .single();
  
  if (subscription?.is_premium) return 'premium';
  
  return 'user';
};

// Check if user has access to a specific feature
export const hasAccessToFeature = async (
  featureName: string,
  user: User | null
): Promise<boolean> => {
  const role = await getUserRole(user);
  
  // Define feature access by role
  const featureAccess: Record<string, UserRole[]> = {
    'daily_challenge': ['user', 'premium', 'admin'],
    'unlimited_games': ['premium', 'admin'],
    'tournaments': ['premium', 'admin'],
    'profile_customization': ['premium', 'admin'],
    'admin_dashboard': ['admin'],
  };
  
  return featureAccess[featureName]?.includes(role) || false;
};

// Security utility to sanitize user input
export const sanitizeInput = (input: string): string => {
  // Basic sanitization - remove script tags, etc.
  return input
    .replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

// Utility to protect against SQL injection
export const secureDatabaseQuery = (
  table: string,
  columns: string[],
  conditions: Record<string, any>
) => {
  // Use Supabase's query builder which has built-in protection
  let query = supabase
    .from(table)
    .select(columns.join(','));
  
  // Apply conditions using the builder pattern
  Object.entries(conditions).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  
  return query;
};

// Create an audit log for sensitive operations
export const createAuditLog = async (
  user: User | null,
  action: string,
  details: Record<string, any>
) => {
  return await supabase
    .from('audit_logs')
    .insert({
      user_id: user?.id || 'anonymous',
      action,
      details,
      ip_address: 'client_side', // In real app, would use server to get IP
      timestamp: new Date().toISOString()
    });
}; 