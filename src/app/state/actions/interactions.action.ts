import { createActionGroup, emptyProps } from '@ngrx/store';

export const interactionsActions = createActionGroup({
  source: 'Interactions',
  events: {
    handleDelete: emptyProps(),
    cancelDelete: emptyProps(),
    openForm: emptyProps(),
    closeForm: emptyProps(),
    editForm: emptyProps(),
    toggleTheme: emptyProps(),
  },
});
