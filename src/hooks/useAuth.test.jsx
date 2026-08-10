import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from '../context/auth/AuthProvider';
import useAuth from './useAuth';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('useAuth', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('inicia sin usuario si localStorage está vacío', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toBeNull();
    });

    it('recupera el usuario guardado en localStorage al inicializar', () => {
        localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Ragnarok1' }));

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toEqual({ id: 1, name: 'Ragnarok1' });
    });

    it('login guarda el usuario y el token en localStorage y en el estado', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login({ id: 1, name: 'Ragnarok1' }, 'fake-jwt-token');
        });

        expect(result.current.user).toEqual({ id: 1, name: 'Ragnarok1' });
        expect(localStorage.getItem('token')).toBe('fake-jwt-token');
        expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 1, name: 'Ragnarok1' });
    });

    it('logout limpia el usuario y el token', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login({ id: 1, name: 'Ragnarok1' }, 'fake-jwt-token');
        });
        act(() => {
            result.current.logout();
        });

        expect(result.current.user).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('updateUser fusiona los campos nuevos sin tocar el token', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login({ id: 1, name: 'Ragnarok1', avatarKey: 'default' }, 'fake-jwt-token');
        });
        act(() => {
            result.current.updateUser({ avatarKey: 'sakurachibi' });
        });

        expect(result.current.user).toEqual({ id: 1, name: 'Ragnarok1', avatarKey: 'sakurachibi' });
        expect(localStorage.getItem('token')).toBe('fake-jwt-token'); // el token no cambia
    });

    it('updateUser persiste el usuario fusionado en localStorage', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login({ id: 1, name: 'Ragnarok1' }, 'fake-jwt-token');
        });
        act(() => {
            result.current.updateUser({ name: 'NuevoNombre' });
        });

        expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 1, name: 'NuevoNombre' });
    });
});