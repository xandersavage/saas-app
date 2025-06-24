'use server'; //very important

import { auth } from '@clerk/nextjs/server';
import { createSupabaseClient } from '@/lib/supabase';
export const createCompanion = async (formData: CreateCompanion) => {
  try {
    const { userId: author } = await auth();

    if (!author) throw new Error('You must be logged in to create a companion');

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('companions')
      .insert({ ...formData, author })
      .select();

    if (error || !data)
      throw new Error(error?.message || 'Failed to create a companion');

    return data[0];
  } catch (error) {
    console.error('Error creating companion:', error);
    throw error;
  }
};

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  try {
    const supabase = createSupabaseClient();

    let query = supabase.from('companions').select();

    if (subject && topic) {
      query = query
        .ilike('subject', `%${subject}%`)
        .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    } else if (subject) {
      query = query.ilike('subject', `%${subject}%`);
    } else if (topic) {
      query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if (error) throw new Error(error.message);

    return companions;
  } catch (error) {
    console.error('Error fetching all companions:', error);
    return [];
  }
};

export const getCompanion = async (id: string) => {
  try {
    if (!id) return null;

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('companions')
      .select()
      .eq('id', id);

    if (error) {
      console.error(error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching companion:', error);
    return null;
  }
};

export const addToSessionHistory = async (companionId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history').insert({
      companion_id: companionId,
      user_id: userId,
    });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error('Error adding to session history:', error);
    return null;
  }
};

export const getRecentSessions = async (limit = 10) => {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('session_history')
      .select('companions:companion_id (*)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
  } catch (error) {
    console.error('Error fetching recent sessions:', error);
    return [];
  }
};

export const getUserSessions = async (userId: string, limit = 10) => {
  try {
    if (!userId) return [];

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('session_history')
      .select('companions:companion_id (*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return [];
  }
};

export const getUserCompanions = async (userId: string) => {
  try {
    if (!userId) return [];

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('companions')
      .select()
      .eq('author', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error('Error fetching user companions:', error);
    return [];
  }
};

export const newCompanionPermissions = async () => {
  try {
    const { userId, has } = await auth();

    if (!userId) return false;

    const supabase = createSupabaseClient();

    let limit = 0;

    if (has({ plan: 'pro' })) {
      return true;
    } else if (has({ feature: '3_active_companions' })) {
      limit = 3;
    } else if (has({ feature: '10_active_companions' })) {
      limit = 10;
    }

    const { data, error } = await supabase
      .from('companions')
      .select('id', { count: 'exact' })
      .eq('author', userId);

    if (error) throw new Error(error.message);

    const companionCount = data?.length;

    if (companionCount >= limit) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('Error checking companion permissions:', error);
    return false;
  }
};
