import { supabase } from './supabase';
import { Source, Snapshot } from '../types';

export async function saveSource(data: {
  mode: string;
  url: string;
  title: string;
  raw_text: string;
  structured_json: any;
  brief_json: any;
  confidence_score?: number;
}): Promise<Source> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: source, error: sourceError } = await supabase
    .from('sources')
    .insert({
      user_id: user.id,
      mode: data.mode,
      scope: 'single',
      url: data.url,
      title: data.title
    })
    .select()
    .single();

  if (sourceError) throw sourceError;

  const { error: snapshotError } = await supabase
    .from('snapshots')
    .insert({
      source_id: source.id,
      user_id: user.id,
      raw_text: data.raw_text,
      structured_json: data.structured_json,
      brief_json: data.brief_json,
      confidence_score: data.confidence_score
    });

  if (snapshotError) throw snapshotError;

  return source;
}

export async function fetchSources(): Promise<Source[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchSourceWithSnapshot(id: string): Promise<Source & { snapshot: Snapshot }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: source, error: sourceError } = await supabase
    .from('sources')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (sourceError) throw sourceError;

  const { data: snapshot, error: snapshotError } = await supabase
    .from('snapshots')
    .select('*')
    .eq('source_id', id)
    .eq('user_id', user.id)
    .single();

  if (snapshotError) throw snapshotError;

  return { ...source, snapshot };
}

export async function deleteSource(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('sources')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}
