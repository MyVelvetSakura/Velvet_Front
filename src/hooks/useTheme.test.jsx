import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider } from '../context/theme/ThemeProvider';
import useTheme from './useTheme';

const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

describe('useTheme', () => {
    beforeEach(() => {
        document.documentElement.removeAttribute('data-theme');
    });

    it('inicia con el tema "sakura" por defecto', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        expect(result.current.theme).toBe('sakura');
    });

    it('aplica el atributo data-theme="sakura" en el html al inicializar', () => {
        renderHook(() => useTheme(), { wrapper });

        expect(document.documentElement.getAttribute('data-theme')).toBe('sakura');
    });

    it('setTheme cambia el estado y actualiza el atributo data-theme del html', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
            result.current.setTheme('clow');
        });

        expect(result.current.theme).toBe('clow');
        expect(document.documentElement.getAttribute('data-theme')).toBe('clow');
    });

    it('puede alternar entre ambos temas varias veces', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
            result.current.setTheme('clow');
        });
        expect(document.documentElement.getAttribute('data-theme')).toBe('clow');

        act(() => {
            result.current.setTheme('sakura');
        });
        expect(document.documentElement.getAttribute('data-theme')).toBe('sakura');
    });
});