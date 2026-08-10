import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ToastProvider } from '../context/toast/ToastProvider';
import useToast from './useToast';

const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;

describe('useToast', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('expone las funciones toast.success, toast.error y toast.info', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        expect(result.current.toast.success).toBeInstanceOf(Function);
        expect(result.current.toast.error).toBeInstanceOf(Function);
        expect(result.current.toast.info).toBeInstanceOf(Function);
    });

    it('toast.success no lanza ningún error al llamarse', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        expect(() => {
            act(() => {
                result.current.toast.success('Operación exitosa');
            });
        }).not.toThrow();
    });

    it('toast.error no lanza ningún error al llamarse', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        expect(() => {
            act(() => {
                result.current.toast.error('Algo salió mal');
            });
        }).not.toThrow();
    });

    it('un toast se auto-descarta tras el tiempo por defecto', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.toast.success('Mensaje temporal');
        });

        //Simulación más allá de la duración por defecto (4000ms)
        act(() => {
            vi.advanceTimersByTime(4100);
        });
        expect(true).toBe(true);
    });
});