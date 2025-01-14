import { createReducer, on } from '@ngrx/store';
import { interactionsActions } from '../actions/interactions.action';

export interface InteractionsState {
  wantsToDelete: boolean;
  isFormActive: boolean;
  isEditing: boolean;
  isDarkMode: boolean;
}

const initialState: InteractionsState = {
  wantsToDelete: false,
  isFormActive: false,
  isEditing: false,
  isDarkMode: false,
};

export const interactionsReducer = createReducer(
  initialState,

  on(interactionsActions.handleDelete, (state) => ({
    ...state,
    wantsToDelete: true,
  })),

  on(interactionsActions.cancelDelete, (state) => ({
    ...state,
    wantsToDelete: false,
  })),

  on(interactionsActions.openForm, (state) => ({
    ...state,
    isFormActive: true,
  })),

  on(interactionsActions.closeForm, (state) => ({
    ...state,
    isFormActive: false,
    isEditing: false,
  })),

  on(interactionsActions.editForm, (state) => ({
    ...state,
    isFormActive: true,
    isEditing: true,
  })),

  on(interactionsActions.toggleTheme, (state) => ({
    ...state,
    isDarkMode: !state.isDarkMode,
  }))
);
