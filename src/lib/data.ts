
export interface Colleague {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
  photoHint: string | null;
}

// This data is now primarily for seeding the database during development or for bulk uploads.
// The main source of truth will be Firestore.
export const colleagues: Colleague[] = [
  { id: '1', name: 'Ana Pérez', role: 'Diseñadora UX/UI', photoUrl: 'https://images.unsplash.com/photo-1711645169736-53327e726205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx3b21hbiUyMHNtaWxpbmd8ZW58MHx8fHwxNzY1MzE0MDgyfDA&ixlib=rb-4.1.0&q=80&w=1080', photoHint: 'woman smiling' },
  { id: '2', name: 'Carlos García', role: 'Desarrollador Backend', photoUrl: 'https://images.unsplash.com/photo-1749664511269-0aa31a10c6dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MHx8fHwxNzY1MzM3MzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080', photoHint: 'man professional' },
  { id: '3', name: 'Luisa Fernández', role: 'Gerente de Proyecto', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2NTMyNTc1NHww&ixlib=rb-4.1.0&q=80&w=1080', photoHint: 'woman portrait' },
  { id: '4', name: 'Jorge Martínez', role: 'Ingeniero de Datos', photoUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW4lMjBnbGFzc2VzfGVufDB8fHx8MTc2NTMwOTgyMHww&ixlib=rb-4.1.0&q=80&w=1080', photoHint: 'man glasses' },
  { id: '5', name: 'Sofía Rodríguez', role: 'Analista de Negocios', photoUrl: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3NjUzNDQ3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080', photoHint: 'woman professional' },
  { id: '6', name: 'Miguel González', role: 'Especialista en Marketing', photoUrl: 'https://images.unsplash.com/photo-1725866546799-4cc16f6cba23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW4lMjBzbWlsaW5nfGVufDB8fHx8MTc2NTI4ODQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080', photoHint: 'man smiling' },
  { id: '7', name: 'Valentina Torres', role: 'Desarrolladora Frontend', photoUrl: 'https://images.unsplash.com/photo-1662848586769-314289d4c8b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx3b21hbiUyMGdsYXNzZXN8ZW58MHx8fHwxNzY1MjcyOTYzfDA&ixlib=rb-4.1.0&q=80&w=1080', photoHint: 'woman glasses' },
  { id: '8', name: 'Diego Rojas', role: 'Administrador de Sistemas', photoUrl: 'https://images.unsplash.com/photo-1607031542107-f6f46b5d54e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjUyODg5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080', photoHint: 'man portrait' },
  { id: '9', name: 'Camila Díaz', role: 'Soporte Técnico', photoUrl: 'https://images.unsplash.com/photo-1664813495783-a7b19be83624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx3b21hbiUyMG91dGRvb3JzfGVufDB8fHx8MTc2NTMxNzUxNXww&ixlib=rb-4.1.0&q=80&w=1080', photoHint: 'woman outdoors' },
  { id: '10', name: 'Mateo Castillo', role: 'Diseñador Gráfico', photoUrl: 'https://images.unsplash.com/photo-1665832102447-a853788f620c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtYW4lMjBjYXN1YWx8ZW58MHx8fHwxNzY1MzE3MDc3fDA&ixlib=rb-4.1.0&q=80&w=1080', photoHint: 'man casual' },
  { id: '11', name: 'Isabella Vargas', role: 'Analista de Calidad (QA)', photoUrl: 'https://images.unsplash.com/photo-1763259405836-a86fcbc039b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx3b21hbiUyMHNtaWxpbmclMjBwcm9mZXNzaW9uYWx8ZW58MHx8fHwxNzY1MzcxOTg5fDA&ixlib=rb-4.1.0&q=80&w=1080', photoHint: 'woman smiling professional' },
  { id: '12', name: 'Sebastián Morales', role: 'Scrum Master', photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW4lMjBvZmZpY2V8ZW58MHx8fHwxNzY1MzAwNzIzfDA&ixlib.rb-4.1.0&q=80&w=1080', photoHint: 'man office' },
  { id: '13', name: 'Usuario sin Foto', role: 'Tester', photoUrl: null, photoHint: null },
];
