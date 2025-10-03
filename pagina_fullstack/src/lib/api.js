import { supabase } from './supabase';

// Usuarios
export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
}

export async function addUser(user) {
  const { data, error } = await supabase.from('users').insert(user);
  if (error) {
    console.error("Error Supabase:", error.message);
    throw error;
  }
  console.log("Insertado en BD:", data);
  return data;
}

// Tareas
export async function getTasks(userId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function addTask(task) {
  const { data, error } = await supabase.from('tasks').insert(task);
  if (error) throw error;
  return data;
}

export async function updateTask(id, fields) {
  const { data, error } = await supabase.from('tasks').update(fields).eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}