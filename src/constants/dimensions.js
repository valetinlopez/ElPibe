export const attributeDimensions = {
  TECHNICAL: 'technical',
  PHYSICAL: 'physical',
  TACTICAL: 'tactical',
  MENTAL: 'mental',
};

export const attributesByDimension = {
  technical: [
    { id: 'regate', label: 'Regate' },
    { id: 'control_balon', label: 'Control balón' },
    { id: 'pase_corto', label: 'Pase corto' },
    { id: 'pase_largo', label: 'Pase largo' },
    { id: 'tiro', label: 'Tiro' },
    { id: 'vision_juego', label: 'Visión de juego' },
  ],
  physical: [
    { id: 'velocidad', label: 'Velocidad' },
    { id: 'resistencia', label: 'Resistencia' },
    { id: 'fuerza', label: 'Fuerza' },
    { id: 'salto', label: 'Salto' },
    { id: 'agilidad', label: 'Agilidad' },
  ],
  tactical: [
    { id: 'posicionamiento', label: 'Posicionamiento' },
    { id: 'juego_aereo', label: 'Juego aéreo' },
    { id: 'marcaje', label: 'Marcaje' },
    { id: 'lectura_juego', label: 'Lectura del juego' },
  ],
  mental: [
    { id: 'liderazgo', label: 'Liderazgo' },
    { id: 'concentracion', label: 'Concentración' },
    { id: 'creatividad', label: 'Creatividad' },
    { id: 'determinacion', label: 'Determinación' },
  ],
};

export const dimensionLabels = {
  technical: 'Técnica',
  physical: 'Física',
  tactical: 'Táctica',
  mental: 'Mental',
};
