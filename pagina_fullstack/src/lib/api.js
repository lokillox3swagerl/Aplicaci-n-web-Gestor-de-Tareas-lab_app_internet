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

/** Lista tareas por usuario */
export async function getTasksByUser(id_usuario) {
  const { data, error } = await supabase
    .from('tarea')
    .select('*')
    .eq('id_usuario', id_usuario)
    .order('id_tarea', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/** Crea una tarea */
export async function createTask({ id_usuario, titulo, descripcion = '', prioridad = 'media', estado = 'por_hacer' }) {
  const payload = { id_usuario, titulo, descripcion, prioridad, estado };
  const { data, error } = await supabase
    .from('tarea')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

/** Actualiza campos de una tarea */
export async function updateTask(id_tarea, fields) {
  const { data, error } = await supabase
    .from('tarea')
    .update(fields)
    .eq('id_tarea', id_tarea)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

/** Elimina una tarea */
export async function deleteTask(id_tarea) {
  const { error } = await supabase
    .from('tarea')
    .delete()
    .eq('id_tarea', id_tarea);

  if (error) throw error;
  return true;
}