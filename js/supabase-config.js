// ============================================
// SASH STUDIO - Supabase Configuration
// Using same database as original project
// ============================================

const SUPABASE_URL = 'https://vwmtarmddydcxrhbqdfc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3bXRhcm1kZHlkY3hyaGJxZGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzA5ODgsImV4cCI6MjA3NjQwNjk4OH0.kT3tlzqHSX_t6upw25lIExUvY0qvoyc84Ddx3I0Zm6I';

// Initialize Supabase client
let supabaseClient = null;

try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabaseClient = supabaseClient;
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Supabase SDK not loaded');
  }
} catch (error) {
  console.error('Error initializing Supabase:', error);
}

// Check if user is logged in
async function getCurrentUser() {
  if (!supabaseClient) return null;

  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Check if user is admin
async function isAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;

  try {
    const { data, error } = await supabaseClient
      .from('customers')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Sign in with email
async function signIn(email, password) {
  if (!supabaseClient) {
    return { error: { message: 'Supabase not initialized' } };
  }

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
}

// Sign up with email
async function signUp(email, password, metadata = {}) {
  if (!supabaseClient) {
    return { error: { message: 'Supabase not initialized' } };
  }

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
}

// Sign out
async function signOut() {
  if (!supabaseClient) return;

  try {
    await supabaseClient.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// Save estimate to database
async function saveEstimate(estimateData) {
  if (!supabaseClient) {
    return { error: { message: 'Supabase not initialized' } };
  }

  const user = await getCurrentUser();

  try {
    const { data, error } = await supabaseClient
      .from('estimates')
      .insert([{
        ...estimateData,
        user_id: user?.id || null,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving estimate:', error);
    return { data: null, error };
  }
}

// Load pricing configuration from database
async function loadPricingConfig() {
  if (!supabaseClient) {
    console.warn('Supabase not available, using default pricing');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .from('pricing_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error loading pricing config:', error);
    return null;
  }
}

// Export functions
window.getCurrentUser = getCurrentUser;
window.isAdmin = isAdmin;
window.signIn = signIn;
window.signUp = signUp;
window.signOut = signOut;
window.saveEstimate = saveEstimate;
window.loadPricingConfig = loadPricingConfig;
