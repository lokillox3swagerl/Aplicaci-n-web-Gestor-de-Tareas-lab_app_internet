// @ts-nocheck
import { supabase } from './supabase';

// UID desde el SSR
const UID = Number(document.querySelector('main')?.dataset.uid || 0);

// Helpers DOM
const $ = (q) => document.querySelector(q);
const el = {
  form: $('#frm'),
  msg: $('#msg'),
  id: $('input[name="id_tarea"]'),
  titulo: $('input[name="titulo"]'),
  descripcion: $('input[name="descripcion"]'),
  prioridad: $('select[name="prioridad"]'),
  estado: $('select[name="estado"]'),
  clear: $('#btn-clear'),
  cols: {
    por_hacer: $('#col-por_hacer'),
    en_progreso: $('#col-en_progreso'),
    finalizada: $('#col-finalizada')
  },
  counts: {
    por_hacer: $('#count-por_hacer'),
    en_progreso: $('#count-en_progreso'),
    finalizada: $('#count-finalizada')
  }
};

const ESTADOS = ['por_hacer','en_progreso','finalizada'];
const etiqueta = (e) => e==='por_hacer'?'Por hacer':e==='en_progreso'?'En progreso':'Finalizada';
const pillPri = (p) => p==='alta'?'danger':p==='media'?'warn':'mute';

// CRUD contra Supabase
const api = {
  list: async () => {
    const { data, error } = await supabase
      .from('tarea')
      .select('*')
      .eq('id_usuario', UID)
      .order('id_tarea', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  create: async (payload) => {
    const { data, error } = await supabase
      .from('tarea')
      .insert([{ id_usuario: UID, ...payload }])
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id_tarea, fields) => {
    const { data, error } = await supabase
      .from('tarea')
      .update(fields)
      .eq('id_tarea', id_tarea)
      .eq('id_usuario', UID)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },
  del: async (id_tarea) => {
    const { error } = await supabase
      .from('tarea')
      .delete()
      .eq('id_tarea', id_tarea)
      .eq('id_usuario', UID);
    if (error) throw error;
  }
};

let items = [];

const render = () => {
  ESTADOS.forEach(s => { el.cols[s].innerHTML=''; el.counts[s].textContent='0'; });
  const by = { por_hacer:[], en_progreso:[], finalizada:[] };
  items.forEach(t => by[t.estado]?.push(t));

  ESTADOS.forEach(s => {
    el.counts[s].textContent = by[s].length;
    by[s].forEach(t => {
      const card = document.createElement('article');
      card.className = 'card task-card shadow-sm';
      card.innerHTML = `
        <div class="card-body">
          <div class="task-head">
            <h3 class="h6 card-title">${t.titulo}</h3>
            <span class="pill ${pillPri(t.prioridad)}">${t.prioridad}</span>
          </div>
          ${t.descripcion ? `<p class="card-text">${t.descripcion}</p>`:''}
          <div class="task-meta">
            <span class="pill mute">${etiqueta(t.estado)}</span>
          </div>
          <div class="task-actions">
            ${t.estado!=='por_hacer'?`<button class="btn btn-ghost btn-prev">←</button>`:''}
            ${t.estado!=='finalizada'?`<button class="btn btn-primary btn-next">→</button>`:''}
            <span class="spacer"></span>
            <button class="btn btn-ghost btn-edit">Editar</button>
            <button class="btn btn-danger btn-del">Eliminar</button>
          </div>
        </div>
      `;

      card.querySelector('.btn-del')?.addEventListener('click', async () => {
        if (!confirm('¿Eliminar tarea?')) return;
        try { await api.del(t.id_tarea); await load(); } catch(e){ el.msg.textContent = e.message || 'Error'; }
      });

      card.querySelector('.btn-next')?.addEventListener('click', async () => {
        const idx = ESTADOS.indexOf(t.estado);
        const nuevo = ESTADOS[Math.min(idx+1, ESTADOS.length-1)];
        try { await api.update(t.id_tarea, { estado:nuevo }); await load(); } catch(e){ el.msg.textContent = e.message || 'Error'; }
      });

      card.querySelector('.btn-prev')?.addEventListener('click', async () => {
        const idx = ESTADOS.indexOf(t.estado);
        const nuevo = ESTADOS[Math.max(idx-1, 0)];
        try { await api.update(t.id_tarea, { estado:nuevo }); await load(); } catch(e){ el.msg.textContent = e.message || 'Error'; }
      });

      card.querySelector('.btn-edit')?.addEventListener('click', () => {
        el.id.value = t.id_tarea;
        el.titulo.value = t.titulo;
        el.descripcion.value = t.descripcion || '';
        el.prioridad.value = t.prioridad;
        el.estado.value = t.estado;
        window.scrollTo({ top:0, behavior:'smooth' });
      });

      el.cols[s].appendChild(card);
    });
  });
};

const load = async () => {
  el.msg.textContent = 'Cargando...';
  try { items = await api.list(); render(); el.msg.textContent=''; }
  catch(e){ el.msg.textContent = e.message || 'Error'; }
};

el.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(el.form).entries());
  const id_tarea = data.id_tarea; delete data.id_tarea;
  el.msg.textContent = 'Guardando...';
  try {
    if (id_tarea) await api.update(Number(id_tarea), data);
    else await api.create(data);
    el.form.reset();
    el.estado.value = 'por_hacer';
    el.prioridad.value = 'media';
    await load();
  } catch(e){ el.msg.textContent = e.message || 'Error'; }
});

el.clear.addEventListener('click', () => {
  el.form.reset();
  el.id.value = '';
  el.estado.value = 'por_hacer';
  el.prioridad.value = 'media';
  el.msg.textContent = '';
});

load();
