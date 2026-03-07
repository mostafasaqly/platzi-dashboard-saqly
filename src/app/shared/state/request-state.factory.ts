import { RequestState } from '../models/request-state.model';

export function idleState(): RequestState {
  return {
    status: 'idle',
    errorMessage: null,
  };
}

export function loadingState(): RequestState {
  return {
    status: 'loading',
    errorMessage: null,
  };
}

export function successState(): RequestState {
  return {
    status: 'success',
    errorMessage: null,
  };
}

export function errorState(message: string): RequestState {
  return {
    status: 'error',
    errorMessage: message,
  };
}
